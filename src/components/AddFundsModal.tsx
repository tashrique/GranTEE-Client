import React, { useState } from 'react';
import { depositFunds } from '../services/helper';

interface AddFundsModalProps {
  scholarshipId: string;
  onClose: () => void;
  onFundsAdded?: () => void;
}

export const AddFundsModal: React.FC<AddFundsModalProps> = ({ scholarshipId, onClose, onFundsAdded }) => {
  const [amount, setAmount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Convert scholarshipId to number if needed.
      await depositFunds(Number(scholarshipId), amount);
      alert('Funds added successfully!');
      if (onFundsAdded) onFundsAdded();
      onClose();
    } catch (error) {
      console.error('Error depositing funds:', error);
      alert('Error depositing funds.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
        <h2 className="text-xl font-bold mb-4">Add Funds</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
              Amount
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="mt-1 block w-full border border-gray-300 px-3 py-2 rounded"
              min="0"
              required
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              {loading ? 'Adding...' : 'Add Funds'}
            </button>
          </div>
        </form>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
      </div>
    </div>
  );
};