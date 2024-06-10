import { Box, ScrollArea, Button, Input, Text } from "@mantine/core";
import { useState } from "react";
import { json, type MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { TASK_STATUS } from "~/constants/tasks";
import { db } from "~/utils/db.server";
import TaskList from "~/components/TaskList";
import { TaskWithCategory } from "~/components/TaskITem";
import TaskModal from "~/components/TaskModal";
import { useDisclosure } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";
export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};


export type TaskWithCategoryJson = Omit<TaskWithCategory, "createdAt" | "updatedAt" | "dateSetToDoingDone" | "category"> & {
  createdAt: string;
  updatedAt: string;
  dateSetToDoingDone: string | null;
  category: {
    id: number;
    title: string;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export const convertTaskDates = (task: TaskWithCategoryJson): TaskWithCategory => {
  return {
    ...task,
    createdAt: new Date(task.createdAt),
    updatedAt: new Date(task.updatedAt),
    dateSetToDoingDone: task?.dateSetToDoingDone ? new Date(task.dateSetToDoingDone) : null,
    category: task.category
      ? {
        ...task.category,
        createdAt: new Date(task.category.createdAt),
        updatedAt: new Date(task.category.updatedAt),
      }
      : undefined,
  };
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

  const filteredPendingTasks = pendingTasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const [opened, { open, close }] = useDisclosure(false);
  const navigate = useNavigate();
  
  return (
    <Box
      style={{
        display: "flex",
        flexDirection: "row",
      }}
    >
      <Box style={{
        height: "100vh",
        width: "15vw",
        backgroundColor: "rgba(0,0,0,0.1)",
        paddingLeft: "16px",
      }}>
        <Text size="20px" style={{
          marginBottom: "16px",
          marginTop: "16px"
        }}>Categories</Text>
        <Box>
          {categories.map((category) => (
            <Box key={category.id} onClick={() => navigate(`/category/${category.id}`)} style={{
              cursor: "pointer",
              padding: "8px",
              backgroundColor: "rgba(0,0,0,0.2)",
              marginBottom: "8px"
            }}>
              <Text>{category.title}</Text>
            </Box>
          ))}
        </Box>
      </Box>
      <TaskModal task={null} opened={opened} onClose={close} isCreate={true} />
      <Box>
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
              <Button onClick={() => {
                open();
              }}>Create new Task</Button>
              <Input
                placeholder="Search task"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.currentTarget.value)}
              />
              <Button onClick={() => navigate('/completed')}>GoTo Completed Tasks</Button>
            </Box>
            <TaskList tasks={filteredPendingTasks} />
          </Box>
        </ScrollArea>
      </Box>
      <Box style={{
        height: "100px",
        width: "15vw",

      }}>

      </Box>
    </Box>
  );
}
