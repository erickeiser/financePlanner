import { collection, query, where, orderBy, onSnapshot, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Transaction } from '../types';
import toast from 'react-hot-toast';

export async function subscribeToTransactions(
  userId: string,
  onUpdate: (transactions: Transaction[]) => void
) {
  // First try with just the userId filter to avoid index issues
  const q = query(
    collection(db, 'transactions'),
    where('userId', '==', userId)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const transactionData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date.toDate(),
      })) as Transaction[];
      
      // Sort in memory instead of using orderBy to avoid index requirements
      const sortedTransactions = transactionData.sort((a, b) => b.date.getTime() - a.date.getTime());
      onUpdate(sortedTransactions);
    },
    (error) => {
      console.error('Error in transaction subscription:', error);
      toast.error('Failed to load transactions. Please refresh the page.');
    }
  );
}

export async function addTransaction(transaction: Omit<Transaction, 'id'>) {
  try {
    const docRef = await addDoc(collection(db, 'transactions'), {
      ...transaction,
      date: new Date(transaction.date), // Ensure date is a proper Firestore timestamp
      createdAt: new Date() // Add creation timestamp
    });
    toast.success(`${transaction.type} added successfully!`);
    return docRef.id;
  } catch (error) {
    console.error('Error adding transaction:', error);
    toast.error('Failed to add transaction');
    throw error;
  }
}

export async function updateTransaction(id: string, data: Partial<Transaction>) {
  try {
    const updateData = {
      ...data,
      date: data.date ? new Date(data.date) : undefined,
      updatedAt: new Date() // Add update timestamp
    };
    await updateDoc(doc(db, 'transactions', id), updateData);
    toast.success('Transaction updated successfully');
  } catch (error) {
    console.error('Error updating transaction:', error);
    toast.error('Failed to update transaction');
    throw error;
  }
}

export async function deleteTransaction(id: string) {
  try {
    await deleteDoc(doc(db, 'transactions', id));
    toast.success('Transaction deleted successfully');
  } catch (error) {
    console.error('Error deleting transaction:', error);
    toast.error('Failed to delete transaction');
    throw error;
  }
}