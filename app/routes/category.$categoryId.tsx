import { json, useLoaderData, useNavigate } from "@remix-run/react";
import { db } from "~/utils/db.server";
import { TaskWithCategoryJson, convertTaskDates } from "./_index";
import { Box, Button, Input, Text } from "@mantine/core";
import { useState } from "react";
import TaskList from "~/components/TaskList";
import { TASK_STATUS } from "~/constants/tasks";
import { Category } from "@prisma/client";
import styles from "~/styles/page-list.module.css";

export const loader = async ({ params }: {
  params: {
    categoryId: string;
  }
}) => {
  const { categoryId } = params;
  const tasksFromCategory = await db.task.findMany({
    where: {
      categoryId: +categoryId,
      status: { not: TASK_STATUS.FINISHED }
    },
    include: { category: true }
  });
  const category = await db.category.findUnique({ where: { id: +categoryId } });
  return json({ tasks: tasksFromCategory, category });
};

export default function CategoryRoute() {
  const data = useLoaderData<{ tasks: TaskWithCategoryJson[], category: Category }>();
  const categoryTasks = data.tasks.map(convertTaskDates);
  const category = data.category;
  const [searchQuery, setSearchQuery] = useState("");
  const filteredcategoryTasks = categoryTasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const navigate = useNavigate();

  return (
    <Box className={styles.container}>
      <Text size="50px" className={styles.header}>Tasks for categoryId: {category?.title}</Text>
      <Box className={styles.searchContainer}>
        <Input
          placeholder="Search task"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.currentTarget.value)}
        />
        <Button onClick={() => navigate("/")}>Go back</Button>
      </Box>
      <TaskList tasks={filteredcategoryTasks} />
    </Box>
  );
}
