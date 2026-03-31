package com.dayplanner.controller;

import com.dayplanner.dto.NoteRequest;
import com.dayplanner.model.Note;
import com.dayplanner.service.NoteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/notes")
@RequiredArgsConstructor
public class NoteController {

    private final NoteService noteService;

    @GetMapping
    public ResponseEntity<List<Note>> getAll(@AuthenticationPrincipal UserDetails u) {
        return ResponseEntity.ok(noteService.getAll(u.getUsername()));
    }

    @PostMapping
    public ResponseEntity<Note> create(@RequestBody NoteRequest req, @AuthenticationPrincipal UserDetails u) {
        return ResponseEntity.ok(noteService.create(req, u.getUsername()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Note> update(@PathVariable Long id, @RequestBody NoteRequest req) {
        return ResponseEntity.ok(noteService.update(id, req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        noteService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
