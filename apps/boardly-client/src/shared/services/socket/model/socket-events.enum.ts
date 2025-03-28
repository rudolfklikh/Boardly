export enum SocketEvents {
  BOARDS_JOIN = 'boards:join',
  BOARDS_LEAVE = 'boards:leave',

  COLUMNS_CREATE = 'columns:create',
  COLUMNS_UPDATE = 'columns:update',

  COLUMNS_CREATE_SUCCESS = 'columns:createSuccess',
  COLUMNS_CREATE_FAILURE = 'columns:createFailure',

  COLUMNS_UPDATE_SUCCESS = 'columns:updateSuccess',
  COLUMNS_UPDATE_FAILURE = 'columns:updateFailure',

  TASK_CREATE = 'task:create',
  TASK_CREATE_SUCCESS = 'task:createSuccess',
  TASK_CREATE_FAILURE = 'task:createFailure',

  TASKS_UPDATE = 'tasks:update',
  TASKS_UPDATE_SUCCESS = 'tasks:updateSuccess',
  TASKS_UPDATE_FAILURE = 'tasks:updateFailure'
}
