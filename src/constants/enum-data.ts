export const enumData = {
  taskStatus: {
    PENDING: {
      code: 'PENDING',
      name: 'Pending',
      color: 'rgba(66, 133, 244, 1)',
      background: 'rgba(66, 133, 244, 0.2)',
    },
    IN_PROGRESS: {
      code: 'IN_PROGRESS',
      name: 'In Progress',
      color: 'rgba(255, 193, 7, 01)',
      background: 'rgba(255, 193, 7, 0.2)',
    },
    COMPLETED: {
      code: 'COMPLETED',
      name: 'Completed',
      color: 'rgba(33, 224, 97, 1)',
      background: 'rgba(33, 224, 97, 0.2)',
    },
    TO_ASSIGN: {
      code: 'TO_ASSIGN',
      name: 'ToAssign',
      color: 'rgba(186, 104, 200,1)',
      background: 'rgba(186, 104, 200, 0.2)',
    },
    CANCELED: {
      code: 'CANCELED',
      name: 'Canceled',
      color: 'rgba(255, 61, 61, 01)',
      background: 'rgba(255, 61, 61, 0.2)',
    },
    BLOCKED: {
      code: 'BLOCKED',
      name: 'Blocked',
      color: 'rgba(128, 128, 128, 1)',
      background: 'rgba(128, 128, 128, 0.2)',
    },
    NEEDS_REVIEW: {
      code: 'NEEDS_REVIEW',
      name: 'Needs Review',
      color: 'rgba(244, 180, 0, 01)',
      background: 'rgba(244, 180, 0, 0.2)',
    },
    WAITING: {
      code: 'WAITING',
      name: 'Waiting',
      color: 'rgba(238, 130, 238, 01)',
      background: 'rgba(238, 130, 238, 0.2)',
    },
  },
  taskType: {
    BUG: {
      name: 'Bug',
      code: 'BUG',
      color: 'rgba(255, 61, 61, 01)',
      background: 'rgba(255, 61, 61, 0.2)',
    },
    IMPROVEMENT: {
      name: 'Improvement',
      code: 'IMPROVEMENT',
      color: 'rgba(33, 224, 97, 1)',
      background: 'rgba(33, 224, 97, 0.2)',
    },
    TASK: {
      name: 'Task',
      code: 'TASK',
      color: 'rgba(12, 133, 9, 1)',
      background: 'rgba(12, 133, 9, 0.2)',
    },
    WORK: {
      name: 'Work',
      code: 'WORK',
      color: 'rgba(255, 193, 7, 01)',
      background: 'rgba(255, 193, 7, 0.2)',
    },
    LEARNING: {
      name: 'Learning',
      code: 'LEARNING',
      color: 'rgba(66, 133, 244, 1)',
      background: 'rgba(66, 133, 244, 0.2)',
    },
    CONFIG: {
      name: 'Config',
      code: 'CONFIG',
      color: 'rgba(186, 104, 200,1)',
      background: 'rgba(186, 104, 200, 0.2)',
    },
  },
  taskPriority: {
    HIGH: {
      name: 'High',
      code: 'HIGH',
      color: 'rgba(255, 61, 61, 01)',
      background: 'rgba(255, 61, 61, 0.2)',
    },
    MEDIUM: {
      name: 'Medium',
      code: 'MEDIUM',
      color: 'rgba(244, 180, 0, 01)',
      background: 'rgba(244, 180, 0, 0.2)',
    },
    LOW: {
      name: 'Low',
      code: 'LOW',
      color: 'rgba(128, 128, 128, 1)',
      background: 'rgba(128, 128, 128, 0.2)',
    },
  },
  NOTIFICATION_TYPE: {
    NEW_TASK: {
      name: 'Create new task!',
      code: 'NEW_TASK',
      color: 'rgba(12, 133, 9, 1)',
      background: 'rgba(12, 133, 9, 0.2)',
    },
    NEW_USER: {
      name: 'Create new user!',
      code: 'NEW_USER',
      color: 'rgba(244, 180, 0, 01)',
      background: 'rgba(244, 180, 0, 0.2)',
    },
    UPDATE_TASK: {
      name: 'Update task!',
      code: 'UPDATE_TASK',
      color: 'rgba(255, 61, 61, 01)',
      background: 'rgba(255, 61, 61, 0.2)',
    },
    NEW_MESSAGE: {
      name: 'New message!',
      code: 'NEW_MESSAGE',
      color: 'rgba(186, 104, 200,1)',
      background: 'rgba(186, 104, 200, 0.2)',
    },
  },
  BOARD_TAG: {
    Dev: {
      name: 'Dev',
      color: 'rgba(33, 224, 97, 1)',
      background: 'rgba(33, 224, 97, 0.2)',
    },
    Backend: {
      name: 'Backend',
      color: 'rgba(255, 193, 7, 01)',
      background: 'rgba(255, 193, 7, 0.2)',
    },
    'Front-end': {
      name: 'Front-end',
      color: 'rgba(66, 133, 244, 1)',
      background: 'rgba(66, 133, 244, 0.2)',
    },
    DevOps: {
      name: 'DevOps',
      color: 'rgba(128, 128, 128, 1)',
      background: 'rgba(128, 128, 128, 0.2)',
    },
    DB: {
      name: 'DB',
      color: 'rgba(255, 61, 61, 01)',
      background: 'rgba(255, 61, 61, 0.2)',
    },
    Design: {
      name: 'Design',
      color: 'rgba(186, 104, 200,1)',
      background: 'rgba(186, 104, 200, 0.2)',
    },
  },
};
export enum EHistoryType {
  CREATE_GROUP_CHAT = 'CREATE_GROUP_CHAT',
  CREATE_CHAT = 'CREATE_CHAT',
}

