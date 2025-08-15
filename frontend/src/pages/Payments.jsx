import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Payments() {
  const { api } = useAuth();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { 
    (async() => {
      try {
        const { data } = await api.get('/payments/mine');
        setList(data);
      } catch (error) {
        console.error('Failed to load payments:', error);
      } finally {
        setLoading(false);
      }
    })() 
  }, []);

  const formatAmount = (payment) => {
    if (payment.amountSol > 0) {
      return `${payment.amountSol} SOL`;
    } else if (payment.amountEth > 0) {
      return `${payment.amountEth} ETH`;
    }
    return '0 ETH';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (payment) => {
    if (payment.walletType === 'demo') {
      return <span className="px-2 py-1 text-xs rounded bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">Demo</span>;
    }
    return <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Confirmed</span>;
  };

  if (loading) {
    return (
      <div className="py-6">
        <h2 className="text-xl font-semibold mb-3">My Payments</h2>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Loading payments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <h2 className="text-xl font-semibold mb-6">My Payments</h2>
      
      {list.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-400 text-6xl mb-4">💳</div>
          <p className="text-gray-600 dark:text-gray-400">No payments found</p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Your payment history will appear here</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {list.map(payment => (
            <div key={payment._id} className="border rounded-lg p-4 bg-white dark:bg-gray-800 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                    <span className="text-indigo-600 dark:text-indigo-400 text-lg">💸</span>
                  </div>
                  <div>
                    <h3 className="font-medium">Platform Fee Payment</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {formatDate(payment.createdAt)}
                    </p>
                  </div>
                </div>
                {getStatusBadge(payment)}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                  <span className="ml-2 font-medium">{formatAmount(payment)}</span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Network:</span>
                  <span className="ml-2 font-medium capitalize">{payment.network}</span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">To:</span>
                  <span className="ml-2 font-mono text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                    {payment.to.slice(0, 8)}...{payment.to.slice(-6)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Transaction:</span>
                  <span className="ml-2 font-mono text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                    {payment.txHash.slice(0, 8)}...{payment.txHash.slice(-6)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
