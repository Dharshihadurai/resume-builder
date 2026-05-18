const router = require('express').Router();
const Resume = require('../models/Resume');
const auth = require('../middleware/auth');

// Get all resumes for user
router.get('/', auth, async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user._id }).sort('-updatedAt');
    res.json(resumes);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Get single resume
router.get('/:id', auth, async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id });
    if (!resume) return res.status(404).json({ message: 'Resume not found' });
    res.json(resume);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Create resume
router.post('/', auth, async (req, res) => {
  try {
    const resume = await Resume.create({ ...req.body, user: req.user._id });
    res.status(201).json(resume);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Update resume
router.put('/:id', auth, async (req, res) => {
  try {
    const resume = await Resume.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );
    if (!resume) return res.status(404).json({ message: 'Resume not found' });
    res.json(resume);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Delete resume
router.delete('/:id', auth, async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!resume) return res.status(404).json({ message: 'Resume not found' });
    res.json({ message: 'Resume deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
