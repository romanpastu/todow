// components/TaskItem.tsx
import { Box, Button, Text } from "@mantine/core";
import { useFetcher } from "@remix-run/react";
import { TASK_STATUS } from "~/constants/tasks";
import type { Category, Task } from "@prisma/client";
import { IconRotate } from '@tabler/icons-react';
import '../styles/rotate.css'
import { useDisclosure } from "@mantine/hooks";
import TaskModal from "./TaskModal";


export type TaskWithCategory = Task & {
  category?: Category
};
interface TaskItemProps {
  task: TaskWithCategory;
  categories: { id: number; title: string }[];
}
const getBackGroundColor = (status: number) => {
  switch (status) {
    case TASK_STATUS.PENDING:
      return "lightgray";
    case TASK_STATUS.DOING:
      return "lightblue";
    case TASK_STATUS.DONE:
      return "lightgreen";
    case TASK_STATUS.FINISHED:
      return "lightgreen";
    default:
      return "white";
  }
}

const TaskItem: React.FC<TaskItemProps> = ({ task, categories }: {
  task: TaskWithCategory;
  categories: { id: number; title: string }[];
}) => {
  const fetcher = useFetcher();
  const backgroundColor = getBackGroundColor(task.status);
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <TaskModal
        task={task}
        opened={opened}
        onClose={close}
        categories={categories}
      />
      <Box
        key={task.id}
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          border: "1px solid black",
          padding: "8px",
          width: "65vw",
          marginTop: "4px",
          marginBottom: "4px",

          backgroundColor
        }}

      >

        <Text style={{ cursor: "pointer" }} onClick={() => {
          open();
        }}>{task.title}</Text>

        <Box style={{ display: "flex", gap: "8px" }}>
          {task.status === TASK_STATUS.PENDING && <Text color="red" size="15px">P{task?.priority}</Text>}
          {task.status === TASK_STATUS.DOING && (
            <Box style={{
              display: "flex",
              gap: "8px",
              alignContent: "center",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <IconRotate size={20} className="rotate" />
              <fetcher.Form method="post">
                <input type="hidden" name="taskId" value={task.id} />
                <input type="hidden" name="actionType" value="cancel" />
                <Button
                  type="submit"
                  size="xs"
                  variant="gradient"
                  style={{ backgroundColor: "lightgray" }}
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
                  style={{ backgroundColor: "lightgray" }}
                >
                  Set to Done
                </Button>
              </fetcher.Form>
            </Box>
          )}
          {task.status === TASK_STATUS.PENDING && (
            <fetcher.Form method="post">
              <input type="hidden" name="taskId" value={task.id} />
              <input type="hidden" name="actionType" value="start" />
              <Button
                type="submit"
                size="xs"
                variant="gradient"
                style={{ backgroundColor: "lightgray" }}
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
                style={{ backgroundColor: "lightgray" }}
              >
                Return to Doing
              </Button>
            </fetcher.Form>
          )}
        </Box>
      </Box></>
  );
};

export default TaskItem;
