import express from 'express'; // позволяет создавать серверы и маршруты для обработки запросов
import { select } from './controllers/select.js';
import { insert } from './controllers/insert.js';
import { deleteTask } from './controllers/delete.js';
import { updateTask } from './controllers/update.js';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express(); /* создается экземпляр приложения Express, 
на котором можно определять маршруты и запускать сервер */
const port = 3005; 

app.use(express.json());
/* добавляет middleware для обработки тела запросов, 
middleware автоматически парсит тело HTTP-запроса 
(например, при POST или PUT) и преобразует его из формата JSON 
в объект JavaScript, полученные данные становятся доступными в req.body */
app.use(bodyParser.urlencoded({ extended: false }));
/* используется для обработки данных, переданных из HTML-форм 
(или запросов с заголовком application/x-www-form-urlencoded)
это middleware от библиотеки body-parser, 
которая преобразует данные тела запроса в объект JavaScript, 
доступный через req.body */
app.use(bodyParser.json());
app.use(cors());

// Роуты
app.get('/select', select);
app.post('/insert', insert);
app.delete('/delete/:taskId', deleteTask);
app.put('/update/:taskId', updateTask);

app.listen(port, () => {
    console.log(`Lol ${port}`);
})
