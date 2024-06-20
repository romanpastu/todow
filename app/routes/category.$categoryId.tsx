import { json, useLoaderData, useNavigate, useFetcher, redirect } from "@remix-run/react";
import { db } from "~/utils/db.server";
import { TaskWithCategoryJson } from "./_index";
import { Box, Button, Input, Text } from "@mantine/core";
import { useState } from "react";
import TaskList from "~/components/TaskList";
import { TASK_STATUS } from "~/constants/tasks";
import { Category } from "@prisma/client";
import styles from "~/styles/page-list.module.css";
import { convertTaskDates } from "~/utils/helpers";
import { IconPencil } from "@tabler/icons-react";
import CreateEditCategoryModal from "~/components/CreateEditCategoryModal";
import { useDisclosure } from "@mantine/hooks";

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

export const action = async ({ request, params }: { request: Request, params : {
  categoryId: string;
} }) => {
  console.log("GLOBAL")
  const formData = await request.formData();
  const actionType = formData.get("actionType") as string;
  const categoryId = formData.get("categoryId") as string;
  if (actionType === "deleteCategory") {
    await db.category.delete({ where: { id: +categoryId } });
    return redirect("/");
  }else if(actionType === "editCategory") {
    
    const title = formData.get("title") as string;
    const { categoryId } = params;
    await db.category.update({
      where: { id: +categoryId },
      data: {
        title,
      },
    });

    return json({ success: true });
  }
}

export default function CategoryRoute() {
  const data = useLoaderData<{ tasks: TaskWithCategoryJson[], category: Category }>();
  const categoryTasks = data.tasks.map(convertTaskDates);
  const category = data.category;
  const [searchQuery, setSearchQuery] = useState("");
  const filteredCategoryTasks = categoryTasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const [categoryModalOpened, { open: categoryModalOpen, close: categoryModalClose }] = useDisclosure(false);

  return (
    <Box className={styles.container}>
      <CreateEditCategoryModal opened={categoryModalOpened} onClose={categoryModalClose} mode={"edit"} currentTitle={
        category?.title
      }
      />
      <Box style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "10px",
      }}>
        <Text size="50px" className={styles.header}>Tasks for category: {category?.title}</Text>
        <IconPencil size="30px" className={styles.header} style={{
          cursor: "pointer",
        }}
          onClick={categoryModalOpen}
        />
      </Box>

      <Box className={styles.searchContainer}>
        <Input
          placeholder="Search task"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.currentTarget.value)}
        />
        <Button onClick={() => navigate("/")}>Go back</Button>
        <fetcher.Form method="post">
          <input type="hidden" name="categoryId" value={category.id} />
          <input type="hidden" name="actionType" value="deleteCategory" />
          <Button color="red" type="submit">Delete Category</Button>
        </fetcher.Form>
      </Box>
      <TaskList tasks={filteredCategoryTasks} />
    </Box>
  );
}
