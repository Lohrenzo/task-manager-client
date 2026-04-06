"use client";

import { useState, useEffect } from "react";
import { Task, TaskStatus, CreateTaskPayload } from "@/lib/types";
import { STATUS_LABELS, STATUSES } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";

interface TaskFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateTaskPayload) => Promise<void>;
  defaultStatus?: TaskStatus;
  editTask?: Task | null;
}

const EMPTY_FORM: CreateTaskPayload = {
  title: "",
  description: "",
  status: "todo",
  dueDate: "",
  dueTime: "",
  assignee: "",
  caseRef: "",
};

export function TaskFormModal({
  open,
  onClose,
  onSubmit,
  defaultStatus = "todo",
  editTask,
}: TaskFormModalProps) {
  const [form, setForm] = useState<CreateTaskPayload>({ ...EMPTY_FORM, status: defaultStatus });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof CreateTaskPayload, string>>>({});

  useEffect(() => {
    if (editTask) {
      setForm({
        title: editTask.title,
        description: editTask.description ?? "",
        status: editTask.status,
        dueDate: editTask.dueDate ?? "",
        dueTime: editTask.dueTime ?? "",
        assignee: editTask.assignee ?? "",
        caseRef: editTask.caseRef ?? "",
      });
    } else {
      setForm({ ...EMPTY_FORM, status: defaultStatus });
    }
    setErrors({});
  }, [editTask, open, defaultStatus]);

  function validate(): boolean {
    const errs: typeof errors = {};
    if (!form.title.trim()) errs.title = "Title is required.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      await onSubmit(form);
      onClose();
    } finally {
      setSaving(false);
    }
  }

  function field(key: keyof CreateTaskPayload, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">
            {editTask ? "Edit Task" : "Create New Task"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4 mt-1">
          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="task-title">
              Title <span className="text-destructive" aria-hidden>*</span>
            </Label>
            <Input
              id="task-title"
              value={form.title}
              onChange={(e) => field("title", e.target.value)}
              placeholder="e.g. Review case bundle for Smith v. Crown"
              aria-describedby={errors.title ? "title-error" : undefined}
              aria-invalid={!!errors.title}
            />
            {errors.title && (
              <p id="title-error" className="text-xs text-destructive">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="task-desc">Description</Label>
            <Textarea
              id="task-desc"
              value={form.description}
              onChange={(e) => field("description", e.target.value)}
              placeholder="Additional details about this task..."
              rows={3}
              className="resize-none"
            />
          </div>

          {/* Status + Case Ref row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="task-status">Status</Label>
              <Select value={form.status} onValueChange={(v) => field("status", v as TaskStatus)}>
                <SelectTrigger id="task-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {STATUS_LABELS[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="task-caseref">Case Reference</Label>
              <Input
                id="task-caseref"
                value={form.caseRef}
                onChange={(e) => field("caseRef", e.target.value)}
                placeholder="e.g. CR-2026-0412"
                className="font-mono"
              />
            </div>
          </div>

          {/* Due Date + Time row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="task-due-date">Due Date</Label>
              <Input
                id="task-due-date"
                type="date"
                value={form.dueDate}
                onChange={(e) => field("dueDate", e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="task-due-time">Due Time</Label>
              <Input
                id="task-due-time"
                type="time"
                value={form.dueTime}
                onChange={(e) => field("dueTime", e.target.value)}
              />
            </div>
          </div>

          {/* Assignee */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="task-assignee">Assigned To</Label>
            <Input
              id="task-assignee"
              value={form.assignee}
              onChange={(e) => field("assignee", e.target.value)}
              placeholder="e.g. J. Harrison"
            />
          </div>

          <DialogFooter className="mt-2 flex gap-2 justify-end">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={saving}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={saving} className="min-w-24">
              {saving ? <Spinner className="mr-2 h-4 w-4" /> : null}
              {editTask ? "Save Changes" : "Create Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
