import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import BlockchainPayment from '../components/BlockchainPayment.jsx';

export default function PostJob() {
	const { api } = useAuth();
	const [title, setTitle] = useState('');
	const [company, setCompany] = useState('');
	const [description, setDescription] = useState('');
	const [skills, setSkills] = useState('react, node');
	const [budget, setBudget] = useState('');
	const [location, setLocation] = useState('Remote');
	const [tags, setTags] = useState('');
	const [paymentCompleted, setPaymentCompleted] = useState(false);
	const [paymentError, setPaymentError] = useState('');

	const handlePaymentSuccess = (result) => {
		setPaymentCompleted(true);
		setPaymentError('');
	};

	const handlePaymentError = (error) => {
		setPaymentError(error);
		setPaymentCompleted(false);
	};

	async function submit() {
		if (!paymentCompleted) return alert('Please complete the platform fee payment first.');
		
		try {
			const payload = {
				title, 
				company,
				description,
				skills: skills.split(',').map(s => s.trim()).filter(Boolean),
				budget: Number(budget) || undefined,
				location,
				tags: tags.split(',').map(s => s.trim()).filter(Boolean)
			};
			
			const { data } = await api.post('/jobs', payload);
			alert('Job posted successfully: ' + data.title);
			
			// Reset form
			setTitle(''); 
			setCompany('');
			setDescription(''); 
			setSkills(''); 
			setBudget(''); 
			setTags('');
			setPaymentCompleted(false);
		} catch (e) {
			console.error('Failed to post job:', e);
			alert('Failed to post job: ' + e.message);
		}
	}



	return (
		<div className="max-w-2xl mx-auto py-6 space-y-6 px-4">
			<h2 className="text-2xl font-bold">Post a Job</h2>
			
			{/* Blockchain Payment Integration */}
			{!paymentCompleted ? (
				<BlockchainPayment 
					onPaymentSuccess={handlePaymentSuccess}
					onPaymentError={handlePaymentError}
				/>
			) : (
				<div className="p-4 rounded-lg bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800">
					<div className="flex items-center gap-3">
						<span className="text-green-600 dark:text-green-400 text-xl">✓</span>
						<div>
							<h3 className="font-medium text-green-800 dark:text-green-200">Payment Confirmed</h3>
							<p className="text-sm text-green-700 dark:text-green-300">
								Your platform fee has been paid. You can now post your job!
							</p>
						</div>
					</div>
				</div>
			)}

			{/* Job Form */}
			{paymentCompleted && (
				<div className="space-y-4">
					<div className="flex justify-between items-center">
						<h3 className="text-lg font-semibold">Job Details</h3>
						<button
							onClick={() => setPaymentCompleted(false)}
							className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
						>
							Reset Payment
						</button>
					</div>
					<div>
						<label className="block text-sm font-medium mb-1">Job Title *</label>
						<input 
							value={title} 
							onChange={e => setTitle(e.target.value)} 
							placeholder="e.g., Senior React Developer" 
							className="w-full p-3 rounded-xl border bg-white dark:bg-gray-800"
						/>
					</div>
					
					<div>
						<label className="block text-sm font-medium mb-1">Company</label>
						<input 
							value={company} 
							onChange={e => setCompany(e.target.value)} 
							placeholder="e.g., TechCorp Inc." 
							className="w-full p-3 rounded-xl border bg-white dark:bg-gray-800"
						/>
					</div>
					
					<div>
						<label className="block text-sm font-medium mb-1">Description *</label>
						<textarea 
							value={description} 
							onChange={e => setDescription(e.target.value)} 
							placeholder="Describe the role, responsibilities, and requirements..." 
							rows={4}
							className="w-full p-3 rounded-xl border bg-white dark:bg-gray-800"
						/>
					</div>
					
					<div>
						<label className="block text-sm font-medium mb-1">Skills (comma-separated)</label>
						<input 
							value={skills} 
							onChange={e => setSkills(e.target.value)} 
							placeholder="e.g., React, Node.js, MongoDB" 
							className="w-full p-3 rounded-xl border bg-white dark:bg-gray-800"
						/>
					</div>
					
					<div>
						<label className="block text-sm font-medium mb-1">Budget</label>
						<input 
							value={budget} 
							onChange={e => setBudget(e.target.value)} 
							placeholder="e.g., 5000" 
							className="w-full p-3 rounded-xl border bg-white dark:bg-gray-800"
						/>
					</div>
					
					<div>
						<label className="block text-sm font-medium mb-1">Location</label>
						<input 
							value={location} 
							onChange={e => setLocation(e.target.value)} 
							placeholder="e.g., Remote, New York" 
							className="w-full p-3 rounded-xl border bg-white dark:bg-gray-800"
						/>
					</div>
					
					<div>
						<label className="block text-sm font-medium mb-1">Tags (comma-separated)</label>
						<input 
							value={tags} 
							onChange={e => setTags(e.target.value)} 
							placeholder="e.g., Full-time, Remote, Startup" 
							className="w-full p-3 rounded-xl border bg-white dark:bg-gray-800"
						/>
					</div>
					
					<button 
						onClick={submit} 
						className="w-full py-3 px-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
					>
						Post Job
					</button>
				</div>
			)}
		</div>
	);
}
