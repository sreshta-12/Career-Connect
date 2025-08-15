import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true, 
    trim: true 
  },
  passwordHash: { 
    type: String, 
    required: true 
  },
  bio: { 
    type: String, 
    default: '' 
  },
  linkedin: { 
    type: String, 
    default: '' 
  },
  skills: { 
    type: [String], 
    default: [] 
  },
  walletAddress: { 
    type: String, 
    default: '' 
  },
  role: { 
    type: String, 
    enum: ['user', 'recruiter', 'admin'], 
    default: 'user' 
  }
}, { 
  timestamps: true 
});
userSchema.virtual('displayName').get(function () {
  return this.name || this.email.split('@')[0];
});

export default mongoose.model('User', userSchema);
