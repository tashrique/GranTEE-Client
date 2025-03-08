import React, { useState } from 'react';
import { useWeb3 } from '../Web3Context';
import { Scholarship } from '../types';

const CreateScholarship: React.FC = () => {
  const { account } = useWeb3();
  const [scholarship, setScholarship] = useState<Scholarship>({
    id: '',
    title: '',
    description: '',
    amount: 0,
    deadline: '',
    applicants: 0,
    requirements: [],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setScholarship((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here we store the scholarship data in localStorage as an example.
    // In production, you'd likely send this to a backend or blockchain.
    const existingScholarships = localStorage.getItem('scholarships');
    const scholarships = existingScholarships ? JSON.parse(existingScholarships) : [];
    scholarships.push(scholarship);
    localStorage.setItem('scholarships', JSON.stringify(scholarships));
    alert('Scholarship created successfully!');

    // Reset the form
    setScholarship({
        id: '',
        title: '',
        description: '',
        amount: 0,
        deadline: '',
        applicants: 0,
        requirements: [],
    });
  };

    // If no wallet is connected, show a message
    if (!account) {
        return (
            <div className="max-w-xl mx-auto p-4">
            <h1 className="text-xl font-bold mb-4">Create Scholarship</h1>
            <p>Please connect your wallet to create a scholarship.</p>
            </div>
        );
    }

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Create Scholarship</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Scholarship Title */}
        <div>
          <label htmlFor="title" className="block mb-1 font-medium">
            Scholarship Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={scholarship.title}
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 rounded"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block mb-1 font-medium">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={scholarship.description}
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 rounded"
            rows={4}
            required
          />
        </div>

        {/* Amount */}
        <div>
          <label htmlFor="amount" className="block mb-1 font-medium">
            Amount
          </label>
          <input
            id="amount"
            name="amount"
            type="text"
            value={scholarship.amount}
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 rounded"
            placeholder="e.g., $1000"
            required
          />
        </div>

        {/* Deadline */}
        <div>
          <label htmlFor="deadline" className="block mb-1 font-medium">
            Deadline
          </label>
          <input
            id="deadline"
            name="deadline"
            type="date"
            value={scholarship.deadline}
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 rounded"
            required
          />
        </div>

        {/* Eligibility */}
        <div>
          <label htmlFor="eligibility" className="block mb-1 font-medium">
            Requirements
          </label>
          <input
            id="eligibility"
            name="eligibility"
            type="text"
            value={scholarship.requirements}
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 rounded"
            placeholder="e.g., Must be a full-time student"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-5 py-2 rounded font-semibold hover:bg-blue-700 transition-colors"
        >
          Create Scholarship
        </button>
      </form>
    </div>
  );
};

export default CreateScholarship;