import { Task, TaskStatus, CreateTaskPayload, UpdateTaskPayload } from "./types";

const API_BASE = process.env.API_BASE || "http://127.0.0.1:8000/api/v1";

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || res.statusText);
  }
  return res.json();
}

// ── API functions ──────────────────────────────────────────────────────────

export async function fetchTasks(): Promise<Task[]> {
  const res = await fetch(`${API_BASE}/tasks`);
  const data = await handleResponse<{ tasks: Task[] }>(res);
  return data.tasks;
}

export async function fetchTask(id: string): Promise<Task> {
  const res = await fetch(`${API_BASE}/tasks/${id}`);
  return handleResponse<Task>(res);
}

export async function createTask(payload: CreateTaskPayload): Promise<Task> {
  const res = await fetch(`${API_BASE}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse<Task>(res);
}

export async function updateTask(payload: UpdateTaskPayload): Promise<Task> {
  const { id, ...updates } = payload;
  const res = await fetch(`${API_BASE}/tasks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  return handleResponse<Task>(res);
}

export async function deleteTask(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/tasks/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`Failed to delete task ${id}`);
}

// ── Status constants ──────────────────────────────────────────────────────
export const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: "To Do",
  "in-progress": "In Progress",
  done: "Done",
};

export const STATUSES: TaskStatus[] = ["todo", "in-progress", "done"];