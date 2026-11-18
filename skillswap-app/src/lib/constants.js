export const SKILL_TYPES = {
  TEACH: 'TEACH',
  LEARN: 'LEARN',
};

export const LEVELS = [
  { value: 'BEGINNER', label: 'Beginner' },
  { value: 'INTERMEDIATE', label: 'Intermediate' },
  { value: 'ADVANCED', label: 'Advanced' },
  { value: 'EXPERT', label: 'Expert' },
];

export const MODES = [
  { value: 'ONLINE', label: 'Online' },
  { value: 'IN_PERSON', label: 'In person' },
  { value: 'BOTH', label: 'Online or in person' },
];

export const CONNECTION = {
  NONE: 'NONE',
  REQUEST_SENT: 'REQUEST_SENT',
  REQUEST_RECEIVED: 'REQUEST_RECEIVED',
  CONNECTED: 'CONNECTED',
};

export const REQUEST_STATUS = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  DECLINED: 'DECLINED',
  CANCELLED: 'CANCELLED',
};
