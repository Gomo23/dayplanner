package com.dayplanner.repository;
import com.dayplanner.model.Expense;
import com.dayplanner.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByUserOrderByExpenseDateDesc(User user);
    List<Expense> findByUserAndExpenseDateOrderByCreatedAtDesc(User user, LocalDate date);
    @Query("SELECT COALESCE(SUM(e.amount),0) FROM Expense e WHERE e.user=:user AND e.type='EXPENSE' AND FUNCTION('MONTH',e.expenseDate)=:month AND FUNCTION('YEAR',e.expenseDate)=:year")
    BigDecimal totalExpense(User user, int month, int year);
    @Query("SELECT COALESCE(SUM(e.amount),0) FROM Expense e WHERE e.user=:user AND e.type='INCOME' AND FUNCTION('MONTH',e.expenseDate)=:month AND FUNCTION('YEAR',e.expenseDate)=:year")
    BigDecimal totalIncome(User user, int month, int year);
}
