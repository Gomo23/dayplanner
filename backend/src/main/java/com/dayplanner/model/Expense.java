package com.dayplanner.model;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
@Entity @Table(name = "expenses")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Expense {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String title;
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;
    private String category;
    @Enumerated(EnumType.STRING)
    private ExpenseType type = ExpenseType.EXPENSE;
    private LocalDate expenseDate;
    private String notes;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;
    private LocalDateTime createdAt = LocalDateTime.now();
    public enum ExpenseType { INCOME, EXPENSE }
}
