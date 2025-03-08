import { Link } from 'react-router-dom';
import { Clock, Users, DollarSign } from 'lucide-react';

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

export function Scholarships() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Available Scholarships</h1>
        <div className="grid md:grid-cols-2 gap-6">
          {scholarships.map((scholarship) => (
            <div key={scholarship.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
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