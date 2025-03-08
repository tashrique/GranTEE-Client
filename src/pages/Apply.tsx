import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DollarSign, Clock, Users } from 'lucide-react';
import { Scholarship } from '../types';

const scholarships: Scholarship[] = [
  {
    id: 'tech-innovation-2025',
    title: 'Technology Innovation Scholarship',
    maxAmountPerApplicant: 10000,
    deadline: '2025-06-30',
    applicants: 156,
    description: 'For students pursuing innovative technology projects and research in AI, blockchain, or quantum computing.',
    requirements: [
      'Minimum GPA of 3.5',
      'Major in Computer Science, Engineering, or related field',
      'Demonstrated experience in innovative tech projects',
      'Strong academic record'
    ]
  },
  {
    id: 'future-leaders-2025',
    title: 'Future Leaders in Tech',
    maxAmountPerApplicant: 15000,
    deadline: '2025-07-15',
    applicants: 203,
    description: 'Supporting aspiring tech leaders who demonstrate exceptional leadership potential and community impact.',
    requirements: [
      'Leadership experience in tech communities',
      'Open source contributions',
      'Community involvement',
      'Strong academic standing'
    ]
  },
  {
    id: 'diversity-tech-2025',
    title: 'Diversity in Tech Scholarship',
    maxAmountPerApplicant: 12000,
    deadline: '2025-08-01',
    applicants: 178,
    description: 'Promoting diversity and inclusion in technology fields by supporting underrepresented groups.',
    requirements: [
      'Member of underrepresented group in tech',
      'Demonstrated academic excellence',
      'Community involvement',
      'Tech-related major'
    ]
  }
];

export function Apply() {
  const { scholarshipId } = useParams();
  const navigate = useNavigate();
  const [essay, setEssay] = useState('');
  const [scholarship, setScholarship] = useState<Scholarship | null>(null);

  useEffect(() => {
    if (scholarshipId) {
      const found = scholarships.find(s => s.id === scholarshipId);
      if (found) {
        setScholarship(found);
      } else {
        navigate('/scholarships');
      }
    } else {
      navigate('/scholarships');
    }
  }, [scholarshipId, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', { scholarshipId, essay });
  };

  if (!scholarship) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Scholarship Application</h1>

        {/* Scholarship Details */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-2">{scholarship.title}</h2>
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
          <div>
            <h3 className="font-semibold mb-2">Requirements:</h3>
            <ul className="list-disc list-inside text-gray-600">
              {scholarship.requirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Application Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Scholarship Essay</h2>
          <div className="mb-6">
            <label htmlFor="essay" className="block text-sm font-medium text-gray-700 mb-2">
              Tell us why you deserve this scholarship (minimum 500 words)
            </label>
            <textarea
              id="essay"
              value={essay}
              onChange={(e) => setEssay(e.target.value)}
              className="w-full h-64 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Write your essay here..."
            />
            <div className="mt-2 text-sm text-gray-500">
              Word count: {essay.split(/\s+/).filter(Boolean).length} / 500 minimum
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition-colors"
              disabled={essay.split(/\s+/).filter(Boolean).length < 500}
            >
              Submit Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}