import { type Task } from './task.interface';

export interface Column {
  id: string;
  title: string;
  orderNumber: number;
  createdAt: string;
  updatedAt: string;
  tasks?: Task[];
}
