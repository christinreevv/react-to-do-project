import mysql from 'mysql2';

export const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    database: 'todo_app',
    password: '1234'
});

connection.connect(function(err) {
    if(err) {
        return console.error('Ошибка: ' + err.message);
    }
    else {
        console.log('Подключение к серверу MySQL успешно установлено');
    }
})


