package com.dayplanner.controller;

import com.dayplanner.dto.TaskRequest;
import com.dayplanner.model.Task;
import com.dayplanner.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @GetMapping
    public ResponseEntity<List<Task>> getAll(@AuthenticationPrincipal UserDetails u) {
        return ResponseEntity.ok(taskService.getAll(u.getUsername()));
    }

    @GetMapping("/date/{date}")
    public ResponseEntity<List<Task>> getByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @AuthenticationPrincipal UserDetails u) {
        return ResponseEntity.ok(taskService.getByDate(date, u.getUsername()));
    }

    @GetMapping("/priority/high")
    public ResponseEntity<List<Task>> getHighPriority(@AuthenticationPrincipal UserDetails u) {
        return ResponseEntity.ok(taskService.getHighPriority(u.getUsername()));
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> stats(@AuthenticationPrincipal UserDetails u) {
        return ResponseEntity.ok(taskService.stats(u.getUsername()));
    }

    @PostMapping
    public ResponseEntity<Task> create(@RequestBody TaskRequest req, @AuthenticationPrincipal UserDetails u) {
        return ResponseEntity.ok(taskService.create(req, u.getUsername()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Task> update(@PathVariable Long id, @RequestBody TaskRequest req) {
        return ResponseEntity.ok(taskService.update(id, req));
    }

    @PatchMapping("/{id}/toggle")
    public ResponseEntity<Task> toggle(@PathVariable Long id) {
        return ResponseEntity.ok(taskService.toggle(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        taskService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
