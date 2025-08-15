import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Toast from './Toast.jsx';

export default function Navbar() {
  const { token, logout, wallet, connectWallet } = useAuth();
  const [isConnecting, setIsConnecting] = useState(false);
  const [toast, setToast] = useState(null);
  const nav = useNavigate();

  const handleConnectWallet = async () => {
    setIsConnecting(true);
    try {
      await connectWallet();
      setToast({ message: 'Wallet connected successfully!', type: 'success' });
    } catch (error) {
      console.error('Wallet connection failed:', error);
      setToast({ message: error.message || 'Failed to connect wallet', type: 'error' });
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <>
      <div className="border-b sticky top-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="font-bold text-lg">RizeOS Portal</Link>
          <div className="flex items-center gap-3">
                      <Link to="/jobs" className="hover:underline">Jobs</Link>
          <Link to="/ai" className="hover:underline">AI</Link>
            {token && <Link to="/post" className="hover:underline">Post Job</Link>}
            {token && <Link to="/payments" className="hover:underline">Payments</Link>}
            {token ? (
              <>
                <Link to="/profile" className="hover:underline">Profile</Link>
                <button onClick={() => { logout(); nav('/'); }} className="px-2 py-1 rounded bg-gray-200 dark:bg-gray-800">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:underline">Login</Link>
                <Link to="/register" className="hover:underline">Sign up</Link>
              </>
            )}
            <button 
              onClick={handleConnectWallet}
              disabled={isConnecting}
              className={`px-3 py-1 rounded transition-colors ${
                isConnecting
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : wallet.connected 
                    ? wallet.isDemo 
                      ? 'bg-orange-600 text-white hover:bg-orange-700' 
                      : 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
              title={wallet.connected ? 
                (wallet.isDemo ? 'Demo Wallet Connected' : 'Wallet Connected') : 
                'Connect MetaMask Wallet'
              }
            >
              {isConnecting ? 'Connecting...' : wallet.connected ? (
                wallet.isDemo ? 
                  'Demo Wallet' : 
                  wallet.address.slice(0,6) + '...' + wallet.address.slice(-4)
              ) : (
                'Connect Wallet'
              )}
            </button>
          </div>
        </div>
      </div>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}
