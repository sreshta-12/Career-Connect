import React, { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';
const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(null);
  const [wallet, setWallet] = useState(() => {
    // Try to restore wallet state from localStorage
    const savedWallet = localStorage.getItem('wallet');
    if (savedWallet) {
      try {
        return JSON.parse(savedWallet);
      } catch (e) {
        console.error('Failed to parse saved wallet:', e);
      }
    }
    return { address: '', connected: false, type: '' };
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      try {
        setUser(jwtDecode(token));
      } catch {
        console.error('Invalid token');
      }
    } else {
      localStorage.removeItem('token');
      setUser(null);
    }
  }, [token]);

  // Save wallet state to localStorage
  useEffect(() => {
    if (wallet.connected) {
      localStorage.setItem('wallet', JSON.stringify(wallet));
    } else {
      localStorage.removeItem('wallet');
    }
  }, [wallet]);

  // Check wallet connection status on mount
  useEffect(() => {
    const checkWalletConnection = async () => {
      console.log('Checking wallet connection on mount...');
      console.log('Current wallet state:', wallet);
      console.log('window.ethereum available:', !!window.ethereum);
      
      // If we're in demo mode but MetaMask is available, try to connect
      if (wallet.isDemo && window.ethereum) {
        console.log('MetaMask available but in demo mode, attempting to connect...');
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          console.log('MetaMask accounts found:', accounts);
          
          if (accounts.length > 0) {
            console.log('MetaMask already connected, switching from demo mode');
            const address = accounts[0];
            const realWallet = { address, connected: true, isDemo: false, type: 'ethereum' };
            setWallet(realWallet);
            console.log('Switched to real MetaMask wallet:', realWallet);
            return;
          }
        } catch (error) {
          console.log('Failed to check MetaMask accounts:', error);
        }
      }
      
      // Check existing wallet connection
      if (wallet.connected && wallet.type === 'ethereum' && window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length === 0 || accounts[0].toLowerCase() !== wallet.address.toLowerCase()) {
            console.log('Wallet connection lost, resetting wallet state');
            setWallet({ address: '', connected: false, type: '' });
          }
        } catch (error) {
          console.log('Failed to check wallet connection:', error);
          setWallet({ address: '', connected: false, type: '' });
        }
      }
    };

    checkWalletConnection();
  }, []);

  const api = axios.create({ baseURL: API_BASE + '/api' });
  api.interceptors.request.use((config) => {
    if (token) config.headers.Authorization = 'Bearer ' + token;
    return config;
  });

  async function connectWallet() {
    try {
      console.log('Attempting to connect wallet...');
      console.log('Current wallet state:', wallet);
      
      // Check if we should force demo mode (for testing)
      const forceDemo = new URLSearchParams(window.location.search).get('demo') === 'true';
      if (forceDemo) {
        console.log('Forcing demo mode due to URL parameter');
        const demoWallet = { 
          address: '0xDemoWallet123...', 
          connected: true,
          isDemo: true,
          type: 'demo'
        };
        setWallet(demoWallet);
        console.log('Demo wallet set:', demoWallet);
        return;
      }
      
      // Try MetaMask first
      if (window.ethereum) {
        try {
          console.log('MetaMask found, attempting connection...');
          console.log('MetaMask provider:', window.ethereum);
          console.log('MetaMask isMetaMask:', window.ethereum.isMetaMask);
          console.log('MetaMask selectedAddress:', window.ethereum.selectedAddress);
          
          // First check if already connected
          const currentAccounts = await window.ethereum.request({ method: 'eth_accounts' });
          console.log('Current MetaMask accounts:', currentAccounts);
          
          if (currentAccounts.length > 0) {
            console.log('MetaMask already connected, using existing account');
            const address = currentAccounts[0];
            const realWallet = { address, connected: true, isDemo: false, type: 'ethereum' };
            setWallet(realWallet);
            console.log('MetaMask connected (existing):', realWallet);
            
            // Update user profile if logged in
            if (token) {
              try {
                await api.put('/users/me', { walletAddress: address, walletType: 'ethereum' });
              } catch (profileError) {
                console.warn('Failed to update user profile with wallet address:', profileError);
              }
            }
            return;
          }
          
          // Request new connection
          console.log('Requesting new MetaMask connection...');
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          console.log('MetaMask connection response:', accounts);
          
          if (accounts.length > 0) {
            const address = accounts[0];
            const realWallet = { address, connected: true, isDemo: false, type: 'ethereum' };
            setWallet(realWallet);
            console.log('MetaMask connected (new):', realWallet);
            
            // Update user profile if logged in
            if (token) {
              try {
                await api.put('/users/me', { walletAddress: address, walletType: 'ethereum' });
              } catch (profileError) {
                console.warn('Failed to update user profile with wallet address:', profileError);
              }
            }
            return;
          } else {
            console.log('MetaMask connection returned no accounts');
            throw new Error('MetaMask connection failed: No accounts returned');
          }
        } catch (error) {
          console.log('MetaMask connection failed:', error);
          console.log('Error details:', {
            code: error.code,
            message: error.message,
            stack: error.stack
          });
          
          // Provide specific error messages based on error codes
          if (error.code === 4001) {
            throw new Error('MetaMask connection rejected by user');
          } else if (error.code === -32002) {
            throw new Error('MetaMask connection request already pending. Please check your MetaMask extension.');
          } else if (error.code === -32603) {
            throw new Error('MetaMask internal error. Please try again or restart MetaMask.');
          } else {
            throw new Error(`MetaMask connection failed: ${error.message}`);
          }
        }
      } else {
        console.log('MetaMask not found in window.ethereum');
        throw new Error('MetaMask not found. Please install MetaMask extension and refresh the page.');
      }

      // Try Phantom if MetaMask fails
      if (window.solana && window.solana.isPhantom) {
        try {
          console.log('Phantom found, attempting connection...');
          const response = await window.solana.connect();
          const address = response.publicKey.toString();
          const phantomWallet = { address, connected: true, isDemo: false, type: 'solana' };
          setWallet(phantomWallet);
          console.log('Phantom connected:', phantomWallet);
          
          // Update user profile if logged in
          if (token) {
            try {
              await api.put('/users/me', { walletAddress: address, walletType: 'solana' });
            } catch (profileError) {
              console.warn('Failed to update user profile with wallet address:', profileError);
            }
          }
          return;
        } catch (error) {
          console.log('Phantom connection failed:', error);
          throw new Error(`Phantom connection failed: ${error.message}`);
        }
      }

      // Fallback to demo mode
      console.log('No wallets found, setting up demo mode');
      const demoWallet = { 
        address: '0xDemoWallet123...', 
        connected: true,
        isDemo: true,
        type: 'demo'
      };
      setWallet(demoWallet);
      console.log('Demo wallet set:', demoWallet);
      
      throw new Error('No supported wallets found. Using demo mode for testing.');
    } catch (error) {
      console.error('Wallet connection failed:', error);
      throw error;
    }
  }

  async function payPlatformFee({ to, amountEth, amountSol }) {
    console.log('payPlatformFee called with:', { to, amountEth, amountSol });
    console.log('Current wallet state:', wallet);
    
    // Check if we're in demo mode
    if (wallet.isDemo || (!window.ethereum && !window.solana)) {
      console.warn("Demo mode: simulating payment success");
      console.log("Demo payment parameters:", { to, amountEth, amountSol });
      
      // Simulate payment delay for realistic experience
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const demoResult = { 
        txHash: "demo-" + Date.now(), 
        receipt: { status: "success", blockNumber: "demo" },
        isDemo: true
      };
      
      console.log("Demo payment result:", demoResult);
      return demoResult;
    }
    
    console.log('Not in demo mode, proceeding with real payment');

    try {
      // Ensure wallet is connected
      if (!wallet.connected || !wallet.address) {
        throw new Error('Wallet not connected. Please connect your wallet first.');
      }

      if (wallet.type === 'ethereum') {
        console.log('Processing Ethereum payment...');
        // Ethereum/MetaMask payment
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const from = accounts[0];
        
        console.log('MetaMask accounts:', accounts);
        console.log('Selected account:', from);
        console.log('Wallet address:', wallet.address);
        
        if (!from) {
          throw new Error('No wallet account found. Please unlock MetaMask.');
        }

        // Verify we're using the connected account
        if (from.toLowerCase() !== wallet.address.toLowerCase()) {
          console.log('Account mismatch detected:', { from, walletAddress: wallet.address });
          throw new Error('Account mismatch. Please reconnect your wallet.');
        }

        const value = '0x' + BigInt(Math.floor(amountEth * 1e18)).toString(16);
        const params = [{ from, to, value }];
        
        console.log('Sending Ethereum transaction:', { from, to, value, amountEth });
        console.log('Transaction parameters:', params);
        
        // Validate parameters before sending
        if (!from || !to || !value) {
          throw new Error('Missing transaction parameters: from, to, or value is undefined');
        }
        
        if (value === '0x0') {
          throw new Error('Invalid transaction amount: cannot send 0 ETH');
        }
        
        const txHash = await window.ethereum.request({ 
          method: 'eth_sendTransaction', 
          params 
        });

        console.log('Ethereum transaction sent:', txHash);

        // Poll for confirmation
        let receipt = null;
        for (let i = 0; i < 60; i++) {
          await new Promise(r => setTimeout(r, 1500));
          receipt = await window.ethereum.request({
            method: 'eth_getTransactionReceipt',
            params: [txHash]
          });
          if (receipt && receipt.blockNumber) break;
        }
        
        if (!receipt) {
          throw new Error('Transaction not confirmed yet. Please check your wallet for status.');
        }
        
        console.log('Ethereum transaction confirmed:', receipt);
        return { txHash, receipt, isDemo: false };

      } else if (wallet.type === 'solana') {
        // Solana/Phantom payment
        if (!window.solana || !window.solana.isPhantom) {
          throw new Error('Phantom wallet not found. Please install Phantom extension.');
        }

        const connection = new window.solanaWeb3.Connection(
          'https://api.devnet.solana.com',
          'confirmed'
        );

        const transaction = new window.solanaWeb3.Transaction().add(
          window.solanaWeb3.SystemProgram.transfer({
            fromPubkey: window.solana.publicKey,
            toPubkey: new window.solanaWeb3.PublicKey(to),
            lamports: amountSol * 1e9 // Convert SOL to lamports
          })
        );

        const { signature } = await window.solana.signAndSendTransaction(transaction);
        console.log('Solana transaction sent:', signature);

        // Wait for confirmation
        const confirmation = await connection.confirmTransaction(signature, 'confirmed');
        console.log('Solana transaction confirmed:', confirmation);

        return { txHash: signature, receipt: confirmation, isDemo: false };
      }

      throw new Error('Unsupported wallet type');

    } catch (error) {
      console.error('Payment failed:', error);
      
      // Provide more specific error messages
      if (error.code === 4001) {
        throw new Error('Transaction rejected by user');
      } else if (error.code === -32603) {
        throw new Error('Internal JSON-RPC error. Please check your wallet connection.');
      } else if (error.message.includes('insufficient funds')) {
        throw new Error('Insufficient funds in wallet');
      } else if (error.message.includes('network')) {
        throw new Error('Network error. Please check your wallet network settings.');
      } else {
        throw new Error(`Payment failed: ${error.message}`);
      }
    }
  }

  async function login(email, password) {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      setToken(data.token);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async function register(name, email, password) {
    try {
      const { data } = await api.post('/auth/register', { name, email, password });
      setToken(data.token);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async function logout() {
    console.log('Logout function called');
    setToken('');
    setUser(null);
    setWallet({ address: '', connected: false, type: '' });
    // Clear all localStorage data
    localStorage.removeItem('token');
    localStorage.removeItem('wallet');
    console.log('Logout completed - localStorage cleared');
  }

  async function updateProfile(updates) {
    try {
      const { data } = await api.put('/users/me', updates);
      setUser(data);
      return data;
    } catch (error) {
      throw error;
    }
  }

  // Add test functions to window for debugging
  useEffect(() => {
    window.testDemoPayment = async () => {
      console.log('Testing demo payment...');
      try {
        const result = await payPlatformFee({ 
          to: '0x000000000000000000000000000000000000dEaD', 
          amountEth: 0.00001, 
          amountSol: 0 
        });
        console.log('Demo payment test result:', result);
        return result;
      } catch (error) {
        console.error('Demo payment test failed:', error);
        throw error;
      }
    };

    window.forceMetaMaskConnection = async () => {
      console.log('Forcing MetaMask connection...');
      try {
        await connectWallet();
        console.log('MetaMask connection attempt completed');
      } catch (error) {
        console.error('MetaMask connection failed:', error);
        throw error;
      }
    };

    window.checkMetaMaskStatus = () => {
      console.log('MetaMask Status Check:');
      console.log('- window.ethereum exists:', !!window.ethereum);
      if (window.ethereum) {
        console.log('- isMetaMask:', window.ethereum.isMetaMask);
        console.log('- selectedAddress:', window.ethereum.selectedAddress);
        console.log('- chainId:', window.ethereum.chainId);
        console.log('- networkVersion:', window.ethereum.networkVersion);
      }
      console.log('- Current wallet state:', wallet);
    };

    window.resetWalletState = () => {
      console.log('Resetting wallet state...');
      localStorage.removeItem('wallet');
      setWallet({ address: '', connected: false, type: '' });
      console.log('Wallet state reset complete');
    };
  }, [wallet]);

  return (
    <AuthCtx.Provider value={{
      token,
      user,
      wallet,
      api,
      login,
      register,
      logout,
      updateProfile,
      connectWallet,
      payPlatformFee
    }}>
      {children}
    </AuthCtx.Provider>
  );
}
