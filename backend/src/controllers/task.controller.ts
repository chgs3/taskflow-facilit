import { Request, Response } from 'express';

import { TaskService } from '../services/task.service';
import {
  createTaskSchema,
  listTasksQuerySchema,
  updateTaskSchema,
  updateTaskStatusSchema
} from '../schemas/task.schemas';

export class TaskController {
  constructor(private readonly taskService = new TaskService()) {}

  list = async (request: Request, response: Response) => {
    const query = listTasksQuerySchema.parse(request.query);

    const tasks = await this.taskService.list(query);

    return response.status(200).json(tasks);
  };

  findById = async (request: Request, response: Response) => {
    const { id } = request.params;

    const task = await this.taskService.findById(id);

    return response.status(200).json(task);
  };

  create = async (request: Request, response: Response) => {
    const body = createTaskSchema.parse(request.body);

    const task = await this.taskService.create(body);

    return response.status(201).json(task);
  };

  update = async (request: Request, response: Response) => {
    const { id } = request.params;
    const body = updateTaskSchema.parse(request.body);

    const task = await this.taskService.update(id, body);

    return response.status(200).json(task);
  };

  updateStatus = async (request: Request, response: Response) => {
    const { id } = request.params;
    const body = updateTaskStatusSchema.parse(request.body);

    const task = await this.taskService.updateStatus(id, body);

    return response.status(200).json(task);
  };

  delete = async (request: Request, response: Response) => {
    const { id } = request.params;

    await this.taskService.delete(id);

    return response.status(204).send();
  };
}