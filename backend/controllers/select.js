// select.js

// select.js
import { connection } from '../backend.js';

export function select(req, res) {
  connection.query('SELECT * FROM tasks', (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Ошибка получения задач' });
    }
    res.status(200).json(results); // Отправляем задачи в формате JSON
  });
}
