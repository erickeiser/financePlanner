import { useState, useEffect } from 'react';
import { Transaction } from '../types';
import { subscribeToTransactions } from '../services/transactionService';
import { useAuth } from '../contexts/AuthContext';

export function useTransactions() {
  const { currentUser } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    async function setupSubscription() {
      if (!currentUser) {
        setTransactions([]);
        setLoading(false);
        return;
      }

      try {
        unsubscribe = await subscribeToTransactions(
          currentUser.uid,
          (updatedTransactions) => {
            setTransactions(updatedTransactions);
            setLoading(false);
            setError(null);
          }
        );
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load transactions'));
        setLoading(false);
      }
    }

    setupSubscription();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [currentUser]);

  return { transactions, loading, error };
}