# RizeOS Job & Networking Portal

A full-stack web application inspired by LinkedIn, Upwork, and AngelList, enhanced with AI-powered features, Web3 wallet integration, and blockchain payments.

## Features

### ✅ Core Functionality
- **User Authentication & Profiles**: JWT-based auth with editable profiles
- **Job Posting & Discovery**: Post jobs, view listings with advanced filtering
- **AI-Powered Matching**: Job-candidate matching with similarity scores
- **Skill Extraction**: Auto-extract skills from user bios
- **Web3 Integration**: MetaMask wallet connection and blockchain payments

### 🔗 Web3 Features
- MetaMask wallet integration
- Platform fee payments in ETH (testnet)
- Payment logging on blockchain
- Demo mode for development

### 🤖 AI Enhancements
- Job matching algorithm with similarity scoring
- Automatic skill extraction from text
- Smart job recommendations

## Tech Stack

### Frontend
- **React.js** with modern hooks
- **Tailwind CSS** for styling
- **Axios** for API communication
- **React Router** for navigation

### Backend
- **Node.js** with **Express.js**
- **MongoDB** with Mongoose ODM
- **JWT** authentication
- **Zod** validation

### Web3
- **MetaMask** integration
- **Ethereum** testnet support
- **Web3.js** for blockchain interaction

## Quick Start

### Prerequisites
- Node.js 16+ 
- MongoDB instance
- MetaMask browser extension (for Web3 features)

### 1. Clone & Install
```bash
git clone <repository-url>
cd rizeos-job-networking-portal

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies  
cd ../frontend
npm install
```

### 2. Environment Setup

#### Backend (.env in backend/ directory)
```bash
MONGO_URI=mongodb://localhost:27017/rizeos-portal
JWT_SECRET=your-secret-key-here
PORT=5000
```

#### Frontend (.env in frontend/ directory)
```bash
VITE_API_BASE=http://localhost:5000
VITE_ADMIN_WALLET=0x000000000000000000000000000000000000dEaD
```

### 3. Start Development Servers

#### Terminal 1 - Backend
```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

#### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
# App runs on http://localhost:5173
```

### 4. Database Setup
```bash
cd backend
npm run seed
# This will create sample users and jobs
```

## Usage Guide

### For Job Seekers
1. **Register/Login** with your email
2. **Complete Profile** with bio, skills, and LinkedIn
3. **Browse Jobs** with AI-powered matching scores
4. **Filter & Search** by skills, location, and tags

### For Employers
1. **Connect Wallet** (MetaMask required for real payments)
2. **Pay Platform Fee** (0.00001 ETH on testnet)
3. **Post Job** with title, description, skills, and budget
4. **Manage Listings** through your dashboard

### AI Features Demo
- **Skill Extraction**: Type a bio and click "Auto-extract" to see skills detected
- **Job Matching**: View match percentages on job listings when logged in
- **Smart Filtering**: Use search and filters to find relevant opportunities

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users/me` - Get user profile
- `PUT /api/users/me` - Update user profile
- `POST /api/users/extract-skills` - Extract skills from text

### Jobs
- `GET /api/jobs` - List jobs with filtering
- `POST /api/jobs` - Create new job (requires payment)

### Matching
- `GET /api/match/jobs-with-score` - Jobs with AI match scores

### Payments
- `POST /api/payments` - Log payment transaction
- `GET /api/payments/mine` - User's payment history

## Web3 Integration

### MetaMask Setup
1. Install MetaMask browser extension
2. Connect to Sepolia testnet
3. Get test ETH from faucet
4. Connect wallet in the app

### Payment Flow
1. User connects MetaMask wallet
2. Pays platform fee (0.00001 ETH)
3. Transaction confirmed on blockchain
4. Payment logged in backend
5. Job posting enabled

### Demo Mode
- Works without MetaMask for development
- Simulates successful payments
- Generates demo transaction hashes

## Development

### Project Structure
```
rizeos-job-networking-portal/
├── backend/                 # Node.js + Express API
│   ├── src/
│   │   ├── models/         # MongoDB schemas
│   │   ├── routes/         # API endpoints
│   │   ├── middleware/     # Auth middleware
│   │   ├── utils/          # AI utilities
│   │   └── config/         # Validation schemas
│   └── package.json
├── frontend/                # React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context providers
│   │   └── main.jsx        # App entry point
│   └── package.json
└── README.md
```

### Key Files
- **AuthContext.jsx**: Web3 wallet integration and API client
- **EditProfile.jsx**: Profile management with skill extraction
- **Jobs.jsx**: Job browsing with AI matching
- **PostJob.jsx**: Job creation with blockchain payments
- **match.js**: AI job matching algorithm
- **extractSkills.js**: Skill extraction utility

## Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Deployment

### Backend (Render/Heroku)
```bash
cd backend
npm run build
# Deploy to your preferred platform
```

### Frontend (Vercel/Netlify)
```bash
cd frontend
npm run build
# Deploy dist/ folder to your preferred platform
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is part of the RizeOS Core Team Internship assessment.

## Support

For questions or issues:
- Check the documentation above
- Review the code comments
- Open an issue in the repository

---

**Built with ❤️ for the RizeOS Core Team Internship**
