package com.newsApp.dto;

import com.newsApp.entity.News;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NewsResponse {
    private Long id;
    private String title;
    private String body;
    private Long authorId;         
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<CommentResponse> comments;

    public static NewsResponse from(News news, List<CommentResponse> comments) {
        return NewsResponse.builder()
                .id(news.getId())
                .title(news.getTitle())
                .body(news.getBody())
                .authorId(news.getAuthorId())
                .createdAt(news.getCreatedAt())
                .updatedAt(news.getUpdatedAt())
                .comments(comments)
                .build();
    }
}
