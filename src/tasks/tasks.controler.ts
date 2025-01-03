import { Request, Response } from 'express';

import { AppDataSource } from '../../index';
import { Task } from './tasks.entity';
import {
  instanceToPlain,
  plainToInstance,
} from 'class-transformer';
import { validationResult } from 'express-validator';
import { UpdateResult } from 'typeorm';

class TasksController {
  //method for get route
  public async getAll(
    _req: Request,
    res: Response,
  ): Promise<void> {
    // Declare a variable to hold all the tasks
    let allTasks: Task[];

    // Fetch all tasks using the repository
    try {
      allTasks = await AppDataSource.getRepository(
        Task,
      ).find({
        order: { date: 'ASC' },
      });

      // Converts the tasks into an array of objects
      allTasks = instanceToPlain(allTasks) as Task[];

      res.status(200).json(allTasks);
    } catch (_errors) {
      res
        .status(500)
        .json({ error: 'Internal server error' });
    }
  }

  public async create(
    req: Request,
    res: Response,
  ): Promise<void> {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    // Create a new instance of a Task
    const newTask = new Task();

    // Add the required properties to the Task object
    newTask.title = req.body.title;
    newTask.date = req.body.date;
    newTask.description = req.body.description;
    newTask.priority = req.body.priority;
    newTask.status = req.body.status;

    // Add new task to the database
    let createdTask: Task;

    try {
      createdTask = await AppDataSource.getRepository(
        Task,
      ).save(newTask);

      // Convert the task instanceto an object
      createdTask = instanceToPlain(createdTask) as Task;

      res.status(201).json(createdTask);
    } catch (error) {
      res
        .status(500)
        .json({ error: 'Internal server error' });
    }
  }
  //method for update Task
  public async update(
    req: Request,
    res: Response,
  ): Promise<void> {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    try {
      // Verificăm dacă task-ul există
      const task = await AppDataSource.getRepository(
        Task,
      ).findOne({
        where: { id: req.body.id },
      });

      if (!task) {
        res.status(404).json({
          error:
            'The task with the given ID does not exist',
        });
        return;
      }

      // Actualizăm task-ul
      const updatedResult =
        await AppDataSource.getRepository(Task).update(
          { id: req.body.id }, // Criterii de identificare
          { status: req.body.status }, // Valorile de actualizat
        );

      // Verificăm dacă actualizarea a modificat ceva
      if (updatedResult.affected === 0) {
        res.status(400).json({
          error: 'No changes were made to the task',
        });
        return;
      }

      // Obținem task-ul actualizat pentru a-l returna
      const updatedTask = await AppDataSource.getRepository(
        Task,
      ).findOne({
        where: { id: req.body.id },
      });

      res.status(200).json(updatedTask);
    } catch (error) {
      console.error('Error updating task:', error);
      res
        .status(500)
        .json({ error: 'Internal Server Error' });
    }
  }
}

export const tasksController = new TasksController();
