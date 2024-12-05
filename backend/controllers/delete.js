// controllers/delete.js
import { connection } from '../backend.js';

export function deleteTask(req, res) {
  const { taskId } = req.params; // Получаем ID задачи из параметров URL

  if (!taskId) {
    return res.status(400).json({ error: "Task ID is required." });
  }

  // Запрос на удаление задачи по ID
  const query = "DELETE FROM tasks WHERE id = ?";

  connection.query(query, [taskId], function (err, results) {
    if (err) {
      console.error("Error deleting task:", err); // Логируем ошибку
      return res.status(500).json({ error: 'Ошибка удаления задачи', details: err.message });
    }

    // Если задача не найдена или не удалена
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Task not found.' });
    }

    console.log(`Task with ID: ${taskId} deleted.`);
    return res.status(200).json({ message: `Task with ID: ${taskId} deleted successfully.` });
  });
}
