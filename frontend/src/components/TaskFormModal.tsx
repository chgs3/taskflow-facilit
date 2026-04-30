import { useEffect, useState, type FormEvent } from 'react';

import type { CreateTaskPayload, Task, TaskStatus } from '../types/task';
import {
  fromDateTimeLocalValue,
  toDateTimeLocalValue
} from '../utils/date';
import { taskStatusOptions } from '../utils/status';

type TaskFormModalProps = {
  isOpen: boolean;
  taskToEdit: Task | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateTaskPayload) => Promise<void>;
};

type FormState = {
  title: string;
  description: string;
  status: TaskStatus;
  assignee: string;
  dueDate: string;
};

const initialFormState: FormState = {
  title: '',
  description: '',
  status: 'A_FAZER',
  assignee: '',
  dueDate: ''
};

export function TaskFormModal({
  isOpen,
  taskToEdit,
  isSubmitting,
  onClose,
  onSubmit
}: TaskFormModalProps) {
  const [form, setForm] = useState<FormState>(initialFormState);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (taskToEdit) {
      setForm({
        title: taskToEdit.title,
        description: taskToEdit.description ?? '',
        status: taskToEdit.status,
        assignee: taskToEdit.assignee ?? '',
        dueDate: toDateTimeLocalValue(taskToEdit.dueDate)
      });
    } else {
      setForm(initialFormState);
    }

    setFormError('');
  }, [isOpen, taskToEdit]);

  if (!isOpen) {
    return null;
  }

  function updateField<K extends keyof FormState>(
    field: K,
    value: FormState[K]
  ) {
    setForm(currentForm => ({
      ...currentForm,
      [field]: value
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.title.trim()) {
      setFormError('Informe um título para a tarefa.');
      return;
    }

    const payload: CreateTaskPayload = {
      title: form.title.trim(),
      description: form.description.trim() || null,
      status: form.status,
      assignee: form.assignee.trim() || null,
      dueDate: fromDateTimeLocalValue(form.dueDate)
    };

    setFormError('');
    await onSubmit(payload);
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <div className="modal" role="dialog" aria-modal="true">
        <div className="modal-header">
          <div>
            <span className="eyebrow">
              {taskToEdit ? 'Editar tarefa' : 'Nova tarefa'}
            </span>
            <h2>{taskToEdit ? 'Atualizar tarefa' : 'Criar tarefa'}</h2>
          </div>

          <button
            className="icon-button"
            type="button"
            onClick={onClose}
            aria-label="Fechar modal"
          >
            ×
          </button>
        </div>

        <form className="task-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Título *</label>
            <input
              id="title"
              type="text"
              maxLength={120}
              placeholder="Ex: Revisar documentação da API"
              value={form.title}
              onChange={event => updateField('title', event.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Descrição</label>
            <textarea
              id="description"
              maxLength={1000}
              placeholder="Descreva os detalhes da tarefa..."
              value={form.description}
              onChange={event =>
                updateField('description', event.target.value)
              }
            />
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                value={form.status}
                onChange={event =>
                  updateField('status', event.target.value as TaskStatus)
                }
              >
                {taskStatusOptions.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="assignee">Responsável</label>
              <input
                id="assignee"
                type="text"
                maxLength={120}
                placeholder="Ex: Caique"
                value={form.assignee}
                onChange={event =>
                  updateField('assignee', event.target.value)
                }
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="dueDate">Data limite</label>
            <input
              id="dueDate"
              type="datetime-local"
              value={form.dueDate}
              onChange={event => updateField('dueDate', event.target.value)}
            />
          </div>

          {formError && <p className="form-error">{formError}</p>}

          <div className="modal-actions">
            <button type="button" onClick={onClose}>
              Cancelar
            </button>

            <button
              className="primary-button"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Salvando...' : 'Salvar tarefa'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}