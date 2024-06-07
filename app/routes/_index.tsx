import { Box, ScrollArea, Text, Button } from "@mantine/core";
import { Task } from "@prisma/client";

import { json, type MetaFunction } from "@remix-run/node";
import { useLoaderData, useFetcher } from "@remix-run/react";
import { TASK_STATUS } from "~/constants/tasks";
import { db } from "~/utils/db.server";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

type TaskWithDateString = Omit<Task, 'createdAt' | 'updatedAt'> & {
  createdAt: string;
  updatedAt: string;
};

const convertTaskDates = (task: TaskWithDateString): Task => {
  return {
    ...task,
    createdAt: new Date(task.createdAt),
    updatedAt: new Date(task.updatedAt),
  };
};

export const loader = async () => {
  const pendingTasks = await db.task.findMany({ where: { status: TASK_STATUS.PENDING } });
  const doingTasks = await db.task.findMany({ where: { status: TASK_STATUS.DOING } });
  const doneTasks = await db.task.findMany({ where: { status: TASK_STATUS.DONE } });

  return json({
    pendingTasks,
    doingTasks,
    doneTasks,
  });
};

export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const taskId = formData.get('taskId') as string;
  const actionType = formData.get('actionType') as string;

  if (actionType === 'start' || actionType === 'doing') {
    await db.task.update({
      where: { id: +taskId },
      data: { status: TASK_STATUS.DOING },
    });
  } else if (actionType === 'cancel') {
    await db.task.update({
      where: { id: +taskId },
      data: { status: TASK_STATUS.PENDING },
    });
  } else if (actionType === 'done') {
    await db.task.update({
      where: { id: +taskId },
      data: { status: TASK_STATUS.DONE },
    });
  }

  return json({ success: true });
};

export default function Index() {
  const data = useLoaderData<typeof loader>();
  const fetcher = useFetcher();

  const doingTasks = data.doingTasks.map(convertTaskDates);
  const doneTasks = data.doneTasks.map(convertTaskDates);
  const pendingTasks = data.pendingTasks.map(convertTaskDates);

  const renderTasks = (tasks: Task[]) => {
    return tasks?.length === 0 ? (
      <Box
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          border: '1px solid black',
          padding: '8px',
          width: '65vw',
        }}
      >
        <Text>Weekly tasks</Text>
      </Box>
    ) : (
      tasks.map((task: Task) => (
        <Box
          key={task.id}
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            border: '1px solid black',
            padding: '8px',
            width: '65vw',
            marginTop: '4px',
            marginBottom: '4px',
          }}
        >
          <Text>{task.title}</Text>
          <Box style={{ display: 'flex', gap: '8px' }}>
            {task.status === TASK_STATUS.DOING && (
              <>
                <fetcher.Form method="post">
                  <input type="hidden" name="taskId" value={task.id} />
                  <input type="hidden" name="actionType" value="cancel" />
                  <Button
                    type="submit"
                    size="xs"
                    variant="gradient"
                    style={{ backgroundColor: 'lightgray' }}
                  >
                    Cancel
                  </Button>
                </fetcher.Form>
                <fetcher.Form method="post">
                  <input type="hidden" name="taskId" value={task.id} />
                  <input type="hidden" name="actionType" value="done" />
                  <Button
                    type="submit"
                    size="xs"
                    variant="gradient"
                    style={{ backgroundColor: 'lightgray' }}
                  >
                    Done
                  </Button>
                </fetcher.Form>
              </>
            )}
            {task.status === TASK_STATUS.PENDING && (
              <fetcher.Form method="post">
                <input type="hidden" name="taskId" value={task.id} />
                <input type="hidden" name="actionType" value="start" />
                <Button
                  type="submit"
                  size="xs"
                  variant="gradient"
                  style={{ backgroundColor: 'lightgray' }}
                >
                  Start
                </Button>
              </fetcher.Form>
            )}
            {task.status === TASK_STATUS.DONE && (
              <fetcher.Form method="post">
                <input type="hidden" name="taskId" value={task.id} />
                <input type="hidden" name="actionType" value="doing" />
                <Button
                  type="submit"
                  size="xs"
                  variant="gradient"
                  style={{ backgroundColor: 'lightgray' }}
                >
                  Doing
                </Button>
              </fetcher.Form>
            )}
          </Box>
        </Box>
      ))
    );
  };

  return (
    <Box
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100vh',
        padding: '20px',
      }}
    >
      <Box
        style={{
          border: '1px solid #000',
          width: '70vw',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          padding: '16px',
        }}
      >
        {renderTasks([...doingTasks, ...doneTasks])}
      </Box>

      <ScrollArea
        style={{
          width: '70vw',
          flex: 1,
          marginTop: '16px',
        }}
      >
        <Box style={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <Text>Tasks to do</Text>
          {renderTasks(pendingTasks)}
        </Box>

      </ScrollArea>
    </Box>
  );
}
