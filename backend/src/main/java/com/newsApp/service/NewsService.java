package com.newsApp.service;

import com.newsApp.dto.*;
import com.newsApp.entity.Comment;
import com.newsApp.entity.News;
import com.newsApp.exception.ForbiddenException;
import com.newsApp.exception.ResourceNotFoundException;
import com.newsApp.repository.CommentRepository;
import com.newsApp.repository.NewsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NewsService {

    private final NewsRepository newsRepository;
    private final CommentRepository commentRepository;

    // List all news 
    @Transactional(readOnly = true)
    public List<NewsResponse> getAllNews() {
        return newsRepository.findAllByOrderByIdDesc()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    //Get single news article
    @Transactional(readOnly = true)
    public NewsResponse getNewsById(Long id) {
        News news = findNewsOrThrow(id);
        return toResponse(news);
    }

    // Create news
    @Transactional
    public NewsResponse createNews(NewsRequest req, Long authorId) {
        News news = News.builder()
                .title(req.getTitle().trim())
                .body(req.getBody().trim())
                .authorId(authorId)
                .build();
        news = newsRepository.save(news);
        return toResponse(news);
    }

    //Partial update 
    @Transactional
    public NewsResponse patchNews(Long id, PatchNewsRequest req, Long requesterId) {
        News news = findNewsOrThrow(id);

        if (!news.getAuthorId().equals(requesterId)) {
            throw new ForbiddenException("You are not allowed to edit this article.");
        }

        if (StringUtils.hasText(req.getTitle())) {
            news.setTitle(req.getTitle().trim());
        }
        if (StringUtils.hasText(req.getBody())) {
            news.setBody(req.getBody().trim());
        }

        news = newsRepository.save(news);
        return toResponse(news);
    }

    //Delete news
    @Transactional
    public void deleteNews(Long id, Long requesterId) {
        News news = findNewsOrThrow(id);

        if (!news.getAuthorId().equals(requesterId)) {
            throw new ForbiddenException("You are not allowed to delete this article.");
        }

        commentRepository.deleteByNewsId(id);
        newsRepository.delete(news);
    }

    //Add comment
    public CommentResponse addComment(Long newsId, CommentRequest req, Long userId) {
        if (!newsRepository.existsById(newsId)) {
            throw new ResourceNotFoundException("News not found with id: " + newsId);
        }

        Comment comment = Comment.builder()
                .newsId(newsId)
                .userId(userId)
                .text(req.getText().trim())
                .build();

        comment = commentRepository.save(comment);
        return CommentResponse.from(comment);
    }

    // Helpers
    private News findNewsOrThrow(Long id) {
        return newsRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("News not found with id: " + id));
    }

    private NewsResponse toResponse(News news) {
        List<CommentResponse> comments = commentRepository
                .findByNewsIdOrderByIdAsc(news.getId())
                .stream()
                .map(CommentResponse::from)
                .collect(Collectors.toList());
        return NewsResponse.from(news, comments);
    }
}
