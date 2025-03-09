import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useWeb3 } from '../Web3Context';
import { Clock, Users, Settings } from 'lucide-react';
import { 
  getScholarshipsByCreator, 
  deleteScholarship,
} from '../services/helper';
import { Scholarship } from '../types';
import { AddFundsModal } from '../components/AddFundsModal';
import FundManagersModal from '../components/FundManagersModal';

const ManageScholarships: React.FC = () => {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { account } = useWeb3();
  const [fundsModalScholarshipId, setFundsModalScholarshipId] = useState<string | null>(null);
  const [fundManagersModalScholarshipId, setFundManagersModalScholarshipId] = useState<string | null>(null);

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

  const handleOpenFundsModal = (scholarshipId: string) => {
    setFundsModalScholarshipId(scholarshipId);
  };

  const openFundManagersModal = (scholarshipId: string) => {
    setFundManagersModalScholarshipId(scholarshipId);
  };

  const handleDelete = async (scholarshipId: string) => {
    if (!window.confirm('Are you sure you want to delete this scholarship?')) return;
    try {
      await deleteScholarship(Number(scholarshipId));
      alert('Scholarship deleted successfully.');
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
              <div key={scholarship.id} className="relative bg-white rounded-lg shadow-md overflow-hidden">
                {/* Gear icon for fund manager settings */}
                <button 
                  onClick={() => openFundManagersModal(scholarship.id)}
                  className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                >
                  <Settings className="h-6 w-6" />
                </button>
                <div className="p-6">
                  <h2 className="text-2xl font-semibold mb-2">
                    {scholarship.title}
                  </h2>
                  <div className="flex items-center space-x-4 text-gray-600 mb-4">
                    <div className="flex items-center">
                      Max grant: {scholarship.maxAmountPerApplicant.toLocaleString()} Wei
                    </div>
                    <div className="flex items-center">
                      Balance: {scholarship.balance.toLocaleString()} Wei
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-gray-600 mb-4">
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
                  </div>
                  <div className="flex justify-end">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleOpenFundsModal(scholarship.id)}
                        className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition-colors"
                      >
                        Add Funds
                      </button>
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
      {fundsModalScholarshipId && (
        <AddFundsModal
          scholarshipId={fundsModalScholarshipId}
          onClose={() => setFundsModalScholarshipId(null)}
          onFundsAdded={fetchScholarships}
        />
      )}
      {fundManagersModalScholarshipId && (
        <FundManagersModal
          scholarshipId={fundManagersModalScholarshipId}
          onClose={() => setFundManagersModalScholarshipId(null)}
        />
      )}
    </div>
  );
};

export default ManageScholarships;