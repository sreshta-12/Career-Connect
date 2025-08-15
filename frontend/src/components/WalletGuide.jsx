import React, { useState } from 'react';

export default function WalletGuide() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-blue-600 dark:text-blue-400 text-sm hover:underline flex items-center gap-1"
      >
        {isOpen ? '▼' : '▶'} How to connect MetaMask?
      </button>
      
      {isOpen && (
        <div className="mt-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-sm">
          <h4 className="font-medium mb-2">MetaMask Connection Guide:</h4>
          <ol className="list-decimal list-inside space-y-1 text-gray-700 dark:text-gray-300">
            <li>Install MetaMask extension from <a href="https://metamask.io" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">metamask.io</a></li>
            <li>Create or import a wallet in MetaMask</li>
            <li>Make sure MetaMask is unlocked (click the extension icon)</li>
            <li>Click "Connect Wallet" button above</li>
            <li>Approve the connection request in MetaMask popup</li>
            <li>Your wallet address will appear when connected</li>
          </ol>
          
          <div className="mt-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded text-yellow-800 dark:text-yellow-200 text-xs">
            <strong>Note:</strong> If you don't have MetaMask installed, the app will use demo mode for testing purposes.
          </div>
        </div>
      )}
    </div>
  );
}
