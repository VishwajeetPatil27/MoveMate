package com.movemate.community.repository;

import com.movemate.community.entity.Post;
import com.movemate.community.entity.PostStatus;
import com.movemate.community.entity.PostType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    @Query("SELECT p FROM Post p WHERE p.community.id = :communityId AND p.status <> 'DELETED' ORDER BY p.createdAt DESC")
    Page<Post> findActivePostsByCommunity(@Param("communityId") Long communityId, Pageable pageable);

    @Query("SELECT p FROM Post p WHERE p.community.id = :communityId AND p.postType = :postType AND p.status <> 'DELETED' ORDER BY p.createdAt DESC")
    Page<Post> findActivePostsByCommunityAndType(@Param("communityId") Long communityId, @Param("postType") PostType postType, Pageable pageable);

    Optional<Post> findByIdAndStatusNot(Long id, PostStatus status);
}
