import type { JSX } from "react";
import { now } from "@/lib/time";
import { createTask } from "@/tasks/actions";
import { listTasks } from "@/tasks/queries";
import { groupTasksByDate } from "@/tasks/group";
import { sortTasks } from "@/tasks/sort";
import { TaskForm } from "@/tasks/task-form";
import { PwaInstallPrompt } from "@/components/pwa-install-prompt";
import { TaskList } from "@/tasks/task-list";
import { toTaskView } from "@/tasks/task-view";

export const instant = false;

function SectionHeading({ title, count }: { title: string; count: number }): JSX.Element {
  return (
    <h2 className="flex items-center gap-2 px-1 text-sm font-medium text-ink-muted">
      {title}
      <span className="rounded-full bg-surface-muted px-2 py-0.5 text-xs tabular-nums text-ink-subtle">{count}</span>
    </h2>
  );
}

export default async function DashboardPage(): Promise<JSX.Element> {
  const [todoList, doneList] = await Promise.all([listTasks("todo"), listTasks("done")]);
  const currentTime = now();

  const activeGroups = groupTasksByDate(todoList, currentTime);
  const activeCount = todoList.length;
  const completedTasks = sortTasks(doneList).map((task) => toTaskView(task, currentTime));

  return (
    <div className="flex flex-col gap-8 sm:gap-10">
      <PwaInstallPrompt />
      <section>
        <h2 className="sr-only">Tambah Tugas</h2>
        <div className="rounded-2xl border border-line bg-surface p-4 shadow-card sm:p-5">
          <TaskForm idPrefix="add" submitLabel="Tambah" onSubmit={createTask} />
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <SectionHeading title="Tugas Aktif" count={activeCount} />
        {activeGroups.length === 0 ? (
          <TaskList tasks={[]} emptyMessage="Tidak ada tugas aktif. Keren!" />
        ) : (
          activeGroups.map((group) => (
            <div key={group.key} className="flex flex-col gap-2.5">
              <h3 className={`px-1 text-sm font-semibold ${group.isOverdue ? "text-danger" : "text-ink"}`}>
                {group.heading}
                {group.isOverdue ? <span className="ml-2 text-xs font-medium text-danger/80">Terlewat</span> : null}
              </h3>
              <TaskList tasks={group.tasks} emptyMessage="" />
            </div>
          ))
        )}
      </section>

      {completedTasks.length > 0 ? (
        <section className="flex flex-col gap-3">
          <SectionHeading title="Selesai" count={completedTasks.length} />
          <TaskList tasks={completedTasks} emptyMessage="Belum ada tugas selesai." />
        </section>
      ) : null}
    </div>
  );
}
