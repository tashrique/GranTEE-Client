import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useWeb3 } from '../Web3Context';
import { Clock, Users, DollarSign } from 'lucide-react';
import { 
   
  getScholarshipsByCreator, 
  deleteScholarship 
} from '../services/helper';
import { Scholarship } from '../types';

const ManageScholarships: React.FC = () => {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { account } = useWeb3();

  const fetchScholarships = async () => {
    setLoading(true);
    try {
      if (account) {
        const createdScholarships = await getScholarshipsByCreator(account);
        setScholarships(createdScholarships);
      }
    } catch (error) {
      console.error('Error fetching scholarships:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScholarships();
  }, [account]);

  const handleDelete = async (scholarshipId: string) => {
    if (!window.confirm('Are you sure you want to delete this scholarship?')) return;
    try {
      // Convert the id to a number, as deleteScholarship expects a number.
      await deleteScholarship(Number(scholarshipId));
      alert('Scholarship deleted successfully.');
      // Refresh the list after deletion.
      fetchScholarships();
    } catch (error) {
      console.error('Error deleting scholarship:', error);
      alert('Error deleting scholarship.');
    }
  };


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Manage your scholarships</h1>
          <Link
            to="/create-scholarship"
            className="border-2 border-blue-600 border-dotted text-blue-600 px-8 py-4 rounded-full font-bold hover:bg-blue-50 transition-colors"
          >
            Create Scholarship
          </Link>
        </div>
        {!account && <p>Please connect your wallet to manage your scholarships.</p>}
        {loading && <p>Loading scholarships...</p>}
        {account && !loading && scholarships.length === 0 && (
            <p>You haven't created any scholarships yet.</p>
        )}
        {account && scholarships.length > 0 && (
            <div className="grid md:grid-cols-2 gap-6">
            {scholarships.map((scholarship) => (
                <div
                key={scholarship.id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                    <div className="p-6">
                    <h2 className="text-2xl font-semibold mb-2">
                    {scholarship.title}
                    </h2>
                    <div className="flex items-center space-x-4 text-gray-600 mb-4">
                    <div className="flex items-center">
                        <DollarSign className="h-5 w-5 mr-1" />
                        ${scholarship.maxAmountPerApplicant.toLocaleString()}
                    </div>
                    <div className="flex items-center">
                        <Clock className="h-5 w-5 mr-1" />
                        {new Date(scholarship.deadline).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                        <Users className="h-5 w-5 mr-1" />
                        {scholarship.applicants} applicants
                    </div>
                    </div>
                    <p className="text-gray-600 mb-4">{scholarship.description}</p>
                    <div className="mb-6">
                    <h3 className="font-semibold mb-2">Requirements:</h3>
                    <ul className="list-disc list-inside text-gray-600">
                        {scholarship.requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                        ))}
                    </ul>
                    <div className="flex justify-end">
                    <button
                        onClick={() => handleDelete(scholarship.id)}
                        className="bg-red-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition-colors"
                    >
                        Delete
                    </button>
                    </div>
                    </div>
                </div>
                </div>
            ))}
            </div>
        )}
    </div>
    </div>
  );
};

export default ManageScholarships;