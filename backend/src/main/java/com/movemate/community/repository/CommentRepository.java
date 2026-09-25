package com.movemate.community.repository;

import com.movemate.community.entity.Comment;
import com.movemate.community.entity.CommentStatus;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    List<Comment> findByPostIdAndStatusNot(Long postId, CommentStatus status, Sort sort);

    long countByPostIdAndStatusNot(Long postId, CommentStatus status);

    Optional<Comment> findByIdAndStatusNot(Long id, CommentStatus status);
}
