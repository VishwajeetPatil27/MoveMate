package com.movemate.community.service;

import com.movemate.community.dto.CreatePostRequest;
import com.movemate.community.dto.PostDto;
import com.movemate.community.dto.UpdatePostRequest;
import com.movemate.community.entity.*;
import com.movemate.community.repository.CommentRepository;
import com.movemate.community.repository.CommunityRepository;
import com.movemate.community.repository.LikeRepository;
import com.movemate.community.repository.PostRepository;
import com.movemate.user.entity.User;
import com.movemate.user.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional
public class PostService {

    private final PostRepository postRepository;
    private final CommunityRepository communityRepository;
    private final UserRepository userRepository;
    private final LikeRepository likeRepository;
    private final CommentRepository commentRepository;

    public PostService(PostRepository postRepository,
                       CommunityRepository communityRepository,
                       UserRepository userRepository,
                       LikeRepository likeRepository,
                       CommentRepository commentRepository) {
        this.postRepository = postRepository;
        this.communityRepository = communityRepository;
        this.userRepository = userRepository;
        this.likeRepository = likeRepository;
        this.commentRepository = commentRepository;
    }

    public PostDto createPost(String currentUserEmail, Long communityId, CreatePostRequest request) {
        User author = getUserByEmail(currentUserEmail);
        Community community = communityRepository.findById(communityId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Community not found"));

        if (community.getStatus() == CommunityStatus.ARCHIVED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot post in an archived community");
        }

        String sanitizedTitle = sanitizeHtml(request.getTitle());
        String sanitizedContent = sanitizeHtml(request.getContent());

        Post post = new Post(author, community, sanitizedTitle, sanitizedContent, request.getPostType());
        post = postRepository.save(post);

        return mapToDto(post, author.getId());
    }

    @Transactional(readOnly = true)
    public Page<PostDto> getCommunityPosts(Long communityId, PostType postType, Pageable pageable, String currentUserEmail) {
        if (!communityRepository.existsById(communityId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Community not found");
        }

        User currentUser = currentUserEmail != null ? userRepository.findByEmail(currentUserEmail).orElse(null) : null;
        Long currentUserId = currentUser != null ? currentUser.getId() : null;

        Page<Post> postsPage;
        if (postType != null) {
            postsPage = postRepository.findActivePostsByCommunityAndType(communityId, postType, pageable);
        } else {
            postsPage = postRepository.findActivePostsByCommunity(communityId, pageable);
        }

        return postsPage.map(post -> mapToDto(post, currentUserId));
    }

    @Transactional(readOnly = true)
    public PostDto getPostById(Long postId, String currentUserEmail) {
        Post post = postRepository.findByIdAndStatusNot(postId, PostStatus.DELETED)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found or deleted"));

        User currentUser = currentUserEmail != null ? userRepository.findByEmail(currentUserEmail).orElse(null) : null;
        Long currentUserId = currentUser != null ? currentUser.getId() : null;

        return mapToDto(post, currentUserId);
    }

    public PostDto updatePost(String currentUserEmail, Long postId, UpdatePostRequest request) {
        User currentUser = getUserByEmail(currentUserEmail);
        Post post = postRepository.findByIdAndStatusNot(postId, PostStatus.DELETED)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found or deleted"));

        if (!post.getAuthor().getId().equals(currentUser.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not authorized to edit this post");
        }

        if (request.getTitle() != null && !request.getTitle().isBlank()) {
            post.setTitle(sanitizeHtml(request.getTitle()));
        }
        if (request.getContent() != null && !request.getContent().isBlank()) {
            post.setContent(sanitizeHtml(request.getContent()));
        }
        if (request.getPostType() != null) {
            post.setPostType(request.getPostType());
        }
        post.setStatus(PostStatus.EDITED);

        post = postRepository.save(post);
        return mapToDto(post, currentUser.getId());
    }

    public PostDto deletePost(String currentUserEmail, Long postId) {
        User currentUser = getUserByEmail(currentUserEmail);
        Post post = postRepository.findByIdAndStatusNot(postId, PostStatus.DELETED)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found"));

        if (!post.getAuthor().getId().equals(currentUser.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not authorized to delete this post");
        }

        post.setStatus(PostStatus.DELETED);
        post = postRepository.save(post);
        return mapToDto(post, currentUser.getId());
    }

    private PostDto mapToDto(Post post, Long currentUserId) {
        long likeCount = likeRepository.countByPostId(post.getId());
        long commentCount = commentRepository.countByPostIdAndStatusNot(post.getId(), CommentStatus.DELETED);
        boolean liked = currentUserId != null && likeRepository.existsByPostIdAndUserId(post.getId(), currentUserId);

        return PostDto.fromEntity(post, likeCount, commentCount, liked, currentUserId);
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
