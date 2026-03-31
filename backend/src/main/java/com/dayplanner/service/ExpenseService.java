package com.dayplanner.service;

import com.dayplanner.dto.ExpenseRequest;
import com.dayplanner.model.*;
import com.dayplanner.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ExpenseService {

    private final ExpenseRepository expenseRepo;
    private final UserRepository userRepo;

    private User user(String email) {
        return userRepo.findByEmail(email).orElseThrow();
    }

    public Expense create(ExpenseRequest req, String email) {
        return expenseRepo.save(Expense.builder()
                .title(req.getTitle())
                .amount(req.getAmount())
                .category(req.getCategory())
                .type(req.getType() != null ? req.getType() : Expense.ExpenseType.EXPENSE)
                .expenseDate(req.getExpenseDate() != null ? req.getExpenseDate() : LocalDate.now())
                .notes(req.getNotes())
                .user(user(email))
                .build());
    }

    public List<Expense> getAll(String email) {
        return expenseRepo.findByUserOrderByExpenseDateDesc(user(email));
    }

    public List<Expense> getByDate(LocalDate date, String email) {
        return expenseRepo.findByUserAndExpenseDateOrderByCreatedAtDesc(user(email), date);
    }

    public Map<String, Object> summary(int month, int year, String email) {
        User u = user(email);
        BigDecimal exp = expenseRepo.totalExpense(u, month, year);
        BigDecimal inc = expenseRepo.totalIncome(u, month, year);
        return Map.of("totalExpense", exp, "totalIncome", inc,
                      "balance", inc.subtract(exp));
    }

    public void delete(Long id) {
        expenseRepo.deleteById(id);
    }
}
