# GranTEE - Decentralized Scholarship Platform

GranTEE is a blockchain-powered platform that enables transparent and efficient scholarship management. It connects scholarship providers with applicants through smart contracts, ensuring secure and verifiable transactions.

![GranTEE Platform](https://i.imgur.com/placeholder-image.png)

## Features

- **Decentralized Scholarship Creation**: Create scholarships with customizable requirements and funding amounts
- **Transparent Application Process**: Apply for scholarships with secure document submission
- **Smart Contract Management**: Automatically manage funds and approvals through Ethereum smart contracts
- **Multi-wallet Support**: Compatible with MetaMask and other Ethereum wallets
- **Real-time Chat Support**: Get assistance with scholarship questions through an AI-powered chatbot
- **Fund Manager System**: Delegate scholarship management to trusted individuals

## Technologies Used

- React.js + TypeScript for frontend development
- Vite for fast builds and development experience
- Ethers.js for blockchain interactions
- Smart contracts built on Ethereum/Flare Network
- Tailwind CSS for styling
- React Router for navigation
- React Toastify for notifications

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- MetaMask or another Ethereum wallet browser extension
- Git

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/GranTEE-client.git
cd GranTEE-client
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the project root with the following variables:

```
VITE_CONTRACT_ADDRESS=your_contract_address
VITE_API_URL=your_api_url
```

4. Start the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open your browser and navigate to `http://localhost:5173`

## Usage

### Connecting Your Wallet

1. Click the "Connect Wallet" button in the navigation bar
2. Select your wallet provider (MetaMask, etc.)
3. Approve the connection request

### Creating a Scholarship

1. Navigate to the "Create Scholarship" page
2. Fill in the scholarship details:
   - Title
   - Description
   - Maximum amount per applicant
   - Deadline
   - Requirements
3. Submit the form and confirm the transaction in your wallet

### Managing Scholarships

1. Navigate to the "Manage Scholarships" page to view scholarships you've created
2. Use the provided actions to:
   - Add funds
   - Add/remove fund managers
   - Delete scholarships

### Applying for Scholarships

1. Browse available scholarships on the "Scholarships" page
2. Click "Apply Now" on a scholarship you're interested in
3. Fill out the application form with your details
4. Submit your application and sign the transaction

### Using the ChatBot

1. Navigate to the "Chat" page
2. Type your question about scholarships
3. Choose from three modes:
   - Concise: For quick answers
   - Deep: For detailed explanations
   - Community: For community-sourced information

## Project Structure

```
GranTEE-client/
├── public/           # Static assets
├── src/              # Source code
│   ├── components/   # Reusable UI components
│   ├── contracts/    # Smart contract artifacts and ABIs
│   ├── pages/        # Page components
│   ├── services/     # API and blockchain service functions
│   ├── types/        # TypeScript type definitions
│   ├── App.tsx       # Main application component
│   ├── main.tsx      # Application entry point
│   └── Web3Context.tsx # Blockchain connection context
├── .env              # Environment variables
├── package.json      # Project dependencies
└── vite.config.ts    # Vite configuration
```

## Deployment

### Deploying to Vercel

1. Push your code to a GitHub repository
2. Sign up at [vercel.com](https://vercel.com)
3. Create a new project and import your GitHub repository
4. Configure the build settings:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Set up environment variables:
   - VITE_CONTRACT_ADDRESS
   - VITE_API_URL
6. Deploy the project

### Manual Deployment

You can also build the project manually:

```bash
npm run build
# or
yarn build
```

This creates a `dist` directory that can be deployed to any static site hosting service.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built during the Flare Network Hackathon
- Special thanks to all contributors and supporters
