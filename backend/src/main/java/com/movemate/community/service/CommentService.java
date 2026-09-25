package com.movemate.community.service;

import com.movemate.community.dto.CommentDto;
import com.movemate.community.dto.CreateCommentRequest;
import com.movemate.community.dto.UpdateCommentRequest;
import com.movemate.community.entity.Comment;
import com.movemate.community.entity.CommentStatus;
import com.movemate.community.entity.Post;
import com.movemate.community.entity.PostStatus;
import com.movemate.community.repository.CommentRepository;
import com.movemate.community.repository.PostRepository;
import com.movemate.user.entity.User;
import com.movemate.user.repository.UserRepository;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.movemate.notification.entity.NotificationType;
import com.movemate.notification.service.NotificationService;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public CommentService(CommentRepository commentRepository,
                          PostRepository postRepository,
                          UserRepository userRepository,
                          NotificationService notificationService) {
        this.commentRepository = commentRepository;
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    public CommentDto addComment(String currentUserEmail, Long postId, CreateCommentRequest request) {
        User author = getUserByEmail(currentUserEmail);
        Post post = postRepository.findByIdAndStatusNot(postId, PostStatus.DELETED)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found or deleted"));

        String sanitizedContent = sanitizeHtml(request.getContent());
        Comment comment = new Comment(post, author, sanitizedContent);
        comment = commentRepository.save(comment);

        // Trigger notification for post author if not commenting on own post
        if (!post.getAuthor().getId().equals(author.getId())) {
            notificationService.createNotification(
                    post.getAuthor(),
                    NotificationType.POST_COMMENTED,
                    "New Comment on Post",
                    author.getProfile() != null && author.getProfile().getFullName() != null
                            ? author.getProfile().getFullName() + " commented on your post '" + post.getTitle() + "'"
                            : "Someone commented on your post '" + post.getTitle() + "'",
                    post.getId()
            );
        }

        return CommentDto.fromEntity(comment, author.getId());
    }

    @Transactional(readOnly = true)
    public List<CommentDto> getPostComments(Long postId, String currentUserEmail) {
        if (!postRepository.existsById(postId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found");
        }

        User currentUser = currentUserEmail != null ? userRepository.findByEmail(currentUserEmail).orElse(null) : null;
        Long currentUserId = currentUser != null ? currentUser.getId() : null;

        List<Comment> comments = commentRepository.findByPostIdAndStatusNot(postId, CommentStatus.DELETED, Sort.by(Sort.Direction.ASC, "createdAt"));
        return comments.stream()
                .map(comment -> CommentDto.fromEntity(comment, currentUserId))
                .collect(Collectors.toList());
    }

    public CommentDto updateComment(String currentUserEmail, Long commentId, UpdateCommentRequest request) {
        User currentUser = getUserByEmail(currentUserEmail);
        Comment comment = commentRepository.findByIdAndStatusNot(commentId, CommentStatus.DELETED)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Comment not found or deleted"));

        if (!comment.getAuthor().getId().equals(currentUser.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not authorized to edit this comment");
        }

        if (request.getContent() != null && !request.getContent().isBlank()) {
            comment.setContent(sanitizeHtml(request.getContent()));
            comment.setStatus(CommentStatus.EDITED);
        }

        comment = commentRepository.save(comment);
        return CommentDto.fromEntity(comment, currentUser.getId());
    }

    public CommentDto deleteComment(String currentUserEmail, Long commentId) {
        User currentUser = getUserByEmail(currentUserEmail);
        Comment comment = commentRepository.findByIdAndStatusNot(commentId, CommentStatus.DELETED)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Comment not found"));

        if (!comment.getAuthor().getId().equals(currentUser.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not authorized to delete this comment");
        }

        comment.setStatus(CommentStatus.DELETED);
        comment = commentRepository.save(comment);
        return CommentDto.fromEntity(comment, currentUser.getId());
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
    }

    private String sanitizeHtml(String input) {
        if (input == null) return null;
        return input.replace("<", "&lt;").replace(">", "&gt;");
    }
}
