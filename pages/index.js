import { useEffect, useState } from 'react';

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [taskId, setTaskId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(()=>{
    fetchTasks();
  },[])

  // Fetch tasks from API
  async function fetchTasks() {
    const res = await fetch('/api/tasks');
    if (!res.ok) {
      console.error('Failed to fetch tasks');
      return;
    }
    const data = await res.json();
    setTasks(data);
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const task = { title, description };

    if(isEditing){
      handleUpdate(taskId,task);
    }else{
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      });
  
      if (res.ok) {
        setTitle('');
        setDescription('');
        fetchTasks();  // Refresh task list
      } else {
        console.error('Failed to create task');
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      // Optimistically remove the task from the UI
      setTasks(tasks.filter((task) => task._id !== id));
  
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
      });
  
      if (!res.ok) {
        throw new Error('Failed to delete task');
      }
  
      console.log('Task deleted successfully');
      fetchTasks(); // Reload tasks to sync with the backend
    } catch (error) {
      console.error(error.message);
      // Revert the optimistic UI update on failure
      fetchTasks();
    }
  };
  
  

  const handleEdit = (task) => {
    setTitle(task.title);
    setDescription(task.description);
    setTaskId(task._id);
    setIsEditing(true);
  };


  const handleUpdate = async (id, updatedTask) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTask),
      });
  
      if (!res.ok) {
        throw new Error('Failed to update task');
      }
  
      const data = await res.json();
      console.log('Updated Task:', data.task);
      setTitle('');
      setDescription('');
      setTaskId(null);
      setIsEditing(false);
      fetchTasks(); // Reload tasks after successful update
    } catch (error) {
      setTitle('');
      setDescription('');
      setTaskId(null);
      setIsEditing(false);
      console.error(error.message);
    }
  };
  

  return (<>
    <div className="container">
        <h1 className="title">Task Manager</h1>
        <form className="task-form" onSubmit={handleSubmit}>
          <label>Title</label>
          <input
            type="text"
            placeholder="Enter task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
  
          <label>Description</label>
          <textarea
            placeholder="Enter task description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
  
          <button type="submit" className="submit-btn">
            {isEditing ? "Update Task" : "Add Task"}
          </button>
        </form>
        
      </div>
   
    <div className='con-wrapper'>
    <h2>Tasks List</h2>
    <ul className="task-list">
      {tasks?.length>0?tasks.map((task) => (
        <li key={task._id} className="task-item">
          <h3>{task.title}</h3>
          <p>{task.description}</p>
  
          <div className="task-actions">
            <button
              className="edit-btn"
              onClick={() => handleEdit(task)}
            >
              Edit
            </button>
            <button
              className="delete-btn"
              onClick={() => handleDelete(task._id)}
            >
              Delete
            </button>
          </div>
        </li>
      )):<li className="task-item-not-found">Task not found !</li>}
    </ul>
    </div>
    </>
  );
}
