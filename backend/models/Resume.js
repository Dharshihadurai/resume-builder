const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, default: 'My Resume' },
  personalInfo: {
    fullName: String,
    email: String,
    phone: String,
    address: String,
    linkedin: String,
    github: String,
    website: String,
    summary: String,
  },
  experience: [{
    company: String,
    position: String,
    startDate: String,
    endDate: String,
    current: { type: Boolean, default: false },
    description: String,
  }],
  education: [{
    institution: String,
    degree: String,
    field: String,
    startDate: String,
    endDate: String,
    gpa: String,
  }],
  skills: [{ name: String, level: String }],
  projects: [{
    name: String,
    description: String,
    technologies: String,
    link: String,
  }],
}, { timestamps: true });

module.exports = mongoose.model('Resume', resumeSchema);
