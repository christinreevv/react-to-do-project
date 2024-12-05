import React, { useState } from 'react';
import '../scss/style.css';

const NewTask = ({ tasks = [], setTasks }) => {
  const [editTaskId, setEditTaskId] = useState(null);
  const [editText, setEditText] = useState('');

  // Удаление задачи
  const deleteTask = async (taskId) => {
    try {
      const response = await fetch(`http://localhost:3005/delete/${taskId}`, { method: 'DELETE' });
      if (response.ok) {
        const updatedTasks = tasks.filter(task => task.id !== taskId);
        setTasks(updatedTasks);
        localStorage.setItem("tasks", JSON.stringify(updatedTasks)); // Синхронизация с localStorage
      } else {
        throw new Error(`Failed to delete task. Status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Переключение выполнения задачи
  const toggleTaskCompletion = async (taskId) => {
    const task = tasks.find(task => task.id === taskId);
    if (!task) return;

    const updatedTask = { ...task, completed: !task.completed };
    const updatedTasks = tasks.map(t =>
      t.id === taskId ? updatedTask : t
    );

    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));

    try {
      const response = await fetch(`http://localhost:3005/update/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: updatedTask.status }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update task. Status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error toggling task completion:", error);
    }
  };

  // Начало редактирования
  const startEditing = (task) => {
    setEditTaskId(task.id);
    setEditText(task.text);
  };

  // Завершение редактирования
  const finishEditing = async () => {
    if (!editText.trim()) return; // Не позволяем пустое имя задачи
    const updatedTasks = tasks.map(task =>
      task.id === editTaskId ? { ...task, text: editText.trim() } : task
    );

    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));

    // Обновляем на сервере
    try {
      const response = await fetch(`http://localhost:3005/update/${editTaskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: editText.trim() }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update task. Status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }

    setEditTaskId(null); // Выходим из режима редактирования
    setEditText('');
  };

  // Отмена редактирования
  const cancelEditing = () => {
    setEditTaskId(null);
    setEditText('');
  };

  return (
    <ul className='addTask'>
      {tasks.map(task => (
        <li key={task.id} style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
          <input
            className='inputCheck'
            type="checkbox"
            checked={task.completed}
            onChange={() => toggleTaskCompletion(task.id)}
            style={{
              marginRight: "10px",
              cursor: "pointer"
            }}
          />
          {editTaskId === task.id ? (
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onBlur={finishEditing}
              onKeyDown={(e) => {
                if (e.key === 'Enter') finishEditing();
                if (e.key === 'Escape') cancelEditing();
              }}
              autoFocus
              style={{
                flex: 1,
                padding: "5px",
                fontSize: "16px",
                borderRadius: "5px",
                border: "1px solid #ccc"
              }}
            />
          ) : (
            <span
              className='addedTask'
              onDoubleClick={() => startEditing(task)}
              style={{
                marginLeft: "8px",
                textDecoration: task.completed ? "line-through" : "none",
                color: task.completed ? "gray" : "black",
                opacity: task.completed ? 0.6 : 1,
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
              {task.text}
            </span>
          )}
          <button
            onClick={() => deleteTask(task.id)}
            style={{
              marginLeft: "auto",
              cursor: "pointer",
              backgroundColor: "#f44336",
              color: "white",
              border: "none",
              padding: "5px 10px",
              borderRadius: "5px",
              transition: "background-color 0.3s ease"
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = "#d32f2f"}
            onMouseOut={(e) => e.target.style.backgroundColor = "#f44336"}
          >
            Удалить
          </button>
        </li>
      ))}
    </ul>
  );
};

export default NewTask;
