const mongoose = require('../mongoose-root');

const universitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  country: {
    type: String,
    required: true,
    trim: true,
  },
  city: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  website: {
    type: String,
    trim: true,
  },
  address: {
    type: String,
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
  },
  established: {
    type: Number,
  },
  type: {
    type: String,
    enum: ['public', 'private', 'for-profit'],
  },
  accreditation: [String],
  programs: [{
    name: String,
    level: {
      type: String,
      enum: ['undergraduate', 'graduate', 'doctoral', 'certificate'],
    },
    duration: String,
    language: String,
  }],
  facilities: [String],
  ranking: {
    world: Number,
    national: Number,
  },
  tuition: {
    undergraduate: {
      local: Number,
      international: Number,
    },
    graduate: {
      local: Number,
      international: Number,
    },
  },
  admissionRequirements: {
    gpa: Number,
    languageTest: {
      type: String,
      score: Number,
    },
    documents: [String],
  },
  images: [String],
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for search
universitySchema.index({ name: 'text', country: 'text', city: 'text' });

// Update updatedAt on save
universitySchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('University', universitySchema);