export enum EChatType {
  GROUP = 'group',
  SINGLE = 'single',
}

export const HISTORY_TYPE = {
  USER_ACTION: {
    code: 'USER_ACTION',
    name: 'User action',
    color: 'rgba(12, 133, 9, 1)',
    background: 'rgba(12, 133, 9, 0.2)',
  },
  TEAM_INVITE: {
    code: 'TEAM_INVITE',
    name: 'Team invite',
    color: 'rgba(66, 133, 244, 1)',
    background: 'rgba(66, 133, 244, 0.2)',
  },
  ACCEPT_TO_TEAM: {
    code: 'ACCEPT_TO_TEAM',
    name: 'Accept to team',
    color: 'rgba(255, 193, 7, 01)',
    background: 'rgba(255, 193, 7, 0.2)',
  },
  REJECT_TO_TEAM: {
    code: 'REJECT_TO_TEAM',
    name: 'Reject to team',
    color: 'rgba(255, 61, 61, 01)',
    background: 'rgba(255, 61, 61, 0.2)',
  },
};

export const NOTIFICATION_TYPE = {
  ASSIGN_TASK: {
    name: 'Assign task',
    code: 'ASSIGN_TASK',
    color: 'rgba(12, 133, 9, 1)',
    background: 'rgba(12, 133, 9, 0.2)',
  },
  CREATE_TASK: {
    name: 'Create task',
    code: 'CREATE_TASK',
    color: 'rgba(66, 133, 244, 1)',
    background: 'rgba(66, 133, 244, 0.2)',
  },
  INVITE_TEAM: {
    name: 'Invite team',
    code: 'INVITE_TEAM',
    color: 'rgba(255, 193, 7, 01)',
    background: 'rgba(255, 193, 7, 0.2)',
  },
  REJECT_INVITE_TEAM: {
    name: 'Reject team',
    code: 'REJECT_INVITE_TEAM',
    color: 'rgba(255, 61, 61, 01)',
    background: 'rgba(255, 61, 61, 0.2)',
  },
  ACCEPT_INVITE_TEAM: {
    name: 'Accept team',
    code: 'ACCEPT_INVITE_TEAM',
    color: 'rgba(12, 133, 9, 1)',
    background: 'rgba(12, 133, 9, 0.2)',
  },
};
