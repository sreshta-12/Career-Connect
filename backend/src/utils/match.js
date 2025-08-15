export function matchScore(job, user) {
  // Combine job text for analysis
  const jobText = (job.description + ' ' + (job.skills || []).join(' ') + ' ' + (job.title || '')).toLowerCase();
  
  // Combine user text for analysis
  const userText = (user.bio + ' ' + (user.skills || []).join(' ')).toLowerCase();
  
  // Simple bag-of-words similarity
  const jobWords = new Set(jobText.split(/\s+/).filter(word => word.length > 2));
  const userWords = new Set(userText.split(/\s+/).filter(word => word.length > 2));
  
  // Calculate Jaccard similarity
  const intersection = new Set([...jobWords].filter(x => userWords.has(x)));
  const union = new Set([...jobWords, ...userWords]);
  
  const jaccard = union.size > 0 ? intersection.size / union.size : 0;
  
  // Boost score for exact skill matches
  const skillMatch = job.skills ? 
    job.skills.filter(skill => user.skills && user.skills.includes(skill)).length : 0;
  const skillBonus = skillMatch * 0.1;
  
  // Final score: Jaccard similarity + skill bonus, capped at 100
  const finalScore = Math.min(100, Math.round((jaccard + skillBonus) * 100));
  
  return finalScore;
}
