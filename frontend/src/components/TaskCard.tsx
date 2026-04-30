import type { Task, TaskStatus } from '../types/task';
import { formatDate } from '../utils/date';
import { getStatusClass, taskStatusOptions } from '../utils/status';

type TaskCardProps = {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onStatusChange: (task: Task, status: TaskStatus) => void;
};

export function TaskCard({
  task,
  onEdit,
  onDelete,
  onStatusChange
}: TaskCardProps) {
  const isLate = task.computedStatus === 'ATRASADO';

  return (
    <article className={`task-card ${isLate ? 'task-card-late' : ''}`}>
      <div className="task-card-header">
        <div>
          <h2>{task.title}</h2>
          <span className={getStatusClass(task.computedStatus)}>
            {task.statusLabel}
          </span>
        </div>

        <div className="task-actions">
          <button type="button" onClick={() => onEdit(task)}>
            Editar
          </button>

          <button
            className="danger-button"
            type="button"
            onClick={() => onDelete(task)}
          >
            Excluir
          </button>
        </div>
      </div>

      {task.description ? (
        <p className="task-description">{task.description}</p>
      ) : (
        <p className="task-description muted">Sem descrição.</p>
      )}

      <div className="task-meta">
        <span>
          <strong>Responsável:</strong> {task.assignee || 'Não informado'}
        </span>

        <span>
          <strong>Criada em:</strong> {formatDate(task.createdAt)}
        </span>

        <span>
          <strong>Data limite:</strong> {formatDate(task.dueDate)}
        </span>
      </div>

      <div className="status-update">
        <label htmlFor={`status-${task.id}`}>Alterar status</label>
        <select
          id={`status-${task.id}`}
          value={task.status}
          onChange={event =>
            onStatusChange(task, event.target.value as TaskStatus)
          }
        >
          {taskStatusOptions.map(status => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
      </div>
    </article>
  );
}