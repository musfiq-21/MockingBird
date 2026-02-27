package com.newsApp.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class NewsRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 300, message = "Title must be at most 300 characters")
    private String title;

    @NotBlank(message = "Body is required")
    @Size(min = 50, message = "Body must be at least 50 characters")
    private String body;
}
