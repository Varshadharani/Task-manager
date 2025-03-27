import React, { useState } from 'react';
import { api } from '../services/api';

const TaskItem = ({ task, onTaskUpdated }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [category, setCategory] = useState(task.category);
  const [error, setError] = useState('');

  const handleUpdate = async () => {
    try {
      await api.put(`/tasks/${task._id}`, { title, description, category });
      setIsEditing(false);
      onTaskUpdated();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update task');
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/tasks/${task._id}`);
      onTaskUpdated();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete task');
    }
  };

  return (
    <div className="task-item d-flex justify-content-between align-items-center mb-3 p-3 bg-light rounded shadow-sm">
      {error && <div className="alert alert-danger w-100">{error}</div>}
      {isEditing ? (
        <div className="d-flex flex-column">
          <input type="text" className="form-control mb-2" value={title} onChange={(e) => setTitle(e.target.value)} />
          <input type="text" className="form-control mb-2" value={description} onChange={(e) => setDescription(e.target.value)} />
          <input type="text" className="form-control mb-2" value={category} onChange={(e) => setCategory(e.target.value)} />
          <button className="btn btn-success btn-sm mb-2" onClick={handleUpdate}>Save</button>
        </div>
      ) : (
        <div className="d-flex justify-content-between align-items-center w-100">
          <div className="task-details">
            <h6>{task.title}</h6>
            <p>{task.description}</p>
            <span className="badge bg-secondary">{task.category}</span>
          </div>
          <div className="task-actions d-flex align-items-center">
            <button className="btn btn-warning btn-sm me-2" onClick={() => setIsEditing(true)}>Edit</button>
            <button className="btn btn-danger btn-sm" onClick={handleDelete}>Delete</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskItem;
