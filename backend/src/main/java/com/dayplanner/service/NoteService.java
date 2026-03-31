package com.dayplanner.service;

import com.dayplanner.dto.NoteRequest;
import com.dayplanner.model.*;
import com.dayplanner.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NoteService {

    private final NoteRepository noteRepo;
    private final UserRepository userRepo;

    private User user(String email) {
        return userRepo.findByEmail(email).orElseThrow();
    }

    public Note create(NoteRequest req, String email) {
        return noteRepo.save(Note.builder()
                .title(req.getTitle())
                .content(req.getContent())
                .color(req.getColor() != null ? req.getColor() : "#fef9c3")
                .pinned(req.isPinned())
                .user(user(email))
                .build());
    }

    public List<Note> getAll(String email) {
        return noteRepo.findByUserOrderByPinnedDescUpdatedAtDesc(user(email));
    }

    public Note update(Long id, NoteRequest req) {
        Note n = noteRepo.findById(id).orElseThrow();
        n.setTitle(req.getTitle());
        n.setContent(req.getContent());
        n.setColor(req.getColor());
        n.setPinned(req.isPinned());
        n.setUpdatedAt(LocalDateTime.now());
        return noteRepo.save(n);
    }

    public void delete(Long id) {
        noteRepo.deleteById(id);
    }
}
