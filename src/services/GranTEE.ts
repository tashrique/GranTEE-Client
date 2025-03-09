import { ethers } from "ethers";
import GranTEEArtifact from "../contracts/artifacts/GranTEE.json";

export class GrantTEEContract {
    private provider: ethers.BrowserProvider;
    private contract: ethers.Contract | null = null;

    constructor() {
        if (typeof window === "undefined" || !window.ethereum) {
            throw new Error("MetaMask is not installed");
        }
        this.provider = new ethers.BrowserProvider(window.ethereum);
    }

    // Initialize contract with a provided address
    async initializeContract(contractAddress: string) {
        if (!this.contract) {
            const signer = await this.provider.getSigner();
            this.contract = new ethers.Contract(contractAddress, GranTEEArtifact.abi, signer);
        }
        return this.contract;
    }

    async getSigner() {
        return this.provider.getSigner();
    }

    async getSignerAddress() {
        const [account] = await window.ethereum.request({ method: "eth_accounts" });
        return account;
    }

    async requestAccount(forceSelection: boolean = false) {
        if (!window.ethereum) {
            throw new Error("MetaMask is not installed");
        }
        if (forceSelection) {
            await window.ethereum.request({
                method: "wallet_requestPermissions",
                params: [{ eth_accounts: {} }],
            });
        }
        return await window.ethereum.request({ method: "eth_requestAccounts" });
    }

    async connect() {
        const [account] = await this.requestAccount(true);
        return account;
    }

    async disconnect() {
        this.contract = null;
    }

    // create scholarship
    async createScholarship(){
        if (!this.contract) throw new Error("Contract not initialized");
        const transaction = await this.contract.createScholarship();
        const receipt = await transaction.wait();
        return receipt;
    }


    // add fund manager
    async addFundManager(scholarshipId: number, fundManager: string) {
        if (!this.contract) throw new Error("Contract not initialized");
        const transaction = await this.contract.addFundManager(scholarshipId, fundManager);
        const receipt = await transaction.wait();
        if (receipt.status !== 1) {
            throw new Error("Transaction failed");
        }
        return receipt;
    }

    // remove fund manager
    async removeFundManager(scholarshipId: number, fundManager: string) {
        if (!this.contract) throw new Error("Contract not initialized");
        const transaction = await this.contract.removeFundManager(scholarshipId, fundManager);
        const receipt = await transaction.wait();
        if (receipt.status !== 1) {
            throw new Error("Transaction failed");
        }
        return receipt;
    }

    // deposit funds
    async depositFunds(scholarshipId: number, amount: number) {
        if (!this.contract) throw new Error("Contract not initialized");
        const transaction = await this.contract.depositFunds(scholarshipId, {value: amount});
        const receipt = await transaction.wait();
        if (receipt.status !== 1) {
            throw new Error("Transaction failed");
        }
        return receipt;
    }

    // delete scholarship
    async deleteScholarship(scholarshipId: number) {
        if (!this.contract) throw new Error("Contract not initialized");
        const transaction = await this.contract.deleteScholarship(scholarshipId);
        const receipt = await transaction.wait();
        if (receipt.status !== 1) {
            throw new Error("Transaction failed");
        }
        return receipt;
    }

    // apply for scholarship
    async applyScholarship(scholarshipId: number, dataHash: string) {
        if (!this.contract) throw new Error("Contract not initialized");
        const transaction = await this.contract.applyScholarship(scholarshipId, dataHash);
        const receipt = await transaction.wait();
        if (receipt.status !== 1) {
            throw new Error("Transaction failed");
        }
        return receipt;
    }

    // send scholarship
    async sendScholarship(scholarshipId: number, recipient: string, amount: number) {
        if (!this.contract) throw new Error("Contract not initialized");
        const transaction = await this.contract.sendScholarship(scholarshipId, recipient, amount);
        const receipt = await transaction.wait();
        if (receipt.status !== 1) {
            throw new Error("Transaction failed");
        }
        return receipt;
    }

    // get user applications
    async getUserApplications() {
        if (!this.contract) throw new Error("Contract not initialized");
        return await this.contract.getUserApplications();
    }

    // get all active scholarships
    async getActiveScholarships() {
        if (!this.contract) throw new Error("Contract not initialized");
        return await this.contract.getActiveScholarships();
    }

    // get scholarships by creator
    async getScholarshipsByCreator(creator: string) {
        if (!this.contract) throw new Error("Contract not initialized");
        return await this.contract.getScholarshipsByCreator(creator);
    }

    // get scholarship by id
    async getScholarshipById(scholarshipId: number) {
        if (!this.contract) throw new Error("Contract not initialized");
        return await this.contract.scholarships(scholarshipId);
    }

    async getCounter(){
        if (!this.contract) throw new Error("Contract not initialized");
        return await this.contract.scholarshipCounter();
    }
}

export const granTEEContract = new GrantTEEContract();