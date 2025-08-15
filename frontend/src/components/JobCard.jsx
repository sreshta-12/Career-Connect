import React from 'react';

export default function JobCard({ job, showMatchScore = true }) {
  const getMatchColor = (score) => {
    if (score >= 80) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    if (score >= 40) return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
  };

  return (
    <div className="border rounded-xl p-6 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow">
      {/* Header with title and match score */}
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-bold text-xl text-gray-900 dark:text-white">{job.title}</h3>
        {showMatchScore && job.matchScore !== undefined && (
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getMatchColor(job.matchScore)}`}>
            {job.matchScore}% Match
          </div>
        )}
      </div>

      {/* Company and location */}
      <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
        {job.company && <span className="font-medium">{job.company}</span>}
        {job.location && (
          <>
            {job.company && <span className="mx-2">•</span>}
            <span>{job.location}</span>
          </>
        )}
      </div>

      {/* Description */}
      <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
        {job.description}
      </p>

      {/* Skills */}
      {job.skills && job.skills.length > 0 && (
        <div className="mb-4">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Required Skills:</div>
          <div className="flex flex-wrap gap-2">
            {job.skills.map(skill => (
              <span 
                key={skill} 
                className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Budget and tags */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          {job.budget && (
            <span className="font-medium text-green-600 dark:text-green-400">
              ₹{job.budget.toLocaleString()}
            </span>
          )}
          {job.tags && job.tags.length > 0 && (
            <div className="flex gap-2">
              {job.tags.slice(0, 3).map(tag => (
                <span key={tag} className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-xs">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        
        <div className="text-xs text-gray-500 dark:text-gray-500">
          {job.createdBy?.name || 'Unknown'} • {new Date(job.createdAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}
