export const MAX_TASKS = 10;

export function addTask(state, { title, notes }) {
  /*
   * Assignment (CRUD - Create):
   * Implement adding a task with title and notes, enforcing MAX_TASKS and required title.
   * Return the updated state with the new task appended.
   */
  return state;
}

export function editTask(state, taskId, updates) {
  /*
   * Assignment (CRUD - Update):
   * Find the task by id, update its fields, and return new state with the edited task.
   * Throw if the task is not found.
   */
  return state;
}

export function removeTask(state, taskId) {
  /*
   * Assignment (CRUD - Delete):
   * Remove the task matching taskId and return the new state.
   */
  return state;
}
