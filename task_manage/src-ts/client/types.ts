export type TaskStatus = 'none' | 'working' | 'completed';

export interface Task {
  id: string;
  title: string;
  content: string;
  status: TaskStatus;
  start_date: string;
  end_date: string;
  createdAt: number;
}
