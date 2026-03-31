package com.dayplanner.controller;

import com.dayplanner.dto.ExpenseRequest;
import com.dayplanner.model.Expense;
import com.dayplanner.service.ExpenseService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/expenses")
@RequiredArgsConstructor
public class ExpenseController {

    private final ExpenseService expenseService;

    @GetMapping
    public ResponseEntity<List<Expense>> getAll(@AuthenticationPrincipal UserDetails u) {
        return ResponseEntity.ok(expenseService.getAll(u.getUsername()));
    }

    @GetMapping("/date/{date}")
    public ResponseEntity<List<Expense>> getByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @AuthenticationPrincipal UserDetails u) {
        return ResponseEntity.ok(expenseService.getByDate(date, u.getUsername()));
    }

    @GetMapping("/summary/{year}/{month}")
    public ResponseEntity<Map<String, Object>> summary(
            @PathVariable int year, @PathVariable int month,
            @AuthenticationPrincipal UserDetails u) {
        return ResponseEntity.ok(expenseService.summary(month, year, u.getUsername()));
    }

    @PostMapping
    public ResponseEntity<Expense> create(@RequestBody ExpenseRequest req, @AuthenticationPrincipal UserDetails u) {
        return ResponseEntity.ok(expenseService.create(req, u.getUsername()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        expenseService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
