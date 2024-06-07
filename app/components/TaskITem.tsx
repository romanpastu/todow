// components/TaskItem.tsx
import { Box, Button, Text } from "@mantine/core";
import { useFetcher } from "@remix-run/react";
import { TASK_STATUS } from "~/constants/tasks";
import type { Task } from "@prisma/client";

interface TaskItemProps {
  task: Task;
}

const TaskItem: React.FC<TaskItemProps> = ({ task } : {
    task: Task;
}) => {
  const fetcher = useFetcher();

  return (
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
        cursor: "pointer",
      }}
    >
      <Text>{task.title}</Text>
      <Box style={{ display: "flex", gap: "8px" }}>
        {task.status === TASK_STATUS.DOING && (
          <>
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
              Doing
            </Button>
          </fetcher.Form>
        )}
      </Box>
    </Box>
  );
};

export default TaskItem;
