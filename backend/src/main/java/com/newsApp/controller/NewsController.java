package com.newsApp.controller;

import com.newsApp.dto.*;
import com.newsApp.entity.User;
import com.newsApp.service.NewsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/news")
@RequiredArgsConstructor
public class NewsController {

    private final NewsService newsService;

    @GetMapping
    public ResponseEntity<List<NewsResponse>> getAllNews() {
        return ResponseEntity.ok(newsService.getAllNews());
    }

    @GetMapping("/{id}")
    public ResponseEntity<NewsResponse> getNewsById(@PathVariable Long id) {
        return ResponseEntity.ok(newsService.getNewsById(id));
    }

    @PostMapping
    public ResponseEntity<NewsResponse> createNews(
            @Valid @RequestBody NewsRequest req,
            @AuthenticationPrincipal User currentUser) {
        NewsResponse created = newsService.createNews(req, currentUser.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }


    @PatchMapping("/{id}")
    public ResponseEntity<NewsResponse> patchNews(
            @PathVariable Long id,
            @RequestBody PatchNewsRequest req,
            @AuthenticationPrincipal User currentUser) {
        NewsResponse updated = newsService.patchNews(id, req, currentUser.getId());
        return ResponseEntity.ok(updated);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNews(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser) {
        newsService.deleteNews(id, currentUser.getId());
        return ResponseEntity.noContent().build();
    }

 
    @PostMapping("/{id}/comments")
    public ResponseEntity<CommentResponse> addComment(
            @PathVariable Long id,
            @Valid @RequestBody CommentRequest req,
            @AuthenticationPrincipal User currentUser) {
        CommentResponse comment = newsService.addComment(id, req, currentUser.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(comment);
    }
}
