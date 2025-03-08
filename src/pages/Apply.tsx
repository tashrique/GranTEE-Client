import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Github, Linkedin, Twitter, DollarSign, Clock, Users } from 'lucide-react';

interface Scholarship {
  id: string;
  title: string;
  amount: number;
  deadline: string;
  applicants: number;
  description: string;
  requirements: string[];
}

const scholarships: Scholarship[] = [
  {
    id: 'tech-innovation-2025',
    title: 'Technology Innovation Scholarship',
    amount: 10000,
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
    amount: 15000,
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
    amount: 12000,
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
  const [socialConnections, setSocialConnections] = useState({
    github: false,
    linkedin: false,
    twitter: false,
    google: false,
  });

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

  const handleSocialConnect = (platform: keyof typeof socialConnections) => {
    setSocialConnections(prev => ({
      ...prev,
      [platform]: true
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', { scholarshipId, essay, socialConnections });
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
              ${scholarship.amount.toLocaleString()}
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
        
        {/* Social Connections */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Connect Your Accounts</h2>
          <p className="text-gray-600 mb-6">
            Connect your social accounts to strengthen your application. This helps us verify your identity and achievements.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => handleSocialConnect('google')}
              className={`p-4 rounded-lg border ${
                socialConnections.google ? 'bg-green-50 border-green-500' : 'border-gray-200 hover:border-blue-500'
              } flex flex-col items-center justify-center transition-colors`}
            >
              <img src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png" 
                   alt="Google" 
                   className="h-6 object-contain mb-2" />
              <span className="text-sm">
                {socialConnections.google ? 'Connected' : 'Connect Google'}
              </span>
            </button>
            
            <button
              onClick={() => handleSocialConnect('github')}
              className={`p-4 rounded-lg border ${
                socialConnections.github ? 'bg-green-50 border-green-500' : 'border-gray-200 hover:border-blue-500'
              } flex flex-col items-center justify-center transition-colors`}
            >
              <Github className="h-6 w-6 mb-2" />
              <span className="text-sm">
                {socialConnections.github ? 'Connected' : 'Connect GitHub'}
              </span>
            </button>

            <button
              onClick={() => handleSocialConnect('linkedin')}
              className={`p-4 rounded-lg border ${
                socialConnections.linkedin ? 'bg-green-50 border-green-500' : 'border-gray-200 hover:border-blue-500'
              } flex flex-col items-center justify-center transition-colors`}
            >
              <Linkedin className="h-6 w-6 mb-2" />
              <span className="text-sm">
                {socialConnections.linkedin ? 'Connected' : 'Connect LinkedIn'}
              </span>
            </button>

            <button
              onClick={() => handleSocialConnect('twitter')}
              className={`p-4 rounded-lg border ${
                socialConnections.twitter ? 'bg-green-50 border-green-500' : 'border-gray-200 hover:border-blue-500'
              } flex flex-col items-center justify-center transition-colors`}
            >
              <Twitter className="h-6 w-6 mb-2" />
              <span className="text-sm">
                {socialConnections.twitter ? 'Connected' : 'Connect Twitter'}
              </span>
            </button>
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