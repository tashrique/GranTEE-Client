import React, { createContext, useContext, useEffect, useState } from 'react';
import { connectWallet, disconnectWallet, setupAccountChangeListener } from './services/helper.ts';

interface IWeb3Context {
    account: string | null;
    connect: () => Promise<void>;
    disconnect: () => Promise<void>;
}

const Web3Context = createContext<IWeb3Context>({
    account: null,
    connect: async () => {},
    disconnect: async () => {},

});

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);

  // Wallet Connection Handlers
  const connect = async () => {
    try {
      const account = await connectWallet();
      setAccount(account);
    } catch (error) {
        console.log("Error: ", error);
    }
  };

  const disconnect = async () => {
    try {
        await disconnectWallet();
        setAccount(null);
    } catch (error) {
        console.log("Error: ", error);
    }
  };

  useEffect(() => {
    if (!account) return;
    const cleanup = setupAccountChangeListener((accounts) => {
      if (accounts.length > 0) {
        setAccount(accounts[0]);
      } else {
        disconnect();
      }
    });
    return cleanup;
  }, [account]);

  return (
    <Web3Context.Provider value={{ account, connect, disconnect }}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => useContext(Web3Context);