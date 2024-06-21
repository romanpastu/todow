import { json } from "@remix-run/react";
import { TASK_STATUS } from "~/constants/tasks";
import { db } from "~/utils/db.server";

export const loader = async () => {
  try {
    const pendingTasks = await db.task.findMany({
      where: { status: TASK_STATUS.PENDING },
      include: { category: true }
    });
    const doingTasks = await db.task.findMany({
      where: { status: TASK_STATUS.DOING },
      include: { category: true },
    });
    const doneTasks = await db.task.findMany({
      where: { status: TASK_STATUS.DONE },
      include: { category: true },
    });
    const categories = await db.category.findMany();

    return json({
      pendingTasks,
      doingTasks,
      doneTasks,
      categories,
    });
  } catch (error) {
    console.error(error);
    // Customize the status code and message based on the error
    throw new Response("An error occurred", { status: 500 });
  }
};