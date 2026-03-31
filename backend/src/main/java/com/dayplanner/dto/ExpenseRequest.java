package com.dayplanner.dto;
import com.dayplanner.model.Expense;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
@Data
public class ExpenseRequest {
    private String title;
    private BigDecimal amount;
    private String category;
    private Expense.ExpenseType type;
    private LocalDate expenseDate;
    private String notes;
}
