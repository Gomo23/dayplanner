package com.dayplanner.service;

import com.dayplanner.dto.TaskRequest;
import com.dayplanner.model.*;
import com.dayplanner.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepo;
    private final UserRepository userRepo;

    private User user(String email) {
        return userRepo.findByEmail(email).orElseThrow();
    }

    public Task create(TaskRequest req, String email) {
        return taskRepo.save(Task.builder()
                .title(req.getTitle())
                .description(req.getDescription())
                .priority(req.getPriority() != null ? req.getPriority() : Task.Priority.MEDIUM)
                .category(req.getCategory())
                .taskDate(req.getTaskDate() != null ? req.getTaskDate() : LocalDate.now())
                .taskTime(req.getTaskTime())
                .user(user(email))
                .build());
    }

    public List<Task> getAll(String email) {
        return taskRepo.findByUserOrderByTaskDateAscTaskTimeAsc(user(email));
    }

    public List<Task> getByDate(LocalDate date, String email) {
        return taskRepo.findByUserAndTaskDateOrderByTaskTimeAsc(user(email), date);
    }

    public List<Task> getHighPriority(String email) {
        return taskRepo.findByUserAndPriorityOrderByTaskDateAsc(user(email), Task.Priority.HIGH);
    }

    public Task toggle(Long id) {
        Task t = taskRepo.findById(id).orElseThrow();
        t.setDone(!t.isDone());
        return taskRepo.save(t);
    }

    public Task update(Long id, TaskRequest req) {
        Task t = taskRepo.findById(id).orElseThrow();
        t.setTitle(req.getTitle());
        t.setDescription(req.getDescription());
        t.setPriority(req.getPriority());
        t.setCategory(req.getCategory());
        t.setTaskDate(req.getTaskDate());
        t.setTaskTime(req.getTaskTime());
        return taskRepo.save(t);
    }

    public void delete(Long id) {
        taskRepo.deleteById(id);
    }

    public Map<String, Long> stats(String email) {
        User u = user(email);
        return Map.of("done", taskRepo.countByUserAndDoneTrue(u),
                      "pending", taskRepo.countByUserAndDoneFalse(u));
    }
}
