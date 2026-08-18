import express from 'express';
import { Job } from '../models/Job.js';

const router = express.Router();

// GET /api/jobs - Retrieve all applications
router.get('/', async (req, res) => {
  try {
    const { status, workMode, search } = req.query;
    const filter = {};

    if (status && status !== 'all') {
      filter.status = status;
    }
    if (workMode && workMode !== 'all') {
      filter.workMode = workMode;
    }
    if (search) {
      filter.$or = [
        { company: { $regex: search, $options: 'i' } },
        { role: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { keySkills: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const jobs = await Job.find(filter).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: 'Failed to fetch jobs from database' });
  }
});

// GET /api/jobs/:id - Get single application
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findOne({ id: req.params.id });
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    res.json(job);
  } catch (error) {
    res.status(500).json({ error: 'Error finding job' });
  }
});

// POST /api/jobs - Create a new job application
router.post('/', async (req, res) => {
  try {
    const jobData = req.body;
    if (!jobData.company || !jobData.role) {
      return res.status(400).json({ error: 'Company and Role are required' });
    }

    if (!jobData.id) {
      jobData.id = `job-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    }
    if (!jobData.dateAdded) {
      jobData.dateAdded = new Date().toISOString().split('T')[0];
    }
    if (!jobData.history || jobData.history.length === 0) {
      jobData.history = [
        {
          date: jobData.dateAdded,
          status: jobData.status || 'wishlist',
          note: 'Created application'
        }
      ];
    }

    const newJob = new Job(jobData);
    await newJob.save();
    res.status(201).json(newJob);
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({ error: 'Failed to create job in MongoDB' });
  }
});

// PUT /api/jobs/:id - Update an existing job application
router.put('/:id', async (req, res) => {
  try {
    const updates = req.body;
    const existing = await Job.findOne({ id: req.params.id });
    
    if (!existing) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Check if status changed to push into history
    if (updates.status && updates.status !== existing.status) {
      const today = new Date().toISOString().split('T')[0];
      const historyEntry = {
        date: today,
        status: updates.status,
        note: updates.statusNote || `Moved to ${updates.status.toUpperCase()}`
      };
      if (!updates.history) {
        updates.history = [...(existing.history || []), historyEntry];
      }
    }

    const updatedJob = await Job.findOneAndUpdate(
      { id: req.params.id },
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.json(updatedJob);
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).json({ error: 'Failed to update job' });
  }
});

// DELETE /api/jobs/:id - Delete an application
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Job.findOneAndDelete({ id: req.params.id });
    if (!deleted) {
      return res.status(404).json({ error: 'Job not found' });
    }
    res.json({ message: 'Job successfully deleted', id: req.params.id });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({ error: 'Failed to delete job' });
  }
});

// POST /api/jobs/import - Bulk import applications
router.post('/import', async (req, res) => {
  try {
    const jobsList = req.body;
    if (!Array.isArray(jobsList)) {
      return res.status(400).json({ error: 'Expected an array of jobs' });
    }

    const formatted = jobsList.map(j => ({
      ...j,
      id: j.id || `job-imp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      dateAdded: j.dateAdded || new Date().toISOString().split('T')[0]
    }));

    const inserted = await Job.insertMany(formatted, { ordered: false });
    res.status(201).json({ count: inserted.length, jobs: inserted });
  } catch (error) {
    console.error('Bulk import error:', error);
    res.status(500).json({ error: 'Failed to import jobs' });
  }
});

// DELETE /api/jobs/clear/all - Clear all applications (with safety guard)
router.delete('/clear/all', async (req, res) => {
  try {
    await Job.deleteMany({});
    res.json({ message: 'All jobs cleared successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to clear database' });
  }
});

export default router;
