import { Task } from './types';

// Example data merging user context with the visual example in the prompt
export const initialTasks: Task[] = [
  {
    id: 1,
    createdAt: '2026-05-23 09:50:00',
    title: '技術スタック選定',
    start_date: '2026-05-01',
    end_date: '2026-05-03',
    status: 'completed'
  },
  {
    id: 2,
    createdAt: '2026-05-23 09:51:00',
    title: '設計',
    start_date: '2026-05-03',
    end_date: '2026-05-06',
    status: 'completed'
  },
  {
    id: 3,
    createdAt: '2026-05-23 09:51:30',
    title: '製造',
    start_date: '2026-05-06',
    end_date: '2026-05-11',
    status: 'working'
  },
  {
    id: 4,
    createdAt: '2026-05-23 09:51:55',
    title: 'テスト工程-1',
    start_date: '2026-05-12',
    end_date: '2026-05-24',
    status: 'working'
  },
  {
    id: 5,
    createdAt: '2026-05-23 09:52:29',
    title: 'テスト工程-2',
    start_date: '2026-05-19',
    end_date: '2026-05-30',
    status: 'pending'
  },
  {
    id: 12,
    createdAt: '2026-05-23 09:51:55',
    title: 't6',
    start_date: '2026-05-02',
    end_date: '2026-05-09',
    status: 'working'
  },
  {
    id: 13,
    createdAt: '2026-05-23 09:52:29',
    title: 't7',
    start_date: '2026-05-01',
    end_date: '2026-05-09',
    status: 'completed'
  }
];
