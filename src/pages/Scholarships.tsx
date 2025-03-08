import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useWeb3 } from '../Web3Context';
import { getScholarships } from '../services/helper';
import { Clock, Users } from 'lucide-react';
import { Scholarship } from '../types';

export function Scholarships() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const { account } = useWeb3();

  useEffect(() => {
    fetchScholarships();
  },
  [account]);

  const fetchScholarships = async () => {
    try{
      const scholarshipsResp = await getScholarships();
      setScholarships(scholarshipsResp);
    }catch(error){
      console.log("Error: ",error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Scholarships</h1>
          <Link
            to="/create-scholarship"
            className="border-2 border-blue-600 border-dotted text-blue-600 px-8 py-4 rounded-full font-bold hover:bg-blue-50 transition-colors"
          >
            Create Scholarship
          </Link>
        </div>
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
                  By: {scholarship.creator}
                </div>
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
                  <Link
                    to={`/apply/${scholarship.id}`}
                    className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Apply Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}