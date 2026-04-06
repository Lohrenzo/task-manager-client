"use client";

import { useState, useCallback } from "react";
import { Task, TaskStatus } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, SlidersHorizontal } from "lucide-react";
import { STATUS_LABELS, STATUSES } from "@/lib/api";
import { ThemeToggle } from "@/components/theme-toggle";

interface BoardHeaderProps {
  totalCount: number;
  searchQuery: string;
  filterStatus: TaskStatus | "all";
  onSearchChange: (q: string) => void;
  onFilterChange: (status: TaskStatus | "all") => void;
  onCreateTask: () => void;
}

export function BoardHeader({
  totalCount,
  searchQuery,
  filterStatus,
  onSearchChange,
  onFilterChange,
  onCreateTask,
}: BoardHeaderProps) {
  return (
    <header className="flex flex-col gap-4">
      {/* Top bar */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-0.5">
            {/* HMCTS crown-inspired mark */}
            <span
              className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-primary text-primary-foreground font-bold text-sm select-none"
              aria-hidden
            >
              HM
            </span>
            <h1 className="text-xl font-bold text-foreground tracking-tight">
              Task Manager
            </h1>
          </div>
          <p className="text-sm text-muted-foreground ml-11">
            HMCTS Casework — {totalCount} task{totalCount !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={onCreateTask} size="sm" className="shrink-0">
            + New Task
          </Button>
          <ThemeToggle />
        </div>
      </div>

      {/* Filters row */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
          <Input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tasks, case refs..."
            className="pl-9 h-9 text-sm"
            aria-label="Search tasks"
          />
        </div>

        <div className="flex items-center gap-2">
          <SlidersHorizontal
            size={14}
            className="text-muted-foreground shrink-0"
            aria-hidden
          />
          <Select
            value={filterStatus}
            onValueChange={(v) => onFilterChange(v as TaskStatus | "all")}
          >
            <SelectTrigger
              className="h-9 text-sm w-40"
              aria-label="Filter by status"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {STATUS_LABELS[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </header>
  );
}
