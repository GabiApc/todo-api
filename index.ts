import express, { Express } from 'express';
import { DataSource } from 'typeorm';

import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import { Task } from './src/tasks/tasks.entity';
import { tasksRouter } from './src/tasks/tasks.router';

//Initiate express app
const app: Express = express();
dotenv.config();

//parse request body
app.use(bodyParser.json());

//use cors
app.use(cors());

//Define database connection

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  entities: [Task],
  synchronize: true,
  logging: true,
  driver: require('mysql2'),
});

//define server port
const port = process.env.PORT;

AppDataSource.initialize()
  .then(() => {
    //start server
    app.listen(port, () => {
      console.log(
        `Server is running at http://localhost:${port}`,
      );
      console.log(
        'Database connection established successfully',
      );
    });
  })
  .catch((error) => {
    console.error(
      'Error connecting to the database',
      error,
    );
  });

app.use('/', tasksRouter);
