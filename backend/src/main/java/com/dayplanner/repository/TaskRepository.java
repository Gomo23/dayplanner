package com.dayplanner.repository;
import com.dayplanner.model.Task;
import com.dayplanner.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByUserOrderByTaskDateAscTaskTimeAsc(User user);
    List<Task> findByUserAndTaskDateOrderByTaskTimeAsc(User user, LocalDate date);
    List<Task> findByUserAndPriorityOrderByTaskDateAsc(User user, Task.Priority priority);
    long countByUserAndDoneTrue(User user);
    long countByUserAndDoneFalse(User user);
}
