import type { TaskFilters as TaskFiltersType, TaskStatus } from '../types/task';
import { taskStatusOptions } from '../utils/status';

type TaskFiltersProps = {
  filters: TaskFiltersType;
  onChange: (filters: TaskFiltersType) => void;
  onCreateTask: () => void;
};

export function TaskFilters({
  filters,
  onChange,
  onCreateTask
}: TaskFiltersProps) {
  function handleSearchChange(value: string) {
    onChange({
      ...filters,
      search: value
    });
  }

  function handleStatusChange(value: string) {
    onChange({
      ...filters,
      status: value as TaskStatus | ''
    });
  }

  return (
    <section className="filters-card">
      <div className="filters-group">
        <label htmlFor="search">Buscar</label>
        <input
          id="search"
          type="text"
          placeholder="Busque por título ou descrição..."
          value={filters.search ?? ''}
          onChange={event => handleSearchChange(event.target.value)}
        />
      </div>

      <div className="filters-group">
        <label htmlFor="status">Status</label>
        <select
          id="status"
          value={filters.status ?? ''}
          onChange={event => handleStatusChange(event.target.value)}
        >
          <option value="">Todos</option>
          {taskStatusOptions.map(status => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
      </div>

      <button className="primary-button" type="button" onClick={onCreateTask}>
        Nova tarefa
      </button>
    </section>
  );
}