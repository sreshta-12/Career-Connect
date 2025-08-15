import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import PaymentTroubleshooter from './PaymentTroubleshooter.jsx';

const PLATFORM_FEE_ETH = 0.00001;
const PLATFORM_FEE_SOL = 0.0001;
const ADMIN_WALLET_ETH = '0x000000000000000000000000000000000000dEaD';
const ADMIN_WALLET_SOL = '11111111111111111111111111111112';

export default function BlockchainPayment({ onPaymentSuccess, onPaymentError }) {
  const { wallet, connectWallet, payPlatformFee, api } = useAuth();
  const [paymentStatus, setPaymentStatus] = useState('idle'); // idle, connecting, paying, confirming, success, error
  const [errorMessage, setErrorMessage] = useState('');
  const [showTroubleshooter, setShowTroubleshooter] = useState(false);

     const handleWalletConnection = async () => {
     setPaymentStatus('connecting');
     setErrorMessage('');
     
     try {
       await connectWallet();
       setPaymentStatus('idle');
     } catch (error) {
       setPaymentStatus('error');
       let errorMsg = `Wallet connection failed: ${error.message}`;
       
       // Provide more specific guidance
       if (error.message.includes('MetaMask')) {
         errorMsg = 'MetaMask not found. Please install MetaMask extension and try again.';
       } else if (error.message.includes('Phantom')) {
         errorMsg = 'Phantom wallet not found. Please install Phantom extension and try again.';
       } else if (error.message.includes('user rejected')) {
         errorMsg = 'Wallet connection was rejected. Please approve the connection in your wallet.';
       }
       
       setErrorMessage(errorMsg);
       onPaymentError?.(errorMsg);
     }
   };

  const handlePayment = async () => {
    if (!wallet.connected) {
      setErrorMessage('Please connect your wallet first');
      return;
    }

    setPaymentStatus('paying');
    setErrorMessage('');

    try {
      // Determine payment parameters based on wallet type
      let paymentParams = {};
      
      if (wallet.type === 'solana') {
        paymentParams = {
          to: ADMIN_WALLET_SOL,
          amountEth: 0,
          amountSol: PLATFORM_FEE_SOL
        };
      } else {
        paymentParams = {
          to: ADMIN_WALLET_ETH,
          amountEth: PLATFORM_FEE_ETH,
          amountSol: 0
        };
      }

      // Initiate blockchain transaction
      const result = await payPlatformFee(paymentParams);
      
      setPaymentStatus('confirming');
      
      // Log payment to backend
      const paymentData = {
        to: paymentParams.to,
        amountEth: paymentParams.amountEth,
        amountSol: paymentParams.amountSol,
        txHash: result.txHash,
        network: wallet.type === 'solana' ? 'solana' : 'ethereum',
        walletType: result.isDemo ? 'demo' : wallet.type
      };

      await api.post('/payments', paymentData);
      
      setPaymentStatus('success');
      onPaymentSuccess?.(result);
      
         } catch (error) {
       setPaymentStatus('error');
       let errorMsg = error.message || 'Payment failed';
       
       // Provide more specific error messages
       if (errorMsg.includes('insufficient funds')) {
         errorMsg = 'Insufficient funds in wallet. You need at least 0.0001 ETH for payment + gas fees.';
       } else if (errorMsg.includes('user rejected')) {
         errorMsg = 'Transaction was rejected in MetaMask. Please try again and approve the transaction.';
       } else if (errorMsg.includes('network')) {
         errorMsg = 'Network error. Please switch to Sepolia testnet in MetaMask.';
       } else if (errorMsg.includes('demo')) {
         errorMsg = 'Demo mode error. Please try connecting a real wallet.';
       } else if (errorMsg.includes('Transaction not confirmed')) {
         errorMsg = 'Transaction is pending. Please wait for confirmation or check MetaMask for status.';
       } else if (errorMsg.includes('Account mismatch')) {
         errorMsg = 'Account mismatch. Please reconnect your wallet and try again.';
       }
       
       setErrorMessage(errorMsg);
       onPaymentError?.(errorMsg);
     }
  };

  const getStatusMessage = () => {
    switch (paymentStatus) {
      case 'connecting':
        return 'Connecting wallet...';
      case 'paying':
        return 'Initiating blockchain transaction...';
      case 'confirming':
        return 'Confirming transaction on blockchain...';
      case 'success':
        return 'Payment successful! Transaction confirmed.';
      case 'error':
        return 'Payment failed. Please try again.';
      default:
        return '';
    }
  };

  const getFeeDisplay = () => {
    if (wallet.type === 'solana') {
      return `${PLATFORM_FEE_SOL} SOL`;
    }
    return `${PLATFORM_FEE_ETH} ETH`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border p-6 space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Blockchain Payment Integration</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Connect your wallet and pay the platform fee to post a job
        </p>
      </div>

      {/* Wallet Connection Status */}
      <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
        <div className="flex items-center justify-between mb-3">
          <span className="font-medium">Wallet Status</span>
          <span className={`px-2 py-1 rounded text-xs ${
            wallet.connected 
              ? wallet.isDemo 
                ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          }`}>
            {wallet.connected 
              ? wallet.isDemo ? 'Demo Mode' : 'Connected'
              : 'Not Connected'
            }
          </span>
        </div>
        
        {wallet.connected ? (
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-600 dark:text-gray-400">Address:</span>
              <code className="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded text-xs">
                {wallet.address.slice(0, 8)}...{wallet.address.slice(-6)}
              </code>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600 dark:text-gray-400">Type:</span>
              <span className="capitalize">{wallet.type}</span>
            </div>
            {wallet.isDemo && (
              <div className="text-orange-600 dark:text-orange-400 text-xs">
                ⚠️ Demo mode: No real blockchain transactions
              </div>
            )}
          </div>
                 ) : (
           <div className="text-sm text-gray-600 dark:text-gray-400">
             Connect your MetaMask or Phantom wallet to proceed
             <div className="mt-2 text-xs text-blue-600 dark:text-blue-400">
               💡 Tip: Phantom wallet works great with Solana devnet for testing!
             </div>
           </div>
         )}
      </div>

      {/* Payment Details */}
      <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800">
        <h4 className="font-medium mb-2">Platform Fee</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Amount:</span>
            <span className="font-medium">{getFeeDisplay()}</span>
          </div>
          <div className="flex justify-between">
            <span>Network:</span>
            <span className="capitalize">{wallet.type === 'solana' ? 'Solana' : 'Ethereum'}</span>
          </div>
          <div className="flex justify-between">
            <span>To:</span>
            <code className="text-xs bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded">
              {wallet.type === 'solana' 
                ? ADMIN_WALLET_SOL.slice(0, 8) + '...' + ADMIN_WALLET_SOL.slice(-6)
                : ADMIN_WALLET_ETH.slice(0, 8) + '...' + ADMIN_WALLET_ETH.slice(-6)
              }
            </code>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        {!wallet.connected ? (
          <button
            onClick={handleWalletConnection}
            disabled={paymentStatus === 'connecting'}
            className="w-full py-3 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {paymentStatus === 'connecting' ? 'Connecting...' : 'Connect Wallet'}
          </button>
        ) : (
          <button
            onClick={handlePayment}
            disabled={paymentStatus === 'paying' || paymentStatus === 'confirming'}
            className="w-full py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {paymentStatus === 'paying' ? 'Processing Payment...' : 
             paymentStatus === 'confirming' ? 'Confirming...' : 
             `Pay ${getFeeDisplay()} Platform Fee`}
          </button>
        )}

                 {wallet.connected && (
           <button
             onClick={handleWalletConnection}
             className="w-full py-2 px-4 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
           >
             Reconnect Wallet
           </button>
         )}
         
                   {!wallet.connected && (
            <button
              onClick={() => {
                // Force demo mode
                const demoWallet = { 
                  address: '0xDemoWallet123...', 
                  connected: true,
                  isDemo: true,
                  type: 'demo'
                };
                // This will trigger the wallet state update
                window.location.search = '?demo=true';
                window.location.reload();
              }}
              className="w-full py-2 px-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm"
            >
              Try Demo Mode
            </button>
          )}
          
          {!wallet.connected && (
            <button
              onClick={() => {
                // Force Phantom connection
                if (window.solana && window.solana.isPhantom) {
                  window.solana.connect();
                } else {
                  window.open('https://phantom.app/', '_blank');
                }
              }}
              className="w-full py-2 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
            >
              Install/Connect Phantom
            </button>
          )}
          
          {wallet.connected && !wallet.isDemo && (
            <button
              onClick={() => {
                // Switch to demo mode even when connected
                window.location.search = '?demo=true';
                window.location.reload();
              }}
              className="w-full py-2 px-4 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm"
            >
              Switch to Demo Mode
            </button>
          )}
      </div>

      {/* Status Messages */}
      {getStatusMessage() && (
        <div className={`p-3 rounded-lg text-sm ${
          paymentStatus === 'success' 
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
            : paymentStatus === 'error'
            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
        }`}>
          {getStatusMessage()}
        </div>
      )}

                      {/* Error Message */}
         {errorMessage && (
           <div className="p-3 rounded-lg bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 text-sm">
             <div className="font-medium mb-2">Payment Error</div>
             <div>{errorMessage}</div>
             
             {errorMessage.includes('Insufficient funds') && (
               <div className="mt-3 p-2 bg-yellow-50 dark:bg-yellow-900/30 rounded border border-yellow-200 dark:border-yellow-800">
                 <div className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                   💡 How to get test tokens:
                 </div>
                 <div className="text-xs text-yellow-700 dark:text-yellow-300 space-y-1">
                                       <div>• <strong>Ethereum:</strong> Use a faucet like <a href="https://sepoliafaucet.com/" target="_blank" rel="noopener noreferrer" className="underline">Sepolia Faucet</a></div>
                    <div>• <strong>Solana:</strong> Use <a href="https://faucet.quicknode.com/solana/devnet" target="_blank" rel="noopener noreferrer" className="underline">QuickNode Faucet</a> or <a href="https://faucet.helius.xyz/" target="_blank" rel="noopener noreferrer" className="underline">Helius Faucet</a></div>
                    <div>• <strong>Demo Mode:</strong> If you don't have a wallet, try demo mode for testing</div>
                 </div>
               </div>
             )}
             
             <div className="mt-3 flex gap-2">
               <button
                 onClick={() => {
                   setErrorMessage('');
                   setPaymentStatus('idle');
                 }}
                 className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 transition-colors"
               >
                 Dismiss
               </button>
               <button
                 onClick={() => setShowTroubleshooter(true)}
                 className="px-3 py-1 bg-yellow-600 text-white rounded text-xs hover:bg-yellow-700 transition-colors"
               >
                 Troubleshoot
               </button>
               {wallet.connected && (
                 <button
                   onClick={handlePayment}
                   className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
                 >
                   Retry Payment
                 </button>
               )}
             </div>
           </div>
         )}

      {/* Success Message */}
      {paymentStatus === 'success' && (
        <div className="p-3 rounded-lg bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-sm">
          ✓ Payment confirmed on blockchain. You can now post your job!
        </div>
      )}

      {/* Payment Troubleshooter */}
      {showTroubleshooter && (
        <PaymentTroubleshooter onClose={() => setShowTroubleshooter(false)} />
      )}
    </div>
  );
}
