package com.dayplanner.model;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
@Entity @Table(name = "tasks")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Task {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String title;
    private String description;
    @Enumerated(EnumType.STRING)
    private Priority priority = Priority.MEDIUM;
    private String category;
    private LocalDate taskDate;
    private LocalTime taskTime;
    private boolean done = false;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;
    private LocalDateTime createdAt = LocalDateTime.now();
    public enum Priority { HIGH, MEDIUM, LOW }
}
