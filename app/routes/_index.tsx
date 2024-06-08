import { Box, ScrollArea, Button, Input } from "@mantine/core";
import { useState } from "react";
import { json, type MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { TASK_STATUS } from "~/constants/tasks";
import { db } from "~/utils/db.server";
import TaskList from "~/components/TaskList";
import type { Task } from "@prisma/client";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

type TaskWithDateString = Omit<Task, "createdAt" | "updatedAt" | "dateSetToDoingDone"> & {
  createdAt: string;
  updatedAt: string;
  dateSetToDoingDone: string | null;
};

const convertTaskDates = (task: TaskWithDateString): Task => {
  return {
    ...task,
    createdAt: new Date(task.createdAt),
    updatedAt: new Date(task.updatedAt),
    dateSetToDoingDone: task?.dateSetToDoingDone ? new Date(task.dateSetToDoingDone) : null,
  };
};

export const loader = async () => {
  const pendingTasks = await db.task.findMany({ where: { status: TASK_STATUS.PENDING }, include: { category: true }, });
  const doingTasks = await db.task.findMany({ where: { status: TASK_STATUS.DOING }, include: { category: true }, });
  const doneTasks = await db.task.findMany({ where: { status: TASK_STATUS.DONE }, include: { category: true }, });

  return json({
    pendingTasks,
    doingTasks,
    doneTasks,
  });
};

export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const taskId = formData.get("taskId") as string;
  const actionType = formData.get("actionType") as string;

  if (actionType === "start" || actionType === "doing") {
    await db.task.update({
      where: { id: +taskId },
      data: { status: TASK_STATUS.DOING },
    });
  } else if (actionType === "cancel") {
    await db.task.update({
      where: { id: +taskId },
      data: { status: TASK_STATUS.PENDING },
    });
  } else if (actionType === "done") {
    await db.task.update({
      where: { id: +taskId },
      data: { status: TASK_STATUS.DONE },
    });
  }

  return json({ success: true });
};

export default function Index() {
  const data = useLoaderData<{
    pendingTasks: TaskWithDateString[];
    doingTasks: TaskWithDateString[];
    doneTasks: TaskWithDateString[];
  }>();

  const doingTasks = data.doingTasks.map(convertTaskDates);
  const doneTasks = data.doneTasks.map(convertTaskDates);
  const pendingTasks = data.pendingTasks.map(convertTaskDates);

  const [searchQuery, setSearchQuery] = useState("");

  const filteredPendingTasks = pendingTasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "100vh",
        padding: "20px",
      }}
    >
      <Box
        style={{
          border: "1px solid #000",
          width: "70vw",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          padding: "16px",
        }}
      >
        <TaskList tasks={[...doingTasks, ...doneTasks]} />
      </Box>

      <ScrollArea
        style={{
          width: "70vw",
          flex: 1,
          marginTop: "16px",
        }}
      >
        <Box
          style={{
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "8px",
              alignItems: "center",
              marginBottom: "8px",
            }}
          >
            <Button>Create new Task</Button>
            <Input
              placeholder="Search task"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.currentTarget.value)}
            />
          </Box>
          <TaskList tasks={filteredPendingTasks} />
        </Box>
      </ScrollArea>
    </Box>
  );
}
