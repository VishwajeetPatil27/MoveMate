package com.movemate.community;

import com.movemate.community.dto.CommentDto;
import com.movemate.community.dto.CreateCommentRequest;
import com.movemate.community.dto.UpdateCommentRequest;
import com.movemate.community.entity.*;
import com.movemate.community.repository.CommentRepository;
import com.movemate.community.repository.PostRepository;
import com.movemate.community.service.CommentService;
import com.movemate.user.entity.User;
import com.movemate.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CommentServiceTest {

    @Mock
    private CommentRepository commentRepository;

    @Mock
    private PostRepository postRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private CommentService commentService;

    private User author;
    private User nonAuthor;
    private Post post;
    private Comment comment;

    @BeforeEach
    void setUp() {
        author = new User();
        author.setId(1L);
        author.setEmail("commenter@example.com");

        nonAuthor = new User();
        nonAuthor.setId(2L);
        nonAuthor.setEmail("other@example.com");

        post = new Post();
        post.setId(100L);
        post.setAuthor(author);
        post.setStatus(PostStatus.ACTIVE);

        comment = new Comment(post, author, "Great advice!");
        comment.setId(200L);
    }

    @Test
    void addComment_Success() {
        when(userRepository.findByEmail("commenter@example.com")).thenReturn(Optional.of(author));
        when(postRepository.findByIdAndStatusNot(100L, PostStatus.DELETED)).thenReturn(Optional.of(post));
        when(commentRepository.save(any(Comment.class))).thenAnswer(i -> {
            Comment c = i.getArgument(0);
            c.setId(201L);
            return c;
        });

        CreateCommentRequest req = new CreateCommentRequest();
        req.setContent("Wakad is a good area to live.");

        CommentDto dto = commentService.addComment("commenter@example.com", 100L, req);

        assertNotNull(dto);
        assertEquals("Wakad is a good area to live.", dto.getContent());
        verify(commentRepository, times(1)).save(any(Comment.class));
    }

    @Test
    void updateComment_Forbidden_WhenNotAuthor() {
        when(userRepository.findByEmail("other@example.com")).thenReturn(Optional.of(nonAuthor));
        when(commentRepository.findByIdAndStatusNot(200L, CommentStatus.DELETED)).thenReturn(Optional.of(comment));

        UpdateCommentRequest req = new UpdateCommentRequest();
        req.setContent("Hacked content");

        ResponseStatusException ex = assertThrows(ResponseStatusException.class, () ->
                commentService.updateComment("other@example.com", 200L, req)
        );

        assertEquals(HttpStatus.FORBIDDEN, ex.getStatusCode());
    }
}
