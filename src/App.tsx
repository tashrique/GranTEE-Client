import { Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation.tsx';
import { Home } from './pages/Home.tsx';
import { Scholarships } from './pages/Scholarships.tsx';
import { Apply } from './pages/Apply.tsx';
import { Applications } from './pages/Applications.tsx';
import { Web3Provider } from './Web3Context.tsx';
import Profile from './pages/Profile.tsx';
import CreateScholarship from './pages/CreateScholarship.tsx';
import ManageScholarships from './pages/ManageScholarships.tsx';

function App() {
  return (
    <Web3Provider>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/scholarships" element={<Scholarships />} />
          <Route path="/apply/:scholarshipId" element={<Apply />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/profile" element={<Profile/>} />
          <Route path="/create-scholarship" element={<CreateScholarship />} />
          <Route path="/manage-scholarships" element={<ManageScholarships/>} />
          <Route path="*" element={<div>Not Found</div>} />
        </Routes>
      </div>
    </Web3Provider>
  );
}

export default App;