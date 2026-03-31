package com.dayplanner.dto;
import com.dayplanner.model.Task;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;
@Data
public class TaskRequest {
    private String title;
    private String description;
    private Task.Priority priority;
    private String category;
    private LocalDate taskDate;
    private LocalTime taskTime;
}
