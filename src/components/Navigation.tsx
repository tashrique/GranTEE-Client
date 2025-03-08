import { Link, useLocation } from 'react-router-dom';
import { Logo } from './Logo';
import { useWeb3 } from '../Web3Context.tsx';

export function Navigation() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const { account, connect, disconnect } = useWeb3();

  return (
    <nav className="bg-white shadow-sm">
      {/* Use a fixed height and flex centering */}
      <div className="container mx-auto h-16 px-4 flex items-center justify-between">
        <Logo />

        {/* For medium+ screens, show nav items */}
        <div className="hidden md:flex items-center space-x-6">
          {isHomePage ? (
            <>
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">
                Features
              </a>
              <a href="#process" className="text-gray-600 hover:text-blue-600 transition-colors">
                How It Works
              </a>
              <a href="#stats" className="text-gray-600 hover:text-blue-600 transition-colors">
                Impact
              </a>
            </>
          ) : (
            <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors">
              Home
            </Link>
          )}
          <Link to="/scholarships" className="text-gray-600 hover:text-blue-600 transition-colors">
            Scholarships
          </Link>
          <Link to="/status" className="text-gray-600 hover:text-blue-600 transition-colors">
            Applications
          </Link>

          {account ? (
            <div className="flex items-center space-x-3">
              <Link
                to="/profile"
                className="bg-blue-600 text-white px-5 py-2 rounded-full font-semibold hover:bg-blue-700 transition-colors"
              >
                {account.slice(0, 6)}...{account.slice(-4)}
              </Link>
              <button 
                onClick={disconnect} 
                className="bg-blue-600 text-white px-5 py-2 rounded-full font-semibold hover:bg-blue-700 transition-colors"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={connect}
              className="bg-blue-600 text-white px-5 py-2 rounded-full font-semibold hover:bg-blue-700 transition-colors"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}