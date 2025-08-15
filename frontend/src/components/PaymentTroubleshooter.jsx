import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export default function PaymentTroubleshooter({ onClose }) {
  const { wallet } = useAuth();
  const [activeStep, setActiveStep] = useState(0);

  const troubleshootingSteps = [
    {
      title: "Check MetaMask Status",
      description: "Ensure MetaMask is properly connected and unlocked",
      checks: [
        "MetaMask extension is installed and enabled",
        "MetaMask is unlocked (click the fox icon)",
        "You're on the correct network (Sepolia testnet)",
        "You have sufficient funds in your wallet"
      ],
      action: () => {
        if (window.ethereum) {
          window.ethereum.request({ method: 'eth_accounts' })
            .then(accounts => {
              console.log('MetaMask accounts:', accounts);
              alert(`Found ${accounts.length} account(s) in MetaMask`);
            })
            .catch(error => {
              console.error('MetaMask check failed:', error);
              alert('MetaMask check failed: ' + error.message);
            });
        } else {
          alert('MetaMask not found. Please install MetaMask extension.');
        }
      }
    },
    {
      title: "Check Network Settings",
      description: "Verify you're on the correct blockchain network",
      checks: [
        "Switch to Sepolia testnet in MetaMask",
        "Ensure network is properly configured",
        "Check if you have Sepolia ETH for gas fees"
      ],
      action: () => {
        if (window.ethereum) {
          window.ethereum.request({ method: 'eth_chainId' })
            .then(chainId => {
              const networkName = chainId === '0xaa36a7' ? 'Sepolia' : 
                                chainId === '0x1' ? 'Ethereum Mainnet' : 
                                `Unknown (${chainId})`;
              alert(`Current network: ${networkName}`);
              
              if (chainId !== '0xaa36a7') {
                alert('Please switch to Sepolia testnet in MetaMask');
              }
            })
            .catch(error => {
              console.error('Network check failed:', error);
              alert('Network check failed: ' + error.message);
            });
        }
      }
    },
    {
      title: "Check Account Balance",
      description: "Verify you have sufficient funds for the transaction",
      checks: [
        "You have at least 0.00001 ETH for the payment",
        "You have additional ETH for gas fees",
        "Account is properly selected in MetaMask"
      ],
      action: () => {
        if (window.ethereum && wallet.address) {
          window.ethereum.request({ 
            method: 'eth_getBalance', 
            params: [wallet.address, 'latest'] 
          })
          .then(balance => {
            const ethBalance = parseInt(balance, 16) / 1e18;
            alert(`Account balance: ${ethBalance.toFixed(6)} ETH`);
            
            if (ethBalance < 0.0001) {
              alert('Low balance! You need at least 0.0001 ETH for payment + gas fees.');
            }
          })
          .catch(error => {
            console.error('Balance check failed:', error);
            alert('Balance check failed: ' + error.message);
          });
        }
      }
    },
    {
      title: "Reset and Retry",
      description: "Clear any pending transactions and try again",
      checks: [
        "Close any pending MetaMask popups",
        "Clear browser cache and reload",
        "Disconnect and reconnect wallet",
        "Try the transaction again"
      ],
      action: () => {
        // Clear localStorage and reload
        localStorage.removeItem('wallet');
        alert('Wallet state cleared. Please reconnect your wallet and try again.');
        window.location.reload();
      }
    }
  ];

  const getTestnetFaucetLinks = () => {
    return (
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded border">
        <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
          💡 Need test tokens?
        </h4>
        <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
          <div>• <strong>Sepolia ETH:</strong> <a href="https://sepoliafaucet.com/" target="_blank" rel="noopener noreferrer" className="underline">Sepolia Faucet</a></div>
          <div>• <strong>Alternative:</strong> <a href="https://faucet.sepolia.dev/" target="_blank" rel="noopener noreferrer" className="underline">Sepolia Dev Faucet</a></div>
          <div>• <strong>MetaMask:</strong> Use MetaMask's built-in faucet</div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Payment Troubleshooter</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded border">
          <h3 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
            Common Payment Issues:
          </h3>
          <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
            <li>• MetaMask popup appears but transaction fails</li>
            <li>• "Insufficient funds" error</li>
            <li>• Wrong network selected</li>
            <li>• Transaction stuck or pending</li>
            <li>• User rejected transaction</li>
          </ul>
        </div>

        <div className="space-y-4">
          {troubleshootingSteps.map((step, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">{step.title}</h3>
                <button
                  onClick={step.action}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                >
                  Check
                </button>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {step.description}
              </p>
              <ul className="text-sm space-y-1">
                {step.checks.map((check, checkIndex) => (
                  <li key={checkIndex} className="flex items-center gap-2">
                    <span className="text-gray-400">•</span>
                    <span>{check}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {getTestnetFaucetLinks()}

        <div className="mt-6 flex gap-3">
          <button
            onClick={() => window.open('/wallet-test', '_blank')}
            className="flex-1 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Open Wallet Test Page
          </button>
          <button
            onClick={() => window.open('https://sepoliafaucet.com/', '_blank')}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Get Test ETH
          </button>
        </div>
      </div>
    </div>
  );
}
