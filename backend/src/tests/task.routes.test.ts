import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';

import { TaskStatus } from '@prisma/client';

import { app } from '../app';
import { clearDatabase } from './setup';

describe('Task routes', () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  it('deve criar uma tarefa com sucesso', async () => {
    const response = await request(app)
      .post('/api/tasks')
      .send({
        title: 'Implementar API de tarefas',
        description: 'Criar endpoints REST para gerenciamento de tarefas.',
        status: 'A_FAZER',
        assignee: 'Caique',
        dueDate: '2026-05-10T23:59:59.000Z'
      });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      title: 'Implementar API de tarefas',
      description: 'Criar endpoints REST para gerenciamento de tarefas.',
      status: TaskStatus.A_FAZER,
      assignee: 'Caique',
      computedStatus: TaskStatus.A_FAZER,
      statusLabel: 'A Fazer'
    });

    expect(response.body.id).toBeDefined();
    expect(response.body.createdAt).toBeDefined();
  });

  it('não deve criar uma tarefa sem título', async () => {
    const response = await request(app)
      .post('/api/tasks')
      .send({
        description: 'Tarefa inválida sem título.',
        status: 'A_FAZER'
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Erro de validação.');
    expect(response.body.details.fieldErrors.title).toContain(
      'O título é obrigatório.'
    );
  });

  it('deve listar tarefas cadastradas', async () => {
    await request(app).post('/api/tasks').send({
      title: 'Primeira tarefa',
      status: 'A_FAZER'
    });

    await request(app).post('/api/tasks').send({
      title: 'Segunda tarefa',
      status: 'EM_PROGRESSO'
    });

    const response = await request(app).get('/api/tasks');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
  });

  it('deve buscar tarefas por título', async () => {
    await request(app).post('/api/tasks').send({
      title: 'Criar documentação Swagger',
      description: 'Documentar endpoints da API.',
      status: 'A_FAZER'
    });

    await request(app).post('/api/tasks').send({
      title: 'Criar tela inicial',
      description: 'Tela principal do front-end.',
      status: 'A_FAZER'
    });

    const response = await request(app).get('/api/tasks?search=Swagger');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].title).toBe('Criar documentação Swagger');
  });

  it('deve buscar tarefas por descrição', async () => {
    await request(app).post('/api/tasks').send({
      title: 'Tarefa A',
      description: 'Implementar filtro por status.',
      status: 'A_FAZER'
    });

    await request(app).post('/api/tasks').send({
      title: 'Tarefa B',
      description: 'Criar cabeçalho da interface.',
      status: 'A_FAZER'
    });

    const response = await request(app).get('/api/tasks?search=filtro');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].description).toBe('Implementar filtro por status.');
  });

  it('deve filtrar tarefas por status', async () => {
    await request(app).post('/api/tasks').send({
      title: 'Tarefa pendente',
      status: 'A_FAZER'
    });

    await request(app).post('/api/tasks').send({
      title: 'Tarefa em progresso',
      status: 'EM_PROGRESSO'
    });

    const response = await request(app).get('/api/tasks?status=EM_PROGRESSO');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].status).toBe(TaskStatus.EM_PROGRESSO);
  });

  it('deve editar uma tarefa existente', async () => {
    const createResponse = await request(app).post('/api/tasks').send({
      title: 'Título original',
      description: 'Descrição original.',
      status: 'A_FAZER'
    });

    const taskId = createResponse.body.id;

    const updateResponse = await request(app)
      .put(`/api/tasks/${taskId}`)
      .send({
        title: 'Título atualizado',
        description: 'Descrição atualizada.',
        status: 'EM_PROGRESSO',
        assignee: 'Equipe Interna'
      });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body).toMatchObject({
      id: taskId,
      title: 'Título atualizado',
      description: 'Descrição atualizada.',
      status: TaskStatus.EM_PROGRESSO,
      assignee: 'Equipe Interna'
    });
  });

  it('deve alterar apenas o status de uma tarefa', async () => {
    const createResponse = await request(app).post('/api/tasks').send({
      title: 'Alterar status',
      status: 'A_FAZER'
    });

    const taskId = createResponse.body.id;

    const statusResponse = await request(app)
      .patch(`/api/tasks/${taskId}/status`)
      .send({
        status: 'CONCLUIDO'
      });

    expect(statusResponse.status).toBe(200);
    expect(statusResponse.body.status).toBe(TaskStatus.CONCLUIDO);
    expect(statusResponse.body.computedStatus).toBe(TaskStatus.CONCLUIDO);
    expect(statusResponse.body.statusLabel).toBe('Concluído');
  });

  it('deve retornar computedStatus ATRASADO quando a data limite estiver no passado', async () => {
    const response = await request(app).post('/api/tasks').send({
      title: 'Tarefa vencida',
      description: 'Essa tarefa deve aparecer como atrasada.',
      status: 'A_FAZER',
      dueDate: '2024-01-01T23:59:59.000Z'
    });

    expect(response.status).toBe(201);
    expect(response.body.status).toBe(TaskStatus.A_FAZER);
    expect(response.body.computedStatus).toBe(TaskStatus.ATRASADO);
    expect(response.body.statusLabel).toBe('Atrasado');
  });

  it('deve manter tarefa concluída como CONCLUIDO mesmo com data limite no passado', async () => {
    const response = await request(app).post('/api/tasks').send({
      title: 'Tarefa concluída vencida',
      description: 'Mesmo vencida, deve continuar concluída.',
      status: 'CONCLUIDO',
      dueDate: '2024-01-01T23:59:59.000Z'
    });

    expect(response.status).toBe(201);
    expect(response.body.status).toBe(TaskStatus.CONCLUIDO);
    expect(response.body.computedStatus).toBe(TaskStatus.CONCLUIDO);
    expect(response.body.statusLabel).toBe('Concluído');
  });

  it('deve retornar 404 ao buscar uma tarefa inexistente', async () => {
    const response = await request(app).get('/api/tasks/id-inexistente');

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Tarefa não encontrada.');
  });

  it('não deve permitir criar tarefa manualmente com status ATRASADO', async () => {
  const response = await request(app)
    .post('/api/tasks')
    .send({
      title: 'Tarefa ainda não vencida',
      status: 'ATRASADO',
      dueDate: '2026-12-31T23:59:59.000Z'
    });

  expect(response.status).toBe(400);
  expect(response.body.message).toBe('Erro de validação.');
  expect(response.body.details.fieldErrors.status).toContain(
    'O status Atrasado é calculado automaticamente com base na data limite.'
  );
});

it('não deve permitir alterar manualmente o status para ATRASADO', async () => {
  const createResponse = await request(app).post('/api/tasks').send({
    title: 'Tarefa com prazo futuro',
    status: 'A_FAZER',
    dueDate: '2026-12-31T23:59:59.000Z'
  });

  const taskId = createResponse.body.id;

  const response = await request(app)
    .patch(`/api/tasks/${taskId}/status`)
    .send({
      status: 'ATRASADO'
    });

  expect(response.status).toBe(400);
  expect(response.body.message).toBe('Erro de validação.');
  expect(response.body.details.fieldErrors.status).toContain(
    'O status Atrasado é calculado automaticamente com base na data limite.'
  );
});
});