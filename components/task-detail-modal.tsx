"use client";

import { Task, TaskStatus } from "@/lib/types";
import { STATUS_LABELS, STATUSES } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Clock, User, FileText, Pencil, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskDetailModalProps {
  task: Task | null;
  open: boolean;
  onClose: () => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
}

const STATUS_BADGE: Record<TaskStatus, string> = {
  todo: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700",
  "in-progress": "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800",
  done: "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800",
};

function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-muted-foreground shrink-0">{icon}</span>
      <div>
        <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
        <p className="text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}

export function TaskDetailModal({
  task,
  open,
  onClose,
  onEdit,
  onDelete,
  onStatusChange,
}: TaskDetailModalProps) {
  if (!task) return null;

  const dueDisplay = task.dueDate
    ? [
        new Date(task.dueDate).toLocaleDateString("en-GB", {
          weekday: "short",
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        task.dueTime,
      ]
        .filter(Boolean)
        .join(" at ")
    : null;

  const createdDisplay = new Date(task.createdAt).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="pr-8">
          <div className="flex items-center gap-2 mb-1">
            {task.caseRef && (
              <span className="inline-flex items-center gap-1 text-xs bg-secondary text-secondary-foreground rounded px-2 py-0.5 font-mono font-medium">
                <FileText size={10} />
                {task.caseRef}
              </span>
            )}
          </div>
          <DialogTitle className="text-base font-semibold leading-snug text-balance">
            {task.title}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-5 mt-1">
          {/* Description */}
          {task.description && (
            <p className="text-sm text-muted-foreground leading-relaxed">{task.description}</p>
          )}

          {/* Status selector */}
          <div className="flex flex-col gap-1.5">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Status</p>
            <Select
              value={task.status}
              onValueChange={(v) => onStatusChange(task.id, v as TaskStatus)}
            >
              <SelectTrigger className="w-44 h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    <span className={cn("rounded px-1.5 py-0.5 text-xs font-medium", STATUS_BADGE[s])}>
                      {STATUS_LABELS[s]}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Detail rows */}
          <div className="flex flex-col gap-3 border-t border-border pt-4">
            {dueDisplay && (
              <DetailRow
                icon={<Calendar size={15} />}
                label="Due"
                value={dueDisplay}
              />
            )}
            {task.assignee && (
              <DetailRow
                icon={<User size={15} />}
                label="Assigned to"
                value={task.assignee}
              />
            )}
            <DetailRow
              icon={<Clock size={15} />}
              label="Created"
              value={createdDisplay}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-1 border-t border-border">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => { onClose(); onEdit(task); }}
            >
              <Pencil size={13} className="mr-1.5" />
              Edit Task
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="flex-1"
              onClick={() => { onDelete(task.id); onClose(); }}
            >
              <Trash2 size={13} className="mr-1.5" />
              Delete
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
