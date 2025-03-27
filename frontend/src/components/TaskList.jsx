import React from 'react';
import TaskItem from './TaskItem';

const TaskList = ({ tasks, onTaskUpdated }) => {
  return (
    <div className="task-list">
      {tasks.length === 0 ? (
        <p className="text-center text-muted">No tasks available. Add some tasks!</p>
      ) : (
        tasks.map((task) => (
          <TaskItem key={task._id} task={task} onTaskUpdated={onTaskUpdated} />
        ))
      )}
    </div>
  );
};

export default TaskList;
