"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Task, TaskStatus, CreateTaskPayload } from "@/lib/types";
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
  STATUS_LABELS,
} from "@/lib/api";
import { KanbanBoard } from "@/components/kanban-board";
import { BoardHeader } from "@/components/board-header";
import { TaskFormModal } from "@/components/task-form-modal";
import { TaskDetailModal } from "@/components/task-detail-modal";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

export default function TaskBoardPage() {
  const { toast } = useToast();

  // ── State ───────────────────────────────────────────────────────────────
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<TaskStatus | "all">("all");

  const [formOpen, setFormOpen] = useState(false);
  const [formDefaultStatus, setFormDefaultStatus] = useState<TaskStatus>("todo");
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [detailTask, setDetailTask] = useState<Task | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  // ── Load tasks on mount ─────────────────────────────────────────────────
  useEffect(() => {
    fetchTasks()
      .then(setTasks)
      .catch(() =>
        toast({ title: "Failed to load tasks", variant: "destructive" })
      )
      .finally(() => setLoading(false));
  }, []);

  // ── Filtered tasks ──────────────────────────────────────────────────────
  const filteredTasks = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return tasks.filter((t) => {
      const matchesStatus = filterStatus === "all" || t.status === filterStatus;
      const matchesSearch =
        !q ||
        t.title.toLowerCase().includes(q) ||
        (t.description ?? "").toLowerCase().includes(q) ||
        (t.caseRef ?? "").toLowerCase().includes(q) ||
        (t.assignee ?? "").toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [tasks, searchQuery, filterStatus]);

  // ── Handlers ────────────────────────────────────────────────────────────
  const handleOpenCreate = useCallback((status: TaskStatus = "todo") => {
    setEditingTask(null);
    setFormDefaultStatus(status);
    setFormOpen(true);
  }, []);

  const handleOpenEdit = useCallback((task: Task) => {
    setEditingTask(task);
    setFormOpen(true);
  }, []);

  const handleFormSubmit = useCallback(
    async (payload: CreateTaskPayload) => {
      if (editingTask) {
        const updated = await updateTask({ id: editingTask.id, ...payload });
        setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
        // keep detail modal in sync
        if (detailTask?.id === updated.id) setDetailTask(updated);
        toast({ title: "Task updated successfully." });
      } else {
        const created = await createTask(payload);
        setTasks((prev) => [...prev, created]);
        toast({ title: "Task created successfully." });
      }
    },
    [editingTask, detailTask, toast]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      if (detailOpen && detailTask?.id === id) setDetailOpen(false);
      toast({ title: "Task deleted." });
    },
    [detailOpen, detailTask, toast]
  );

  const handleStatusChange = useCallback(
    async (taskId: string, newStatus: TaskStatus) => {
      const updated = await updateTask({ id: taskId, status: newStatus });
      setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      if (detailTask?.id === updated.id) setDetailTask(updated);
      toast({
        title: `Moved to "${STATUS_LABELS[newStatus]}"`,
      });
    },
    [detailTask, toast]
  );

  const handleViewTask = useCallback((task: Task) => {
    setDetailTask(task);
    setDetailOpen(true);
  }, []);

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
        <BoardHeader
          totalCount={tasks.length}
          searchQuery={searchQuery}
          filterStatus={filterStatus}
          onSearchChange={setSearchQuery}
          onFilterChange={setFilterStatus}
          onCreateTask={() => handleOpenCreate("todo")}
        />

        <KanbanBoard
          tasks={filteredTasks}
          loading={loading}
          onAddTask={handleOpenCreate}
          onEditTask={handleOpenEdit}
          onDeleteTask={handleDelete}
          onViewTask={handleViewTask}
          onStatusChange={handleStatusChange}
        />
      </div>

      <TaskFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        defaultStatus={formDefaultStatus}
        editTask={editingTask}
      />

      <TaskDetailModal
        task={detailTask}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
      />

      <Toaster />
    </main>
  );
}
