import { Prisma, Task, TaskStatus } from '@prisma/client';

import { prisma } from '../config/prisma';
import { TaskListFilters } from '../types/task';

export class TaskRepository {
  async findMany(filters: TaskListFilters): Promise<Task[]> {
    const where: Prisma.TaskWhereInput = {};

    if (filters.status && filters.status !== TaskStatus.ATRASADO) {
      where.status = filters.status;
    }

    if (filters.search) {
      where.OR = [
        {
          title: {
            contains: filters.search
          }
        },
        {
          description: {
            contains: filters.search
          }
        }
      ];
    }

    return prisma.task.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async findById(id: string): Promise<Task | null> {
    return prisma.task.findUnique({
      where: {
        id
      }
    });
  }

  async create(data: Prisma.TaskCreateInput): Promise<Task> {
    return prisma.task.create({
      data
    });
  }

  async update(id: string, data: Prisma.TaskUpdateInput): Promise<Task> {
    return prisma.task.update({
      where: {
        id
      },
      data
    });
  }

  async delete(id: string): Promise<Task> {
    return prisma.task.delete({
      where: {
        id
      }
    });
  }
}