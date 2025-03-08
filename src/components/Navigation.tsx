import { Link, useLocation } from 'react-router-dom';
import { Logo } from './Logo';
import { useWeb3 } from '../Web3Context.tsx';

export function Navigation() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const { account, connect, disconnect } = useWeb3();

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Logo />
          <div className="hidden md:flex space-x-6">
            {isHomePage ? (
              <>
                <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">Features</a>
                <a href="#process" className="text-gray-600 hover:text-blue-600 transition-colors">How It Works</a>
                <a href="#stats" className="text-gray-600 hover:text-blue-600 transition-colors">Impact</a>
              </>
            ) : (
              <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors">Home</Link>
            )}
            <Link to="/scholarships" className="text-gray-600 hover:text-blue-600 transition-colors">Scholarships</Link>
            <Link to="/status" className="text-gray-600 hover:text-blue-600 transition-colors">Check Status</Link>
            {account ? (
                <div>
                <span style={{ marginRight: '1rem' }}>Connected: {account}</span>
                <button onClick={disconnect}>Disconnect</button>
                </div>
            ) : (
                <button onClick={connect}>Connect Account</button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}