const mongoose = require('../mongoose-root');

const sessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  refreshToken: {
    type: String,
    required: true,
    unique: true,
  },
  userAgent: {
    type: String,
  },
  ipAddress: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for faster queries
sessionSchema.index({ user: 1, isActive: 1 });
sessionSchema.index({ refreshToken: 1 });
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Method to deactivate session
sessionSchema.methods.deactivate = function() {
  this.isActive = false;
  return this.save();
};

module.exports = mongoose.model('Session', sessionSchema);