import mongoose from 'mongoose';

const InterviewRoundSchema = new mongoose.Schema({
  id: { type: String, default: () => `round-${Date.now()}-${Math.random().toString(36).substring(2, 6)}` },
  name: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String },
  interviewer: { type: String },
  format: { 
    type: String, 
    enum: ['video', 'phone', 'onsite', 'take-home'],
    default: 'video' 
  },
  questionsAsked: [{ type: String }],
  notes: { type: String },
  status: { 
    type: String, 
    enum: ['scheduled', 'completed', 'cancelled', 'passed', 'failed'],
    default: 'scheduled' 
  }
});

const ContactSchema = new mongoose.Schema({
  name: { type: String },
  role: { type: String },
  email: { type: String },
  linkedin: { type: String },
  notes: { type: String }
});

const HistoryEventSchema = new mongoose.Schema({
  date: { type: String, default: () => new Date().toISOString().split('T')[0] },
  status: { type: String, required: true },
  note: { type: String }
});

const JobSchema = new mongoose.Schema(
  {
    id: { 
      type: String, 
      required: true, 
      unique: true,
      default: () => `job-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
    },
    userId: { 
      type: String, 
      default: 'anonymous',
      index: true 
    },
    company: { type: String, required: true, trim: true, index: true },
    role: { type: String, required: true, trim: true, index: true },
    location: { type: String, default: 'Remote' },
    workMode: { 
      type: String, 
      enum: ['remote', 'hybrid', 'onsite'], 
      default: 'remote',
      index: true 
    },
    jobType: { 
      type: String, 
      enum: ['full-time', 'part-time', 'contract', 'internship'], 
      default: 'full-time' 
    },
    status: { 
      type: String, 
      enum: ['wishlist', 'applied', 'oa', 'interview', 'offer', 'rejected', 'archived'], 
      default: 'wishlist',
      index: true 
    },
    dateAdded: { 
      type: String, 
      default: () => new Date().toISOString().split('T')[0],
      index: true 
    },
    dateApplied: { type: String },
    deadline: { type: String },
    salaryMin: { type: Number },
    salaryMax: { type: Number },
    salaryCurrency: { type: String, default: 'USD' },
    salaryPeriod: { type: String, enum: ['year', 'month', 'hour'], default: 'year' },
    url: { type: String },
    source: { type: String, default: 'Direct' },
    jobDescription: { type: String, default: '' },
    keySkills: [{ type: String, trim: true }],
    matchedSkills: [{ type: String, trim: true }],
    resumeVersion: { type: String },
    portfolioLink: { type: String },
    referralContact: ContactSchema,
    recruiterContact: ContactSchema,
    interviewRounds: [InterviewRoundSchema],
    notes: { type: String, default: '' },
    priority: { type: Number, min: 1, max: 5, default: 3 },
    tags: [{ type: String }],
    history: [HistoryEventSchema]
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

// Compound search index for ultra-fast full-text searches
JobSchema.index({ company: 'text', role: 'text', keySkills: 'text', notes: 'text' });
JobSchema.index({ userId: 1, dateAdded: -1 });

export const Job = mongoose.models.Job || mongoose.model('Job', JobSchema);
