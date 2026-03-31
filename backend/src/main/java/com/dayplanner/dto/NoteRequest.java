package com.dayplanner.dto;
import lombok.Data;
@Data
public class NoteRequest {
    private String title;
    private String content;
    private String color;
    private boolean pinned;
}
