// ToDo
import React, { useState, useEffect } from "react";
import NewTask from "./NewTask";
import '../scss/style.css';

const ToDo = () => {
  const [tasks, setTasks] = useState([]);
  const [inputStatus, setInputStatus] = useState("");
  const [inputCompleted, setInputCompleted] = useState(false);

  // Загружаем задачи из localStorage или с сервера
  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks)); // Если задачи есть в localStorage, загружаем их
    } else {
      // Если нет, загружаем их с сервера
      fetch('http://localhost:3005/select') // Запрос к серверу
        .then(response => response.json())
        .then(data => {
          console.log("Tasks fetched from server:", data);
          setTasks(data); // Сохраняем данные в state
          localStorage.setItem("tasks", JSON.stringify(data)); // Сохраняем в localStorage
        })
        .catch(error => console.error("Error fetching tasks:", error));
    }
  }, []); // Монтируем запрос только один раз

  // Сохраняем задачи в localStorage при их изменении
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }, [tasks]);

  const addTask = async () => {
    if (inputStatus.trim()) { // Проверка на пустую строку
      const newTask = {
        text: inputStatus.trim(),   // Убираем лишние пробелы
        completed: inputCompleted, // Значение чекбокса
      };
  
      try {
        const response = await fetch('http://localhost:3005/insert', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newTask), // Преобразуем объект в JSON
        });
  
        if (response.ok) {
          const data = await response.json();
          setTasks([...tasks, data]); // Добавляем новую задачу в список
          setInputStatus('');         // Очищаем поле ввода
          setInputCompleted(false);   // Сбрасываем статус выполненности
        } else {
          const errorData = await response.json();
          console.error('Ошибка сервера:', errorData.error);
          alert(`Ошибка: ${errorData.error}`);
        }
      } catch (error) {
        console.error('Ошибка сервера:', error.message);
        alert('Произошла ошибка при добавлении задачи.');
      }
    } else {
      alert('Введите текст задачи!');
    }
  };
  
  
  
  return (
    <div className="main">
      <h1 className="title">Что планируешь сделать сегодня?</h1>

      {/* Поле для ввода текста задачи */}
      <input
        type="text" className="inputText"
        value={inputStatus}
        onChange={(e) => setInputStatus(e.target.value)}
        placeholder="Введите название задачи"
      />

      {/* Чекбокс для задания статуса выполнения задачи */}
    

      {/* Кнопка для добавления новой задачи */}
      <button className="addButton" onClick={addTask}>
        Добавить
      </button>

      {/* Компонент для отображения списка задач */}
      <NewTask tasks={tasks} setTasks={setTasks} />
    </div>
  );
};

export default ToDo;
