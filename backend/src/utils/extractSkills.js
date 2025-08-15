const DICT = [
  "c", "c++", "java", "python", "javascript", "react", "node", "express", "mongodb",
  "sql", "html", "css", "tailwind", "aws", "docker", "kubernetes", "linux", "tensorflow", "pytorch",
  "nlp", "opencv", "flutter", "dart", "solidity", "web3", "git", "github", "jenkins", "spark", "hadoop",
  "typescript", "vue", "angular", "next", "nuxt", "graphql", "redis", "postgresql", "mysql", "firebase",
  "heroku", "vercel", "netlify", "gcp", "azure", "terraform", "ansible", "jenkins", "gitlab", "bitbucket"
];

export function extractSkills(text = "") {
  const lower = text.toLowerCase();
  const found = new Set();
  
  for (const skill of DICT) {
    if (lower.includes(skill)) {
      found.add(skill);
    }
  }
  
  return Array.from(found);
}
