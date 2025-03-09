import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { addFundManager, removeFundManager, getFundManagers } from '../services/helper';
import { useWeb3 } from '../Web3Context';

interface FundManagersModalProps {
  scholarshipId: string;
  onClose: () => void;
}

const FundManagersModal: React.FC<FundManagersModalProps> = ({
  scholarshipId,
  onClose,
}) => {
  const [managers, setManagers] = useState<string[]>([]);
  const [newManager, setNewManager] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const { account } = useWeb3();
  

  // Fetch current fund managers from blockchain when the component mounts
  useEffect(() => {
    if(!account){
        console.log("Please connect to wallet!!!")
    }
    fetchManagers();
  }, [scholarshipId, account]);

  const fetchManagers = async () => {
    try {
      const fetchedManagers = await getFundManagers(Number(scholarshipId));
      const plainManagers = [...fetchedManagers];
      console.log("Fetched managers:", plainManagers)
      setManagers(plainManagers);
    } catch (error) {
      console.error("Error fetching fund managers:", error);
    }
  };

  const handleAdd = async () => {
    if (!newManager) return;
    setLoading(true);
    try {
      await addFundManager(Number(scholarshipId), newManager);
      const updatedManagers = [...managers, newManager];
      setManagers(updatedManagers);
      setNewManager('');
    } catch (error) {
      console.error("Error adding fund manager:", error);
      alert("Error adding fund manager");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (manager: string) => {
    setLoading(true);
    try {
      await removeFundManager(Number(scholarshipId), manager);
      const updatedManagers = managers.filter(m => m !== manager);
      setManagers(updatedManagers);
    //   onUpdate(updatedManagers);
    } catch (error) {
      console.error("Error removing fund manager:", error);
      alert("Error removing fund manager");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Manage Fund Managers</h2>
          <button onClick={onClose}>
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="mb-4">
          <ul className="space-y-2">
            {managers.length>0 && managers.map((manager, index) => (
              <li key={index} className="flex justify-between items-center">
                <span>{manager}</span>
                <button 
                  onClick={() => handleRemove(manager)}
                  className="text-red-500"
                  disabled={loading}
                >
                  Remove
                </button>
              </li>
            ))}
            {managers.length === 0 && <li>No fund managers added.</li>}
          </ul>
        </div>
        <div className="flex space-x-2">
          <input 
            type="text" 
            placeholder="Add fund manager address" 
            className="border p-2 flex-grow"
            value={newManager}
            onChange={(e) => setNewManager(e.target.value)}
          />
          <button 
            onClick={handleAdd}
            className="bg-blue-600 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default FundManagersModal;