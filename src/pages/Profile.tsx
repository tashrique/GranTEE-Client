import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useWeb3 } from '../Web3Context';
import {Github, Linkedin, Twitter,} from 'lucide-react';
import { getUserData, uploadUserData } from '../services/helper';
import { UserProfile } from '../types';
import { toast } from 'react-toastify';

const Profile: React.FC = () => {
  const { account } = useWeb3();
  const [profile, setProfile] = useState<UserProfile>({
    twitter: '',
    linkedIn: '',
    github: '',
    google: '',
  });

  const [socialConnections, setSocialConnections] = useState({
      github: false,
      linkedIn: false,
      twitter: false,
      google: false,
    });

  // If a user is connected, load existing profile data from localStorage
  useEffect(() => {
    fetchUserData();
  }, [account]);

  const fetchUserData = async()=>{
    if(!account){
      console.log("Please connect wallet!!!")
      return
    }
    try{
      toast.info("Loading your profile data...");
      const userProfile = await getUserData();
      if (userProfile) {
        setProfile(userProfile);
        toast.success("Profile data loaded successfully");
      }
    }catch(error){
      console.log("Error fetching user data: ",error)
      toast.error(`Error loading profile: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // Handle form changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

   const handleSocialConnect = (platform: keyof typeof socialConnections) => {
      setSocialConnections(prev => ({
        ...prev,
        [platform]: true
      }));
      toast.success(`Connected to ${platform.charAt(0).toUpperCase() + platform.slice(1)}`);
    };

  // Save profile data to localStorage (or call an API to save on the backend)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account) {
      toast.error('Please connect your wallet first.');
      return;
    }
    
    const saveToast = toast.loading("Saving profile data...");
    
    try {
      await uploadUserData(profile);
      toast.update(saveToast, {
        render: "Profile saved successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000
      });
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.update(saveToast, {
        render: `Error saving profile: ${error instanceof Error ? error.message : String(error)}`,
        type: "error",
        isLoading: false,
        autoClose: 5000
      });
    }
  };

  // If no wallet is connected, show a message
  if (!account) {
    return (
      <div className="max-w-xl mx-auto p-4">
        <h1 className="text-xl font-bold mb-4">Profile</h1>
        <p>Please connect your wallet to view or edit your profile.</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">Profile</h1>
                <Link
                  to="/manage-scholarships"
                  className="border-2 border-blue-600 border-dotted text-blue-600 px-8 py-4 rounded-full font-bold hover:bg-blue-50 transition-colors"
                >
                  Creator Dashboard
                </Link>
              </div>
      <p className="mb-4">Wallet Address: {account}</p>
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
              onClick={() => handleSocialConnect('linkedIn')}
              className={`p-4 rounded-lg border ${
                socialConnections.linkedIn ? 'bg-green-50 border-green-500' : 'border-gray-200 hover:border-blue-500'
              } flex flex-col items-center justify-center transition-colors`}
            >
              <Linkedin className="h-6 w-6 mb-2" />
              <span className="text-sm">
                {socialConnections.linkedIn ? 'Connected' : 'Connect LinkedIn'}
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

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="twitter" className="block mb-1">Twitter</label>
          <input
            type="text"
            id="twitter"
            name="twitter"
            value={profile.twitter}
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 rounded"
          />
        </div>
        <div>
          <label htmlFor="linkedIn" className="block mb-1">LinkedIn</label>
          <input
            type="text"
            id="linkedIn"
            name="linkedIn"
            value={profile.linkedIn}
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 rounded"
          />
        </div>
        <div>
          <label htmlFor="github" className="block mb-1">GitHub</label>
          <input
            type="text"
            id="github"
            name="github"
            value={profile.github}
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 rounded"
          />
        </div>
        <div>
          <label htmlFor="google" className="block mb-1">Google</label>
          <input
            type="text"
            id="google"
            name="google"
            value={profile.google}
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 rounded"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save
        </button>
      </form>
    </div>
  );
};

export default Profile;