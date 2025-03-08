import { Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation.tsx';
import { Home } from './pages/Home.tsx';
import { Scholarships } from './pages/Scholarships.tsx';
import { Apply } from './pages/Apply.tsx';
import { Status } from './pages/Status.tsx';
import { Web3Provider } from './Web3Context.tsx';

function App() {
  return (
    <Web3Provider>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/scholarships" element={<Scholarships />} />
          <Route path="/apply/:scholarshipId" element={<Apply />} />
          <Route path="/status" element={<Status />} />
        </Routes>
      </div>
    </Web3Provider>
  );
}

export default App;