const express = require('express');
const Task = require('../models/Task');
const authenticate = require('../middleware/authMiddleware');
const router = express.Router();

// Create a Task
router.post('/', authenticate, async (req, res) => {
  const { title, description, category } = req.body;
  if (!req.user || !req.user.id) {
    return res.status(400).json({ message: 'User information is missing' });
  }
  try {
    const newTask = new Task({ 
      user: req.user._id, 
      title, 
      description, 
      category 
    });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: 'Error creating task', error: error.message });
  }
});

// Get All Tasks for Logged-in User
router.get('/', authenticate, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error: error.message });
  }
});

// Update Task
router.put('/:id', authenticate, async (req, res) => {
  const { title, description, completed, category } = req.body;
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { title, description, completed, category },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error updating task', error: error.message });
  }
});

// Delete Task
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task', error: error.message });
  }
});

module.exports = router;
