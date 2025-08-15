import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import WalletStatus from '../components/WalletStatus.jsx';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="py-10 max-w-6xl mx-auto px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Find Jobs, Gigs & Connections</h1>
        <p className="text-xl opacity-80 max-w-2xl mx-auto">
          A modern job portal with AI-powered matching, Web3 payments, and smart skill extraction.
        </p>
      </div>

      {/* Feature Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="p-6 rounded-xl border bg-white dark:bg-gray-800">
          <div className="text-2xl mb-3">🤖</div>
          <h3 className="font-semibold mb-2">AI-Powered Matching</h3>
          <p className="text-sm opacity-70">Smart job-candidate matching with similarity scores and skill extraction.</p>
        </div>
        <div className="p-6 rounded-xl border bg-white dark:bg-gray-800">
          <div className="text-2xl mb-3">🔗</div>
          <h3 className="font-semibold mb-2">Web3 Integration</h3>
          <p className="text-sm opacity-70">MetaMask wallet connection and blockchain payments for job posting.</p>
        </div>
        <div className="p-6 rounded-xl border bg-white dark:bg-gray-800">
          <div className="text-2xl mb-3">💼</div>
          <h3 className="font-semibold mb-2">Smart Job Discovery</h3>
          <p className="text-sm opacity-70">Advanced filtering, search, and personalized job recommendations.</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="text-center mb-12">
        <div className="flex gap-4 justify-center">
          <Link to="/jobs" className="px-6 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">
            Browse Jobs
          </Link>
          {user ? (
            <Link to="/post" className="px-6 py-3 rounded-xl bg-green-600 text-white hover:bg-green-700 transition-colors">
              Post a Job
            </Link>
          ) : (
            <Link to="/register" className="px-6 py-3 rounded-xl bg-green-600 text-white hover:bg-green-700 transition-colors">
              Get Started
            </Link>
          )}
        </div>
      </div>

      {/* Wallet Status Section */}
      <div className="max-w-md mx-auto">
        <WalletStatus />
      </div>

      {/* Quick Stats */}
      {user && (
        <div className="mt-8 text-center">
          <p className="text-sm opacity-70">
            Welcome back, {user.name || user.email}! 
            <Link to="/profile" className="ml-2 text-indigo-600 hover:underline">Edit Profile</Link>
          </p>
        </div>
      )}
    </div>
  );
}
