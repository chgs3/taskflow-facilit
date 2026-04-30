import { AxiosError } from 'axios';
import { useCallback, useEffect, useState } from 'react';

import { http } from '../api/http';
import { EmptyState } from '../components/EmptyState';
import { TaskCard } from '../components/TaskCard';
import { TaskFilters } from '../components/TaskFilters';
import { TaskFormModal } from '../components/TaskFormModal';
import type {
  CreateTaskPayload,
  Task,
  TaskFilters as TaskFiltersType,
  TaskStatus
} from '../types/task';

type ApiErrorResponse = {
  message?: string;
};

export function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filters, setFilters] = useState<TaskFiltersType>({
    search: '',
    status: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  const loadTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage('');

      const response = await http.get<Task[]>('/tasks', {
        params: {
          search: filters.search || undefined,
          status: filters.status || undefined
        }
      });

      setTasks(response.data);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, [filters.search, filters.status]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  function openCreateModal() {
    setTaskToEdit(null);
    setIsModalOpen(true);
    setFeedbackMessage('');
    setErrorMessage('');
  }

  function openEditModal(task: Task) {
    setTaskToEdit(task);
    setIsModalOpen(true);
    setFeedbackMessage('');
    setErrorMessage('');
  }

  function closeModal() {
    setIsModalOpen(false);
    setTaskToEdit(null);
  }

  async function handleSubmitTask(payload: CreateTaskPayload) {
    try {
      setIsSubmitting(true);
      setErrorMessage('');

      if (taskToEdit) {
        await http.put(`/tasks/${taskToEdit.id}`, payload);
        setFeedbackMessage('Tarefa atualizada com sucesso.');
      } else {
        await http.post('/tasks', payload);
        setFeedbackMessage('Tarefa criada com sucesso.');
      }

      closeModal();
      await loadTasks();
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleStatusChange(task: Task, status: TaskStatus) {
    try {
      setErrorMessage('');
      setFeedbackMessage('');

      await http.patch(`/tasks/${task.id}/status`, {
        status
      });

      setFeedbackMessage('Status atualizado com sucesso.');
      await loadTasks();
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    }
  }

  async function handleDeleteTask(task: Task) {
    const confirmed = window.confirm(
      `Deseja realmente excluir a tarefa "${task.title}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setErrorMessage('');
      setFeedbackMessage('');

      await http.delete(`/tasks/${task.id}`);

      setFeedbackMessage('Tarefa excluída com sucesso.');
      await loadTasks();
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    }
  }

  const hasTasks = tasks.length > 0;

  return (
    <main className="page-shell">
      <section className="hero">
        <div>
          <span className="eyebrow">TaskFlow</span>
          <h1>Gerenciamento de Tarefas</h1>
          <p>
            Crie, acompanhe e atualize tarefas do seu time.
          </p>
        </div>

        <div className="hero-summary">
          <strong>{tasks.length}</strong>
          <span>{tasks.length === 1 ? 'tarefa encontrada' : 'tarefas encontradas'}</span>
        </div>
      </section>

      <TaskFilters
        filters={filters}
        onChange={setFilters}
        onCreateTask={openCreateModal}
      />

      {feedbackMessage && (
        <div className="alert success">{feedbackMessage}</div>
      )}

      {errorMessage && <div className="alert error">{errorMessage}</div>}

      {isLoading ? (
        <div className="loading-card">Carregando tarefas...</div>
      ) : hasTasks ? (
        <section className="task-list">
          {tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={openEditModal}
              onDelete={handleDeleteTask}
              onStatusChange={handleStatusChange}
            />
          ))}
        </section>
      ) : (
        <EmptyState
          title="Nenhuma tarefa encontrada"
          description="Crie uma nova tarefa ou ajuste os filtros para visualizar outros resultados."
        />
      )}

      <TaskFormModal
        isOpen={isModalOpen}
        taskToEdit={taskToEdit}
        isSubmitting={isSubmitting}
        onClose={closeModal}
        onSubmit={handleSubmitTask}
      />
    </main>
  );
}

function getErrorMessage(error: unknown) {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiErrorResponse | undefined;

    return data?.message ?? 'Não foi possível completar a ação.';
  }

  return 'Não foi possível completar a ação.';
}