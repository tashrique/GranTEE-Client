# Client-side code for GranTEE

### Problem Statement:
Traditional scholarship systems suffer from opacity, bias, and centralized control, making it difficult for deserving candidates to receive fair and transparent allocation of funds. Students often struggle with lengthy application processes, subjective evaluations, and uncertainty regarding scholarship outcomes.
Solution:We propose a Decentralized Scholarship Fund Allocator that leverages blockchain smart contracts, Trusted Execution Environments (TEE), and AI consensus. All student data remains securely encrypted and confidential within the TEE, safeguarding privacy while ensuring fair and unbiased scholarship allocations.

### Approach/User Flow:
Application Submission: Students apply through a straightforward blockchain-based smart contract, submitting required details securely.
Secure Processing (TEE Execution): User data is encrypted and protected within the TEE, preventing unauthorized access. Multiple AI agents securely access this data and supplementary information from a Retrieval-Augmented Generation (RAG) system to independently evaluate each applicant.
Consensus Learning: Each AI agent independently decides on scholarship acceptance and allocation amount. A consensus aggregator then finalizes decisions based on the majority votes.
Automated Fund Distribution: The blockchain smart contract automatically posts outcomes and securely distributes funds directly to approved applicants.
### Results:
Enhanced Privacy: User data remains confidential, secure, and inaccessible outside the TEE environment.
Fairness & Transparency: Blockchain-based consensus ensures objective, unbiased decisions.
Improved Efficiency: Streamlined processing, reducing turnaround times from weeks to mere hours.
Trust & Reliability: Transparent and immutable blockchain records foster stakeholder confidence.
Our innovative solution ensures deserving students receive timely support through a transparent, secure, unbiased, and efficient scholarship allocation process.

## Setup and run
1. Install packages
```bash
npm i
```
2. Deploy /src/contracts/GranTEE.sol using remix
3. Create a .env with the deployed contract address
```
VITE_CONTRACT_ADDRESS="0xB7BcC404fCA2503c4E86f5211f7E04A251aaB059"
```
4. Start server in dev mode
```bash
npm run dev
```
