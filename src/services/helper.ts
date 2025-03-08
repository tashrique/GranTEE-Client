import { granTEEContract } from "./GranTEE.ts";
import { createHash } from 'crypto';

const GRANTEE_CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

interface Scholarship {
    scholarshipId: number;
    creator: string;
    balance: string;
}

interface ApplicationData{
    name: string;
    location: string;
    age: string;
    essay: string;
    resume: string;
    linkedIn: string;
    github: string;
    google: string;
    twitter: string;
}

interface Application{
    scholarshipId: number;
    paid: boolean;
    dataHash: string;
}

// Wallet Connection
export async function connectWallet(): Promise<string> {
    const account = await granTEEContract.connect();
    await granTEEContract.initializeContract(GRANTEE_CONTRACT_ADDRESS);
    return account;
}
  
export async function disconnectWallet(): Promise<void> {
    await granTEEContract.disconnect();
}

export async function getCurrentAccount(): Promise<string | null> {
    try {
        const [account] = await window.ethereum.request({ method: "eth_accounts" });
        if (account) {
            await granTEEContract.initializeContract(GRANTEE_CONTRACT_ADDRESS);
        }
        return account || null;
    } catch (error) {
        console.error("Error checking current account:", error);
        return null;
    }
}

export function setupAccountChangeListener(
    onAccountChange: (accounts: string[]) => void
    ): () => void {
    if (!window.ethereum) return () => {};
        window.ethereum.on("accountsChanged", onAccountChange);
    return () => {
        window.ethereum.removeListener("accountsChanged", onAccountChange);
    };
}

export async function getScholarships(): Promise<Scholarship[]> {
    const scholarships: Scholarship[] = await granTEEContract.getActiveScholarships();
    // const activeScholarships : Scholarship[]= []; 
    // scholarships.forEach((scholarship) => {
    //     activeScholarships.push({
    //         id: scholarship.id.toNumber(),
    //         creator: scholarship.creator,
    //         balance: ethers.formatEther(scholarship.balance)
    //     });
    // });
    return scholarships;
}

export async function getScholarshipsByCreator(creator: string): Promise<Scholarship[]> {
    const scholarships: Scholarship[] = await granTEEContract.getScholarshipsByCreator(creator);
    return scholarships;
}

export async function createScholarship(): Promise<void> {
    try{
        await granTEEContract.createScholarship()
    } catch(error){
        throw new Error("Couldn't create scholarship, error: "+error)
    }
}

export async function depositFunds(scholarshipId: number, amount: number): Promise<void> {
    try{
        await granTEEContract.depositFunds(scholarshipId,amount)
    } catch(error){
        throw new Error("Couldn't deposit funds, error: "+error)
    }
}

export async function addFundManager(scholarshipId: number, fundManager: string): Promise<void> {
    try{
        await granTEEContract.addFundManager(scholarshipId,fundManager)
    } catch(error){
        throw new Error("Couldn't add fund manager, error: "+error)
    }
}

export async function removeFundManager(scholarshipId: number, fundManager: string): Promise<void> {
    try{
        await granTEEContract.removeFundManager(scholarshipId,fundManager)
    } catch(error){
        throw new Error("Couldn't remove fund manager, error: "+error)
    }
}

export async function deleteScholarship(scholarshipId: number): Promise<void> {
    try{
        await granTEEContract.deleteScholarship(scholarshipId)
    } catch(error){
        throw new Error("Couldn't delete scholarship, error: "+error)
    }
}

export async function applyScholarship(scholarshipId: number, data: ApplicationData): Promise<void> {
    
    const jsonData = JSON.stringify(data);
    const dataHash = createHash('sha256').update(jsonData).digest('hex');

    try{
        await granTEEContract.applyScholarship(scholarshipId,dataHash)
    } catch(error){
        throw new Error("Couldn't apply for scholarship, error: "+error)
    }
}

export async function getApplications(): Promise<Application[]> {
    const applications: Application[] = await granTEEContract.getUserApplications();
    return applications;
}