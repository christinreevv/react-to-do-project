// controllers/insert.js
import { connection } from '../backend.js';
export function insert(req, res) {
  const { text, status } = req.body;
  
  // Логируем данные запроса
  console.log('Received data:', req.body);

  const taskStatus = (typeof status === 'tinyint') ? (status ? 1 : 0) : 0;

  const query = 'INSERT INTO tasks (text, status) VALUES (?, ?)';
  
  connection.query(query, [text, taskStatus], function (err, results) {
    if (err) {
      console.error("Ошибка вставки задачи:", err);
      return res.status(500).json({ error: 'Ошибка добавления задачи', details: err.message });
    }

    const newTask = { id: results.insertId, text: text, status: taskStatus };
    res.status(201).json(newTask); 
  });
}

