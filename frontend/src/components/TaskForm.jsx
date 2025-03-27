import React, { useState } from 'react';
import { api } from '../services/api';

const TaskForm = ({ onTaskAdded }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !category) {
      setError('All fields are required.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setError('You are not authenticated!');
      return;
    }

    try {
      await api.post('/tasks', { title, description, category }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTitle('');
      setDescription('');
      setCategory('');
      onTaskAdded();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add task');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="mb-3">
        <label htmlFor="title" className="form-label">Title</label>
        <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="form-control" required />
      </div>
      <div className="mb-3">
        <label htmlFor="description" className="form-label">Description</label>
        <input type="text" id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="form-control" required />
      </div>
      <div className="mb-3">
        <label htmlFor="category" className="form-label">Category</label>
        <input type="text" id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="form-control" required />
      </div>
      <button type="submit" className="btn btn-primary w-100">Add Task</button>
    </form>
  );
};

export default TaskForm;
