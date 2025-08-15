import express from 'express';
import Payment from '../models/Payment.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    console.log('Payment request received:', req.body);
    console.log('User making payment:', req.user);
    const { to, amountEth, amountSol, txHash, network, walletType } = req.body;
    
    // Validate required parameters
    if (!to || !txHash) {
      console.log('Missing required parameters:', { to, txHash });
      return res.status(400).json({ error: 'Missing or invalid parameters: to and txHash are required' });
    }
    
    // Validate that at least one amount is provided (except for demo payments)
    if ((!amountEth || amountEth === 0) && (!amountSol || amountSol === 0) && walletType !== 'demo') {
      console.log('Missing amount parameters:', { amountEth, amountSol, walletType });
      return res.status(400).json({ error: 'Missing or invalid parameters: amountEth or amountSol must be provided' });
    }
    
    const payment = await Payment.create({
      user: req.user.id,
      to,
      amountEth: amountEth || 0,
      amountSol: amountSol || 0,
      txHash,
      network: network || 'ethereum',
      walletType: walletType || 'ethereum'
    });
    res.json(payment);
  } catch (e) {
    console.error('Payment creation error:', e);
    res.status(400).json({ error: e.message });
  }
});

router.get('/mine', auth, async (req, res) => {
  const payments = await Payment.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(payments);
});

// Test endpoint to verify payment parameters
router.post('/test', (req, res) => {
  console.log('Test payment endpoint called with:', req.body);
  const { to, amountEth, amountSol, txHash, network, walletType } = req.body;
  
  // Check if all required parameters are present
  const missingParams = [];
  if (!to) missingParams.push('to');
  if (!txHash) missingParams.push('txHash');
  if ((!amountEth || amountEth === 0) && (!amountSol || amountSol === 0)) {
    missingParams.push('amountEth or amountSol');
  }
  
  if (missingParams.length > 0) {
    return res.status(400).json({ 
      error: 'Missing or invalid parameters', 
      missing: missingParams,
      received: req.body 
    });
  }
  
  res.json({ 
    success: true, 
    message: 'All parameters are valid',
    received: req.body 
  });
});

export default router;
