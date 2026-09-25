package com.movemate.community;

import com.movemate.community.dto.CreatePostRequest;
import com.movemate.community.dto.PostDto;
import com.movemate.community.dto.UpdatePostRequest;
import com.movemate.community.entity.*;
import com.movemate.community.repository.CommentRepository;
import com.movemate.community.repository.CommunityRepository;
import com.movemate.community.repository.LikeRepository;
import com.movemate.community.repository.PostRepository;
import com.movemate.community.service.PostService;
import com.movemate.location.entity.Location;
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
class PostServiceTest {

    @Mock
    private PostRepository postRepository;

    @Mock
    private CommunityRepository communityRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private LikeRepository likeRepository;

    @Mock
    private CommentRepository commentRepository;

    @InjectMocks
    private PostService postService;

    private User author;
    private User nonAuthor;
    private Community community;
    private Post testPost;

    @BeforeEach
    void setUp() {
        author = new User();
        author.setId(1L);
        author.setEmail("author@example.com");

        nonAuthor = new User();
        nonAuthor.setId(2L);
        nonAuthor.setEmail("other@example.com");

        Location loc1 = new Location("India", "Maharashtra", "Sangli", "Center");
        loc1.setId(10L);
        Location loc2 = new Location("India", "Maharashtra", "Pune", "Hinjawadi");
        loc2.setId(20L);

        community = new Community("Pune Tech Hub", "pune-tech-hub", "Description", loc1, loc2, author);
        community.setId(100L);
        community.setStatus(CommunityStatus.ACTIVE);

        testPost = new Post(author, community, "Sample Title", "Sample Content", PostType.QUESTION);
        testPost.setId(500L);
    }

    @Test
    void createPost_Success_AndSanitizesHtml() {
        when(userRepository.findByEmail("author@example.com")).thenReturn(Optional.of(author));
        when(communityRepository.findById(100L)).thenReturn(Optional.of(community));
        when(postRepository.save(any(Post.class))).thenAnswer(i -> {
            Post p = i.getArgument(0);
            p.setId(501L);
            return p;
        });

        CreatePostRequest req = new CreatePostRequest();
        req.setTitle("<script>alert('xss')</script> Pune IT Advice");
        req.setContent("What is the best route to Hinjewadi?");
        req.setPostType(PostType.QUESTION);

        PostDto dto = postService.createPost("author@example.com", 100L, req);

        assertNotNull(dto);
        assertEquals("&lt;script&gt;alert('xss')&lt;/script&gt; Pune IT Advice", dto.getTitle());
        assertEquals("What is the best route to Hinjewadi?", dto.getContent());
        verify(postRepository, times(1)).save(any(Post.class));
    }

    @Test
    void updatePost_Forbidden_WhenNotAuthor() {
        when(userRepository.findByEmail("other@example.com")).thenReturn(Optional.of(nonAuthor));
        when(postRepository.findByIdAndStatusNot(500L, PostStatus.DELETED)).thenReturn(Optional.of(testPost));

        UpdatePostRequest req = new UpdatePostRequest();
        req.setContent("Unauthorized modification");

        ResponseStatusException ex = assertThrows(ResponseStatusException.class, () ->
                postService.updatePost("other@example.com", 500L, req)
        );

        assertEquals(HttpStatus.FORBIDDEN, ex.getStatusCode());
        assertTrue(ex.getReason().contains("not authorized"));
    }

    @Test
    void deletePost_Forbidden_WhenNotAuthor() {
        when(userRepository.findByEmail("other@example.com")).thenReturn(Optional.of(nonAuthor));
        when(postRepository.findByIdAndStatusNot(500L, PostStatus.DELETED)).thenReturn(Optional.of(testPost));

        ResponseStatusException ex = assertThrows(ResponseStatusException.class, () ->
                postService.deletePost("other@example.com", 500L)
        );

        assertEquals(HttpStatus.FORBIDDEN, ex.getStatusCode());
    }
}
