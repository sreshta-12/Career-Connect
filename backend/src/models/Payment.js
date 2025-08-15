import mongoose from 'mongoose';
const paymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  to: { type: String, required: true },
  amountEth: { type: Number, default: 0 },
  amountSol: { type: Number, default: 0 },
  txHash: { type: String, required: true },
  network: { type: String, default: 'ethereum' },
  walletType: { type: String, enum: ['ethereum', 'solana', 'demo'], default: 'ethereum' },
}, { timestamps: true });
export default mongoose.model('Payment', paymentSchema);
