import { prisma } from '../config/prisma';

export async function clearDatabase() {
  await prisma.task.deleteMany();
}