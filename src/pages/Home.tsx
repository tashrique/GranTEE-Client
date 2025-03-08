import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Clock, Lock, ChevronRight, Database, Award } from 'lucide-react';
import { Logo } from '../components/Logo.tsx';

function FeatureCard({ icon: Icon, title, description }: { icon: React.ElementType, title: string, description: string }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
      <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
        <Icon className="h-6 w-6 text-blue-600" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function ProcessStep({ number, title, description }: { number: number, title: string, description: string }) {
  return (
    <div className="flex items-start space-x-4">
      <div className="flex-shrink-0 h-8 w-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
        {number}
      </div>
      <div>
        <h3 className="font-semibold text-lg mb-1">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
}

export function Home() {
  return (
    <>
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Secure Your Future with GranTEE
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              The first decentralized scholarship platform powered by Trusted Execution Environment (TEE) technology
            </p>
            <Link
              to="/profile"
              className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition-colors inline-flex items-center"
            >
              Start Your Application <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div id="features" className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose GranTEE?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={Lock}
            title="Enhanced Privacy"
            description="Your data remains confidential and secure within our Trusted Execution Environment."
          />
          <FeatureCard
            icon={Brain}
            title="AI-Powered Decisions"
            description="Multiple AI agents work together to ensure fair and unbiased evaluations."
          />
          <FeatureCard
            icon={Clock}
            title="Rapid Processing"
            description="Get results in hours instead of weeks with our automated system."
          />
          <FeatureCard
            icon={Database}
            title="Blockchain Security"
            description="Immutable records and smart contracts ensure transparent fund distribution."
          />
          <FeatureCard
            icon={Database}
            title="Decentralized Control"
            description="No single entity controls the decision-making process."
          />
          <FeatureCard
            icon={Award}
            title="Merit-Based Awards"
            description="Fair evaluation based purely on merit and eligibility."
          />
        </div>
      </div>

      {/* Process Section */}
      <div id="process" className="bg-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How GranTEE Works</h2>
          <div className="max-w-3xl mx-auto space-y-12">
            <ProcessStep
              number={1}
              title="Application Submission"
              description="Submit your application through our blockchain-based smart contract with required details."
            />
            <ProcessStep
              number={2}
              title="Secure Processing"
              description="Your data is encrypted and processed within our Trusted Execution Environment."
            />
            <ProcessStep
              number={3}
              title="AI Consensus"
              description="Multiple AI agents evaluate your application independently to reach a fair decision."
            />
            <ProcessStep
              number={4}
              title="Fund Distribution"
              description="Approved scholarships are automatically distributed through smart contracts."
            />
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div id="stats" className="bg-blue-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">100%</div>
              <div className="text-blue-200">Transparent Process</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24hrs</div>
              <div className="text-blue-200">Average Processing Time</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">0%</div>
              <div className="text-blue-200">Human Bias</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to Secure Your Future?</h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          Join thousands of students who have already benefited from GranTEE's fair and transparent scholarship allocation system.
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            to="/profile"
            className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors"
          >
            Start Application
          </Link>
          {/* <Link
            to="/status"
            className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition-colors"
          >
            Check Status
          </Link> */}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <Logo />
              <p className="mt-4 text-sm">
                Revolutionizing scholarship allocation through blockchain technology and AI consensus.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Platform</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#process" className="hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#stats" className="hover:text-white transition-colors">Impact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center md:text-left">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                © 2025 GranTEE. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}