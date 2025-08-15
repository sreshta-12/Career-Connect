import express from 'express';
const router = express.Router();

const KNOWN_SKILLS = [
  'javascript','typescript','react','node','express','mongo','mongodb','postgres','sql','docker','kubernetes',
  'aws','gcp','azure','html','css','tailwind','nextjs','vite','redux','python','java','c++','go','rust','nestjs',
  'graphql','rest','fastapi','flask','django','ml','ai','nlp','pytorch','tensorflow','sklearn','linux','git',
  'solidity','ethers','web3','metamask','solana','phantom','redis','rabbitmq','kafka','microservices'
];

function extractSkills(text='') {
  const t = text.toLowerCase();
  const found = new Set();
  for (const s of KNOWN_SKILLS) {
    const re = new RegExp(`\\b${s.replace('+','\\+')}\\b`, 'i');
    if (re.test(t)) found.add(s);
  }
  return Array.from(found);
}
function jaccard(a, b) {
  const A = new Set(a), B = new Set(b);
  const inter = new Set([...A].filter(x => B.has(x)));
  const union = new Set([...A, ...B]);
  return union.size ? inter.size / union.size : 0;
}

router.post('/extract', (req, res) => {
  const { text } = req.body;
  const skills = extractSkills(text || '');
  res.json({ skills });
});
router.post('/match', (req, res) => {
  const { jobSkills = [], userSkills = [] } = req.body;
  const score = jaccard(jobSkills.map(s=>s.toLowerCase()), userSkills.map(s=>s.toLowerCase()));
  res.json({ score });
});
export default router;
