import { json, useLoaderData, useNavigate } from "@remix-run/react";
import TaskList from "~/components/TaskList";
import { TASK_STATUS } from "~/constants/tasks";
import { db } from "~/utils/db.server";
import { TaskWithCategoryJson } from "./_index";
import { Box, Button, Input, Text } from "@mantine/core";
import { useState } from "react";
import styles from "~/styles/page-list.module.css";
import { convertTaskDates } from "~/utils/helpers";

export const loader = async () => {
  const completedTasks = await db.task.findMany({
    where: { status: TASK_STATUS.FINISHED },
    orderBy: { priority: 'asc' },
    include: { category: true }
  });

  return json({
    completedTasks,
  });
};

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export default function CompletedRoute() {
  const data = useLoaderData<{ completedTasks: TaskWithCategoryJson[] }>();
  const completedTasks = data.completedTasks.map(convertTaskDates);
  const [searchQuery, setSearchQuery] = useState("");
  const filteredCompletedTasks = completedTasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const navigate = useNavigate();

  return (
    <Box className={styles.container}>
      <Text size="50px" className={styles.header}>Completed Tasks</Text>
      <Box className={styles.searchContainer}>
        <Input
          placeholder="Search task"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.currentTarget.value)}
        />
        <Button onClick={() => navigate("/")}>Go back</Button>
      </Box>
      <TaskList tasks={filteredCompletedTasks} />
    </Box>
  );
}
