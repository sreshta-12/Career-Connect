import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import WalletGuide from './WalletGuide.jsx';
import { checkBrowserCompatibility } from '../utils/browserCheck.js';

export default function WalletStatus() {
  const { wallet, connectWallet } = useAuth();
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');
  const [compatibility, setCompatibility] = useState(null);

  useEffect(() => {
    setCompatibility(checkBrowserCompatibility());
  }, []);

  const handleConnectWallet = async () => {
    setIsConnecting(true);
    setError('');
    
    try {
      await connectWallet();
    } catch (err) {
      console.error('Wallet connection error:', err);
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const getStatusColor = () => {
    if (!wallet.connected) return 'text-red-600 dark:text-red-400';
    if (wallet.isDemo) return 'text-orange-600 dark:text-orange-400';
    return 'text-green-600 dark:text-green-400';
  };

  const getStatusText = () => {
    if (!wallet.connected) return 'Not Connected';
    if (wallet.isDemo) return 'Demo Mode';
    return 'Connected';
  };

  const getStatusIcon = () => {
    if (!wallet.connected) return '✗';
    if (wallet.isDemo) return '⚠';
    return '✓';
  };

  return (
    <div className="p-4 rounded-lg border bg-gray-50 dark:bg-gray-800">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium">Wallet Status</h3>
        <button
          onClick={handleConnectWallet}
          disabled={isConnecting}
          className={`px-3 py-1 text-sm rounded transition-colors ${
            isConnecting 
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : wallet.connected 
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isConnecting ? 'Connecting...' : wallet.connected ? 'Reconnect' : 'Connect'}
        </button>
      </div>

      {error && (
        <div className="mb-3 p-2 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded text-red-700 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <span className={`font-medium ${getStatusColor()}`}>
            {getStatusIcon()} {getStatusText()}
          </span>
        </div>

        {wallet.connected && (
          <div className="text-gray-600 dark:text-gray-400">
            <div>Address: <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">{wallet.address}</code></div>
            {wallet.isDemo && (
              <div className="text-orange-600 dark:text-orange-400 text-xs mt-1">
                Demo mode: No real blockchain transactions
              </div>
            )}
          </div>
        )}

        {!wallet.connected && (
          <div className="text-gray-600 dark:text-gray-400 text-xs">
            Connect your MetaMask wallet to use Web3 features
          </div>
        )}

        {!wallet.connected && <WalletGuide />}

        {compatibility && compatibility.issues.length > 0 && (
          <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded">
            <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">Browser Compatibility Issues:</h4>
            <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
              {compatibility.issues.map((issue, index) => (
                <li key={index}>• {issue}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Debug Info */}
        <details className="mt-3">
          <summary className="cursor-pointer text-xs text-gray-500 hover:text-gray-700">
            Debug Info
          </summary>
          <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono">
            <div>window.ethereum: {window.ethereum ? 'Available' : 'Not Available'}</div>
            <div>window.solana: {window.solana ? 'Available' : 'Not Available'}</div>
            <div>Wallet State: {JSON.stringify(wallet, null, 2)}</div>
            {compatibility && (
              <div>Compatibility: {JSON.stringify(compatibility.checks, null, 2)}</div>
            )}
          </div>
        </details>
      </div>
    </div>
  );
}
