"use client";

import { Task, TaskStatus } from "@/lib/types";
import { STATUS_LABELS } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Calendar, Clock, User, FileText, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onClick: (task: Task) => void;
}

const STATUS_PILL: Record<TaskStatus, string> = {
  todo: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700",
  "in-progress": "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800",
  done: "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800",
};

function isOverdue(dueDate?: string, dueTime?: string, status?: TaskStatus): boolean {
  if (!dueDate || status === "done") return false;
  const dateStr = dueTime ? `${dueDate}T${dueTime}` : `${dueDate}T23:59`;
  return new Date(dateStr) < new Date();
}

function formatDate(dueDate?: string, dueTime?: string): string {
  if (!dueDate) return "";
  const date = new Date(dueDate);
  const formatted = date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  return dueTime ? `${formatted} at ${dueTime}` : formatted;
}

export function TaskCard({ task, onEdit, onDelete, onClick }: TaskCardProps) {
  const overdue = isOverdue(task.dueDate, task.dueTime, task.status);

  return (
    <article
      className={cn(
        "bg-card text-card-foreground rounded-lg border border-border p-4 shadow-sm",
        "hover:shadow-md hover:border-primary/30 transition-all duration-150 cursor-pointer group",
        overdue && "border-l-4 border-l-destructive"
      )}
      onClick={() => onClick(task)}
      aria-label={`Task: ${task.title}`}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="text-sm font-semibold text-foreground leading-snug line-clamp-2 flex-1 text-balance">
          {task.title}
        </h3>
        {/* Action buttons — visible on hover */}
        <div
          className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-foreground"
            aria-label="Edit task"
            onClick={() => onEdit(task)}
          >
            <Pencil size={13} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-destructive"
            aria-label="Delete task"
            onClick={() => onDelete(task.id)}
          >
            <Trash2 size={13} />
          </Button>
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-3">
          {task.description}
        </p>
      )}

      {/* Meta chips */}
      <div className="flex flex-wrap items-center gap-2 mt-auto">
        {task.caseRef && (
          <span className="inline-flex items-center gap-1 text-xs bg-secondary text-secondary-foreground rounded px-2 py-0.5 font-mono font-medium">
            <FileText size={11} />
            {task.caseRef}
          </span>
        )}

        {task.dueDate && (
          <span
            className={cn(
              "inline-flex items-center gap-1 text-xs rounded px-2 py-0.5",
              overdue
                ? "bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 font-semibold"
                : "bg-secondary text-secondary-foreground"
            )}
          >
            <Calendar size={11} />
            {task.dueDate && task.dueTime ? (
              <>
                <span>{new Date(task.dueDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}</span>
                <Clock size={10} />
                <span>{task.dueTime}</span>
              </>
            ) : (
              formatDate(task.dueDate)
            )}
            {overdue && <span className="ml-0.5">(Overdue)</span>}
          </span>
        )}

        {task.assignee && (
          <span className="inline-flex items-center gap-1 text-xs bg-secondary text-secondary-foreground rounded px-2 py-0.5 ml-auto">
            <User size={11} />
            {task.assignee}
          </span>
        )}
      </div>
    </article>
  );
}

export function TaskCardSkeleton() {
  return (
    <div className="bg-card rounded-lg border border-border p-4 animate-pulse">
      <div className="h-4 bg-muted rounded w-3/4 mb-2" />
      <div className="h-3 bg-muted rounded w-full mb-1" />
      <div className="h-3 bg-muted rounded w-2/3 mb-4" />
      <div className="flex gap-2">
        <div className="h-5 bg-muted rounded w-20" />
        <div className="h-5 bg-muted rounded w-16" />
      </div>
    </div>
  );
}
