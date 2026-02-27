package com.newsApp.dto;

import lombok.Data;

@Data
public class PatchNewsRequest {
    private String title;
    private String body;
}
