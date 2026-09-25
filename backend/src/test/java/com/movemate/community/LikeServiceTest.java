package com.movemate.community;

import com.movemate.community.dto.PostDto;
import com.movemate.community.entity.*;
import com.movemate.community.repository.CommentRepository;
import com.movemate.community.repository.LikeRepository;
import com.movemate.community.repository.PostRepository;
import com.movemate.community.service.LikeService;
import com.movemate.user.entity.User;
import com.movemate.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LikeServiceTest {

    @Mock
    private LikeRepository likeRepository;

    @Mock
    private PostRepository postRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private CommentRepository commentRepository;

    @InjectMocks
    private LikeService likeService;

    private User liker;
    private Post post;
    private Like existingLike;

    @BeforeEach
    void setUp() {
        liker = new User();
        liker.setId(10L);
        liker.setEmail("liker@example.com");

        post = new Post();
        post.setId(100L);
        post.setAuthor(liker);
        post.setStatus(PostStatus.ACTIVE);

        existingLike = new Like(post, liker);
        existingLike.setId(50L);
    }

    @Test
    void toggleLike_SavesNewLike_WhenNotLiked() {
        when(userRepository.findByEmail("liker@example.com")).thenReturn(Optional.of(liker));
        when(postRepository.findByIdAndStatusNot(100L, PostStatus.DELETED)).thenReturn(Optional.of(post));
        when(likeRepository.findByPostIdAndUserId(100L, 10L)).thenReturn(Optional.empty());
        when(likeRepository.countByPostId(100L)).thenReturn(1L);
        when(likeRepository.existsByPostIdAndUserId(100L, 10L)).thenReturn(true);

        PostDto dto = likeService.toggleLike("liker@example.com", 100L);

        assertNotNull(dto);
        assertTrue(dto.isLikedByCurrentUser());
        assertEquals(1L, dto.getLikeCount());
        verify(likeRepository, times(1)).save(any(Like.class));
    }

    @Test
    void toggleLike_RemovesLike_WhenAlreadyLiked() {
        when(userRepository.findByEmail("liker@example.com")).thenReturn(Optional.of(liker));
        when(postRepository.findByIdAndStatusNot(100L, PostStatus.DELETED)).thenReturn(Optional.of(post));
        when(likeRepository.findByPostIdAndUserId(100L, 10L)).thenReturn(Optional.of(existingLike));
        when(likeRepository.countByPostId(100L)).thenReturn(0L);
        when(likeRepository.existsByPostIdAndUserId(100L, 10L)).thenReturn(false);

        PostDto dto = likeService.toggleLike("liker@example.com", 100L);

        assertNotNull(dto);
        assertFalse(dto.isLikedByCurrentUser());
        assertEquals(0L, dto.getLikeCount());
        verify(likeRepository, times(1)).delete(existingLike);
    }
}
