import { granTEEContract } from "./GranTEE.ts";
import { Scholarship } from "../types";

const GRANTEE_CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

interface ScholarshipResp {
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
    const processedScholarships: Scholarship[] = [];
    const scholarships: ScholarshipResp[] = await granTEEContract.getActiveScholarships();
    scholarships.forEach((resp) => {
        processedScholarships.push({
          id: resp.scholarshipId+"",
          title: "",
          description: "",
          maxAmountPerApplicant: Number(resp.balance),
          deadline: "",
          applicants: 0,
          requirements: [],
        });
      });
    return processedScholarships;
}

export async function getScholarshipsByCreator(creator: string): Promise<Scholarship[]> {
    const processedScholarships: Scholarship[] = [];
    const scholarships: ScholarshipResp[] = await granTEEContract.getScholarshipsByCreator(creator);
    scholarships.forEach((resp) => {
        processedScholarships.push({
          id: resp.scholarshipId+"",
          title: "",
          description: "",
          maxAmountPerApplicant: Number(resp.balance),
          deadline: "",
          applicants: 0,
          requirements: [],
        });
      });
    return processedScholarships;
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
    const dataHash = await hashData(jsonData);
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

async function hashData(data: string): Promise<string> {
    // Encode the input string as an ArrayBuffer
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    
    // Compute the SHA-256 digest
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  
    // Convert the ArrayBuffer to a hex string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    return hashHex;
  }