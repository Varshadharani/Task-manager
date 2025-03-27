import React, { useEffect, useState } from "react";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await api.get("/tasks");
      setTasks(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch tasks");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleAddOrUpdateTask = async () => {
    if (!title || !description || !category) {
      alert("Please fill all fields");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("No token provided. Please log in.");
        return;
      }

      if (isEditing) {
        await api.put(`/tasks/${currentTaskId}`, { title, description, category });
        alert("Task updated successfully!");
      } else {
        await api.post("/tasks", { title, description, category });
        alert("Task added successfully!");
      }

      setTitle("");
      setDescription("");
      setCategory("");
      setIsEditing(false);
      fetchTasks();
    } catch (error) {
      alert(error.response?.data?.message || "Error adding/updating task");
    }
  };

  const handleEdit = (task) => {
    setTitle(task.title);
    setDescription(task.description);
    setCategory(task.category);
    setIsEditing(true);
    setCurrentTaskId(task._id);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      alert("Task deleted successfully!");
      fetchTasks();
    } catch (error) {
      alert(error.response?.data?.message || "Error deleting task");
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary">Task Manager</h2>
        <button className="btn btn-danger rounded-pill px-4" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Task Form */}
      <div className="card shadow p-4 mb-4">
        <h4 className="text-secondary">{isEditing ? "Edit Task" : "Add a New Task"}</h4>
        <div className="row">
          <div className="col-md-4 mb-3">
            <input type="text" className="form-control" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="col-md-4 mb-3">
            <input type="text" className="form-control" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="col-md-4 mb-3">
            <input type="text" className="form-control" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
          </div>
          <div className="col-md-12 text-end">
            <button className={`btn ${isEditing ? "btn-warning" : "btn-primary"} rounded-pill px-4`} onClick={handleAddOrUpdateTask}>
              {isEditing ? "Update Task" : "Add Task"}
            </button>
          </div>
        </div>
      </div>

      {/* Task List */}
      <h4 className="text-secondary">Your Tasks</h4>
      {tasks.length === 0 ? (
        <div className="alert alert-info">No tasks available. Add some tasks!</div>
      ) : (
        <div className="row">
          {tasks.map((task) => (
            <div key={task._id} className="col-md-12 mb-3">
              <div className="card shadow-sm p-3 border-0">
                <div className="d-flex justify-content-between align-items-center">
                  {/* Task Details - Uses flex-grow to take space */}
                  <div className="flex-grow-1">
                    <strong className="text-dark">{task.title}</strong> - {task.description}
                    <span className="badge bg-secondary ms-2">{task.category}</span>
                  </div>

                  {/* Buttons - Kept inline */}
                  <div className="d-flex gap-2">
                    <button className="btn btn-sm text-white" style={{ backgroundColor: "#007bff" }} onClick={() => handleEdit(task)}>
                      Edit
                    </button>
                    <button className="btn btn-sm text-white" style={{ backgroundColor: "#dc3545" }} onClick={() => handleDelete(task._id)}>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
