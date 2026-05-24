export interface Task {
  id: number;
  createdAt?: string | null;
  updatedAt?: string | null;
  projectId?: number;
  title: string;
  content?: string;
  start_date: string;
  end_date: string;
  userId?: number;
  status?: string;
}
