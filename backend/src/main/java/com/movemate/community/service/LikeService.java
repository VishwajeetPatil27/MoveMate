package com.movemate.community.service;

import com.movemate.community.dto.PostDto;
import com.movemate.community.entity.Like;
import com.movemate.community.entity.Post;
import com.movemate.community.entity.PostStatus;
import com.movemate.community.repository.CommentRepository;
import com.movemate.community.repository.LikeRepository;
import com.movemate.community.repository.PostRepository;
import com.movemate.user.entity.User;
import com.movemate.user.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.movemate.notification.entity.NotificationType;
import com.movemate.notification.service.NotificationService;

import java.util.Optional;

@Service
@Transactional
public class LikeService {

    private final LikeRepository likeRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final CommentRepository commentRepository;
    private final NotificationService notificationService;

    public LikeService(LikeRepository likeRepository,
                       PostRepository postRepository,
                       UserRepository userRepository,
                       CommentRepository commentRepository,
                       NotificationService notificationService) {
        this.likeRepository = likeRepository;
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.commentRepository = commentRepository;
        this.notificationService = notificationService;
    }

    public PostDto toggleLike(String currentUserEmail, Long postId) {
        User user = getUserByEmail(currentUserEmail);
        Post post = postRepository.findByIdAndStatusNot(postId, PostStatus.DELETED)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found or deleted"));

        Optional<Like> existingLike = likeRepository.findByPostIdAndUserId(postId, user.getId());
        if (existingLike.isPresent()) {
            likeRepository.delete(existingLike.get());
        } else {
            Like like = new Like(post, user);
            likeRepository.save(like);

            // Trigger notification for post author if not liking own post
            if (!post.getAuthor().getId().equals(user.getId())) {
                notificationService.createNotification(
                        post.getAuthor(),
                        NotificationType.POST_LIKED,
                        "Post Liked",
                        user.getProfile() != null && user.getProfile().getFullName() != null
                                ? user.getProfile().getFullName() + " liked your post '" + post.getTitle() + "'"
                                : "Someone liked your post '" + post.getTitle() + "'",
                        post.getId()
                );
            }
        }

        long likeCount = likeRepository.countByPostId(postId);
        long commentCount = commentRepository.countByPostIdAndStatusNot(postId, com.movemate.community.entity.CommentStatus.DELETED);
        boolean liked = likeRepository.existsByPostIdAndUserId(postId, user.getId());

        return PostDto.fromEntity(post, likeCount, commentCount, liked, user.getId());
    }

    public PostDto likePost(String currentUserEmail, Long postId) {
        User user = getUserByEmail(currentUserEmail);
        Post post = postRepository.findByIdAndStatusNot(postId, PostStatus.DELETED)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found or deleted"));

        if (!likeRepository.existsByPostIdAndUserId(postId, user.getId())) {
            Like like = new Like(post, user);
            likeRepository.save(like);
        }

        long likeCount = likeRepository.countByPostId(postId);
        long commentCount = commentRepository.countByPostIdAndStatusNot(postId, com.movemate.community.entity.CommentStatus.DELETED);
        return PostDto.fromEntity(post, likeCount, commentCount, true, user.getId());
    }

    public PostDto unlikePost(String currentUserEmail, Long postId) {
        User user = getUserByEmail(currentUserEmail);
        Post post = postRepository.findByIdAndStatusNot(postId, PostStatus.DELETED)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found or deleted"));

        likeRepository.deleteByPostIdAndUserId(postId, user.getId());

        long likeCount = likeRepository.countByPostId(postId);
        long commentCount = commentRepository.countByPostIdAndStatusNot(postId, com.movemate.community.entity.CommentStatus.DELETED);
        return PostDto.fromEntity(post, likeCount, commentCount, false, user.getId());
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
    }
}
