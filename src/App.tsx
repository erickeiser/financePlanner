import React, { useState } from 'react';
import { Wallet, PiggyBank, ArrowUpCircle, ArrowDownCircle, Plus, Calculator, LogOut } from 'lucide-react';
import { Transaction } from './types';
import Modal from './components/Modal';
import TransactionForm from './components/TransactionForm';
import ExpenseChart from './components/ExpenseChart';
import PaycheckCard from './components/PaycheckCard';
import AuthGuard from './components/AuthGuard';
import { useAuth } from './contexts/AuthContext';
import { useTransactions } from './hooks/useTransactions';
import { useTransactionStats } from './hooks/useTransactionStats';
import { Toaster } from 'react-hot-toast';

const expenseCategories = ['Rent', 'Utilities', 'Groceries', 'Transportation', 'Entertainment', 'Shopping', 'Healthcare', 'Savings', 'Other'];
const incomeCategories = ['Salary', 'Freelance', 'Investments', 'Other'];

function Dashboard() {
  const { currentUser, logout } = useAuth();
  const { transactions } = useTransactions();
  const stats = useTransactionStats(transactions);
  
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showBudgetRule, setShowBudgetRule] = useState(false);

  const incomes = transactions
    .filter(t => t.type === 'income')
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Toaster position="top-right" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Wallet className="w-8 h-8 mr-2" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Financial Planner</h1>
              <p className="text-sm text-gray-500">{currentUser?.email}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowBudgetRule(!showBudgetRule)}
              className="flex items-center px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
            >
              <Calculator className="w-5 h-5 mr-2" />
              {showBudgetRule ? 'Hide' : 'Show'} 50/30/20
            </button>
            <button
              onClick={logout}
              className="flex items-center px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </button>
          </div>
        </div>

        {showBudgetRule && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
              <h3 className="text-lg font-semibold text-blue-700 mb-2">Needs (50%)</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Target (all income):</span>
                  <span className="font-medium text-blue-600">${stats.needsTarget.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Actual:</span>
                  <span className="font-medium text-blue-600">${stats.actualNeeds.toFixed(2)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full transition-all"
                    style={{ width: `${Math.min((stats.actualNeeds / stats.needsTarget) * 100, 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500">Housing, utilities, groceries, etc.</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-purple-100">
              <h3 className="text-lg font-semibold text-purple-700 mb-2">Wants (30%)</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Target (all income):</span>
                  <span className="font-medium text-purple-600">${stats.wantsTarget.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Actual:</span>
                  <span className="font-medium text-purple-600">${stats.actualWants.toFixed(2)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-purple-600 h-2.5 rounded-full transition-all"
                    style={{ width: `${Math.min((stats.actualWants / stats.wantsTarget) * 100, 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500">Entertainment, dining out, shopping, etc.</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-green-100">
              <h3 className="text-lg font-semibold text-green-700 mb-2">Savings (20%)</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Target (salary only):</span>
                  <span className="font-medium text-green-600">${stats.savingsTarget.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Actual:</span>
                  <span className="font-medium text-green-600">${stats.actualSavings.toFixed(2)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-green-600 h-2.5 rounded-full transition-all"
                    style={{ width: `${Math.min((stats.actualSavings / stats.savingsTarget) * 100, 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500">Savings, investments, debt repayment</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Wallet className="w-8 h-8 text-blue-500" />
                <div className="ml-3">
                  <p className="text-sm text-gray-500">Balance</p>
                  <p className="text-xl font-bold text-blue-600">${stats.balance.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-green-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <ArrowUpCircle className="w-8 h-8 text-green-500" />
                <div className="ml-3">
                  <p className="text-sm text-gray-500">Income</p>
                  <p className="text-xl font-bold text-green-600">${stats.totalIncome.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-red-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <ArrowDownCircle className="w-8 h-8 text-red-500" />
                <div className="ml-3">
                  <p className="text-sm text-gray-500">Expenses</p>
                  <p className="text-xl font-bold text-red-600">${stats.totalExpenses.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-purple-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <PiggyBank className="w-8 h-8 text-purple-500" />
                <div className="ml-3">
                  <p className="text-sm text-gray-500">Actual Savings</p>
                  <p className="text-xl font-bold text-purple-600">${stats.actualSavings.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={() => setShowIncomeModal(true)}
            className="flex items-center px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl transition-all transform hover:scale-105 shadow-lg hover:shadow-xl gap-2 font-medium text-lg"
          >
            <Plus className="w-6 h-6" />
            Add Income
          </button>
          <button
            onClick={() => setShowExpenseModal(true)}
            className="flex items-center px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl transition-all transform hover:scale-105 shadow-lg hover:shadow-xl gap-2 font-medium text-lg"
          >
            <Plus className="w-6 h-6" />
            Add Expense
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {incomes.map(income => (
              <PaycheckCard
                key={income.id}
                income={income}
                linkedExpenses={transactions.filter(t => 
                  t.type === 'expense' && t.linkedIncomeId === income.id
                )}
              />
            ))}
          </div>
          <div className="lg:col-span-1">
            <ExpenseChart transactions={transactions} />
          </div>
        </div>
      </div>

      <Modal
        isOpen={showIncomeModal}
        onClose={() => setShowIncomeModal(false)}
        title="Add Income"
        type="income"
      >
        <TransactionForm
          type="income"
          categories={incomeCategories}
          onSuccess={() => setShowIncomeModal(false)}
          incomes={[]}
        />
      </Modal>

      <Modal
        isOpen={showExpenseModal}
        onClose={() => setShowExpenseModal(false)}
        title="Add Expense"
        type="expense"
      >
        <TransactionForm
          type="expense"
          categories={expenseCategories}
          onSuccess={() => setShowExpenseModal(false)}
          incomes={incomes}
        />
      </Modal>
    </div>
  );
}

export default function App() {
  return (
    <AuthGuard>
      <Dashboard />
    </AuthGuard>
  );
}