import { useMemo } from 'react';
import { Transaction } from '../types';

export function useTransactionStats(transactions: Transaction[]) {
  return useMemo(() => {
    const salaryIncome = transactions
      .filter(t => t.type === 'income' && t.category === 'Salary' && t.receivedAmount)
      .reduce((sum, t) => sum + t.amount, 0);

    const totalIncome = transactions
      .filter(t => t.type === 'income' && t.receivedAmount)
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter(t => t.type === 'expense' && t.funded)
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpenses;

    const actualSavings = transactions
      .filter(t => t.type === 'expense' && t.category === 'Savings' && t.funded)
      .reduce((sum, t) => sum + t.amount, 0);

    const needsTarget = totalIncome * 0.5;
    const wantsTarget = totalIncome * 0.3;
    const savingsTarget = salaryIncome * 0.2;

    const actualNeeds = transactions
      .filter(t => t.type === 'expense' && t.budgetCategory === 'needs' && t.funded)
      .reduce((sum, t) => sum + t.amount, 0);

    const actualWants = transactions
      .filter(t => t.type === 'expense' && t.budgetCategory === 'wants' && t.funded)
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      salaryIncome,
      totalIncome,
      totalExpenses,
      balance,
      actualSavings,
      needsTarget,
      wantsTarget,
      savingsTarget,
      actualNeeds,
      actualWants
    };
  }, [transactions]);
}