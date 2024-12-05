import { connection } from '../backend.js';

export function updateTask(req, res) {
  const { taskId } = req.params; // ID задачи из URL
  const { status } = req.body; // Новый статус выполнения задачи

  // Преобразование status в boolean для проверки
  const statusBoolean = status === 1 || status === true;

  if (typeof statusBoolean !== 'boolean') {
    return res.status(400).json({ error: 'Status must be a boolean.' });
  }

  // Преобразование boolean в TINYINT (MySQL)
  const statusValue = statusBoolean ? 1 : 0;

  // SQL-запрос на обновление
  const query = 'UPDATE tasks SET status = ? WHERE id = ?';

  connection.query(query, [statusValue, taskId], function (err, results) {
    if (err) {
      console.error('Ошибка обновления задачи:', err);
      return res.status(500).json({ error: 'Ошибка обновления задачи', details: err.message });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Task not found.' });
    }

    console.log(`Task with ID: ${taskId} updated to status: ${statusValue}`);
    res.status(200).json({
      message: `Task with ID: ${taskId} updated successfully.`,
      id: taskId,
      status: statusBoolean
    });
  });
}
