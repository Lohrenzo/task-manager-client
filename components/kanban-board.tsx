"use client";

import { Task, TaskStatus } from "@/lib/types";
import { STATUS_LABELS, STATUSES } from "@/lib/api";
import { cn } from "@/lib/utils";
import { TaskCard, TaskCardSkeleton } from "@/components/task-card";
import { Plus, ClipboardList, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface KanbanBoardProps {
  tasks: Task[];
  loading: boolean;
  onAddTask: (defaultStatus: TaskStatus) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onViewTask: (task: Task) => void;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
}

const COLUMN_STYLES: Record<TaskStatus, { header: string; dot: string; bg: string; addBtn: string }> = {
  todo: {
    header: "text-slate-600 dark:text-slate-400",
    dot: "bg-slate-400 dark:bg-slate-500",
    bg: "bg-[var(--col-todo-bg)]",
    addBtn: "hover:bg-slate-200/70 dark:hover:bg-slate-700/60 text-slate-500 dark:text-slate-400",
  },
  "in-progress": {
    header: "text-blue-700 dark:text-blue-400",
    dot: "bg-blue-500 dark:bg-blue-500",
    bg: "bg-[var(--col-inprogress-bg)]",
    addBtn: "hover:bg-blue-100/70 dark:hover:bg-blue-900/40 text-blue-500 dark:text-blue-400",
  },
  done: {
    header: "text-emerald-700 dark:text-emerald-400",
    dot: "bg-emerald-500",
    bg: "bg-[var(--col-done-bg)]",
    addBtn: "hover:bg-emerald-100/70 dark:hover:bg-emerald-900/40 text-emerald-500 dark:text-emerald-400",
  },
};

export function KanbanBoard({
  tasks,
  loading,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onViewTask,
  onStatusChange,
}: KanbanBoardProps) {
  const tasksByStatus = STATUSES.reduce<Record<TaskStatus, Task[]>>(
    (acc, s) => {
      acc[s] = tasks.filter((t) => t.status === s);
      return acc;
    },
    { todo: [], "in-progress": [], done: [] }
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
      {STATUSES.map((status) => {
        const col = COLUMN_STYLES[status];
        const colTasks = tasksByStatus[status];

        return (
          <section
            key={status}
            className={cn("rounded-xl border border-border flex flex-col min-h-[420px]", col.bg)}
            aria-label={`${STATUS_LABELS[status]} column`}
          >
            {/* Column header */}
            <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <span className={cn("inline-block w-2.5 h-2.5 rounded-full", col.dot)} aria-hidden />
                <h2 className={cn("text-sm font-semibold tracking-wide uppercase", col.header)}>
                  {STATUS_LABELS[status]}
                </h2>
                <span className="ml-1 inline-flex items-center justify-center rounded-full bg-border text-muted-foreground text-xs font-medium w-5 h-5">
                  {loading ? <Loader2 size={10} className="animate-spin" /> : colTasks.length}
                </span>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className={cn("h-7 w-7 rounded-md", col.addBtn)}
                aria-label={`Add task to ${STATUS_LABELS[status]}`}
                onClick={() => onAddTask(status)}
              >
                <Plus size={15} />
              </Button>
            </div>

            {/* Task cards */}
            <div className="flex flex-col gap-3 p-3 flex-1">
              {loading ? (
                <>
                  <TaskCardSkeleton />
                  <TaskCardSkeleton />
                </>
              ) : colTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center flex-1 py-10 gap-2 text-muted-foreground/50">
                  <ClipboardList size={28} strokeWidth={1.4} />
                  <p className="text-xs">No tasks here</p>
                </div>
              ) : (
                colTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={onEditTask}
                    onDelete={onDeleteTask}
                    onClick={onViewTask}
                  />
                ))
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
