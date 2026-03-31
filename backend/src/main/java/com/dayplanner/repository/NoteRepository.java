package com.dayplanner.repository;
import com.dayplanner.model.Note;
import com.dayplanner.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface NoteRepository extends JpaRepository<Note, Long> {
    List<Note> findByUserOrderByPinnedDescUpdatedAtDesc(User user);
}
