import { Shield, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Logo() {
  return (
    <Link to="/" className="flex items-center space-x-2">
      <div className="relative">
        <Shield className="h-8 w-8 text-blue-500" />
        <CheckCircle className="h-4 w-4 text-blue-600 absolute -bottom-1 -right-1" />
      </div>
      <span className="text-2xl font-bold">Gran<span className="text-blue-600">TEE</span></span>
    </Link>
  );
}