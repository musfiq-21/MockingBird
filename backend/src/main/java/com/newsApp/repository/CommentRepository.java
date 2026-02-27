package com.newsApp.repository;

import com.newsApp.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByNewsIdOrderByIdAsc(Long newsId);
    void deleteByNewsId(Long newsId);
}
