import { Box, ScrollArea, Button, Input, Text } from "@mantine/core";
import { useState } from "react";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { TASK_STATUS } from "~/constants/tasks";
import { db } from "~/utils/db.server";
import TaskList from "~/components/TaskList";
import TaskModal from "~/components/TaskModal";
import { useDisclosure } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";
import styles from "~/styles/index.module.css"; // Import the CSS module
import { TaskWithCategory } from "~/components/TaskITem";
import { convertTaskDates } from "~/utils/helpers";
import { IconPlus } from "@tabler/icons-react";
import CreateEditCategoryModal from "~/components/CreateEditCategoryModal";


export type TaskWithCategoryJson = Omit<TaskWithCategory, "createdAt" | "updatedAt" | "dateSetToDoingDone" | "category"> & {
  createdAt: string;
  updatedAt: string;
  dateSetToDoingDone: string | null;
  category: {
    id: number;
    title: string;
    createdAt: string;
    updatedAt: string;
    createdBy: number;
  } | null;
};

export const loader = async () => {
  const pendingTasks = await db.task.findMany({ where: { status: TASK_STATUS.PENDING }, include: { category: true }, orderBy: { priority: 'asc' }, });
  const doingTasks = await db.task.findMany({ where: { status: TASK_STATUS.DOING }, include: { category: true }, });
  const doneTasks = await db.task.findMany({ where: { status: TASK_STATUS.DONE }, include: { category: true }, });
  const categories = await db.category.findMany();

  return json({
    pendingTasks,
    doingTasks,
    doneTasks,
    categories,
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
  } else if (actionType === "update") {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const priority = parseInt(formData.get("priority") as string);

    await db.task.update({
      where: { id: +taskId },
      data: {
        title,
        description,
        priority,
      },
    });

    return json({ success: true });
  } else if (actionType === "delete") {
    await db.task.delete({
      where: { id: +taskId },
    });
  } else if (actionType === "create") {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const priority = parseInt(formData.get("priority") as string);

    await db.task.create({
      data: {
        title,
        description,
        priority,
        status: TASK_STATUS.PENDING,
        //TO-DO: get the user from the session
        user: { connect: { id: 1 } },
      },
    });

    return json({ success: true });
  } else if(actionType === "createCategory") {
    const title = formData.get("title") as string;

    await db.category.create({
      data: {
        title,
        createdBy: 1,
      },
    });

    return json({ success: true });
  } 

  return json({ success: true });
};

export default function Index() {
  const data = useLoaderData<{
    pendingTasks: TaskWithCategoryJson[];
    doingTasks: TaskWithCategoryJson[];
    doneTasks: TaskWithCategoryJson[];
    categories: { id: number; title: string }[];
  }>();

  const doingTasks = data.doingTasks.map(convertTaskDates);
  const doneTasks = data.doneTasks.map(convertTaskDates);
  const pendingTasks = data.pendingTasks.map(convertTaskDates);
  const categories = data.categories;
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQueryCategory, setSearchQueryCategory] = useState("");
  const filteredPendingTasks = pendingTasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const [opened, { open, close }] = useDisclosure(false);
  const [categoryModalOpened, { open: categoryModalOpen, close: categoryModalClose }] = useDisclosure(false);
  const navigate = useNavigate();

  return (
    <Box className={styles.container}>
      <Box className={styles.sidebar}>
        <Box style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '20px',
          alignItems: 'center',
        }}>
          <Text size="15px" className={styles.sidebarTitle}>Categories</Text>
          <Input
            placeholder="Search category"
            value={searchQueryCategory}
            onChange={(e) => setSearchQueryCategory(e.currentTarget.value)}
          />
          <IconPlus size={20} style={{
            cursor: 'pointer',
          }} 
          onClick={categoryModalOpen}
          />
          
        </Box>
        <ScrollArea className={styles.categoryList}>
          {categories.filter((cat) => cat.title.toLocaleLowerCase().includes(searchQueryCategory.toLowerCase())).map((category) => (
            <Box
              key={category.id}
              onClick={() => navigate(`/category/${category.id}`)}
              className={styles.categoryItem}
            >
              <Text>{category.title} - ({
                [...doingTasks, ...doneTasks, ...pendingTasks].filter(task => task.category?.id === category.id)?.length
              })</Text>
            </Box>
          ))}
        </ScrollArea>
      </Box>
      <TaskModal task={null} opened={opened} onClose={close} isCreate={true} />
      <CreateEditCategoryModal opened={categoryModalOpened} onClose={categoryModalClose} mode={"create"}/>
      <Box className={styles.main}>
        <ScrollArea className={styles.doingDoneTasks}>
          <Box className={styles.taskListContainer}>
            <TaskList tasks={[...doingTasks, ...doneTasks]} />
          </Box>
        </ScrollArea>
        <Box className={styles.controls}>
          <Box className={styles.controlGroup}>
            <Button onClick={open}>Create new Task</Button>
            <Input
              placeholder="Search task"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.currentTarget.value)}
            />
            <Button onClick={() => navigate('/completed')}>GoTo Completed Tasks</Button>
          </Box>
        </Box>
        <ScrollArea className={styles.pendingTasks}>
          <Box className={styles.taskListContainer}>
            <TaskList tasks={filteredPendingTasks} />
          </Box>
        </ScrollArea>
      </Box>
      <Box className={styles.rightSpace}></Box>
    </Box>
  );
}
