import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import JobCard from '../components/JobCard.jsx';

export default function Jobs() {
  const { api, user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState({
    skill: '',
    location: '',
    tag: '',
    q: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function load(searchFilters = null) {
    setLoading(true);
    setError('');
    try {
      // Use match endpoint if user is logged in, otherwise use regular jobs endpoint
      const endpoint = user ? '/match/jobs-with-score' : '/jobs';
      
      // Use provided filters or current state filters
      const filtersToUse = searchFilters || filters;
      
      // Only include non-empty filters
      const activeFilters = Object.fromEntries(
        Object.entries(filtersToUse).filter(([_, v]) => v.trim())
      );
      
      console.log('Searching with filters:', activeFilters);
      console.log('Using endpoint:', endpoint);
      console.log('User logged in:', !!user);
      
      const { data } = await api.get(endpoint, { 
        params: activeFilters
      });
      
      console.log('Found jobs:', data.length);
      console.log('Sample job data:', data[0]);
      setJobs(data);
    } catch (error) {
      console.error('Failed to load jobs:', error);
      setError('Failed to load jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  // Load jobs when component mounts
  useEffect(() => { 
    load(); 
  }, [user]);

  const updateFilter = (key, value) => {
    console.log(`Updating filter ${key} to:`, value);
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Apply filter immediately if there's a value
    if (value.trim()) {
      load(newFilters);
    } else {
      // If clearing a filter, reload with remaining filters
      const remainingFilters = { ...newFilters };
      delete remainingFilters[key];
      if (Object.values(remainingFilters).some(v => v.trim())) {
        load(remainingFilters);
      } else {
        // No filters left, load all jobs
        load({});
      }
    }
  };

  const clearFilters = () => {
    console.log('Clearing all filters');
    setFilters({ skill: '', location: '', tag: '', q: '' });
    load({}); // Load all jobs
  };

  const handleSearch = () => {
    console.log('Manual search triggered');
    load(filters);
  };

  return (
    <div className="py-6 max-w-6xl mx-auto px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4">Find Your Next Opportunity</h1>
        
        {/* Search Bar */}
        <div className="mb-4">
          <input 
            value={filters.q} 
            onChange={e => updateFilter('q', e.target.value)} 
            placeholder="Search jobs, companies, or descriptions..." 
            className="w-full p-3 rounded-xl border bg-white dark:bg-gray-800"
          />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <input 
            value={filters.skill} 
            onChange={e => updateFilter('skill', e.target.value)} 
            placeholder="Filter by skill (e.g., React, Python)" 
            className="p-2 rounded-xl border bg-white dark:bg-gray-800" 
          />
          <input 
            value={filters.location} 
            onChange={e => updateFilter('location', e.target.value)} 
            placeholder="Filter by location (e.g., Remote, Bangalore)" 
            className="p-2 rounded-xl border bg-white dark:bg-gray-800" 
          />
          <input 
            value={filters.tag} 
            onChange={e => updateFilter('tag', e.target.value)} 
            placeholder="Filter by tag" 
            className="p-2 rounded-xl border bg-white dark:bg-gray-800" 
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button 
            onClick={handleSearch} 
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Search Now'}
          </button>
          <button 
            onClick={clearFilters} 
            className="px-4 py-2 rounded-xl border hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Clear Filters
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Active Filters Display */}
        {Object.values(filters).some(v => v.trim()) && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
            <p className="text-sm text-blue-700">
              Active filters: {Object.entries(filters)
                .filter(([_, v]) => v.trim())
                .map(([k, v]) => `${k}: ${v}`)
                .join(', ')}
            </p>
          </div>
        )}
      </div>

      {/* Jobs Grid */}
      <div className="grid gap-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Searching for jobs...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No jobs found. Try adjusting your filters.</p>
            <p className="text-sm text-gray-500 mt-2">
              Try searching for: React, Python, Remote, Bangalore, etc.
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-600 mb-2">Found {jobs.length} jobs</p>
            {jobs.map(job => (
              <JobCard key={job._id} job={job} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
