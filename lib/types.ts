export type TaskStatus = "todo" | "in-progress" | "done";

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  dueDate?: string; // ISO date string
  dueTime?: string; // "HH:MM"
  assignee?: string;
  caseRef?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskPayload {
  title: string;
  description?: string;
  status: TaskStatus;
  dueDate?: string;
  dueTime?: string;
  assignee?: string;
  caseRef?: string;
}

export interface UpdateTaskPayload extends Partial<CreateTaskPayload> {
  id: string;
}
