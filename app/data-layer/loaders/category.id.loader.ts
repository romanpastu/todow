import { json } from "@remix-run/react";
import { TASK_STATUS } from "~/constants/tasks";
import { db } from "~/utils/db.server";

export const loader = async ({ params }: {
  params: {
    categoryId: string;
  }
}) => {
  try {
    const { categoryId } = params;
    const tasksFromCategory = await db.task.findMany({
      where: {
        categoryId: +categoryId,
        status: { not: TASK_STATUS.FINISHED }
      },
      include: { category: true }
    });
    const category = await db.category.findUnique({ where: { id: +categoryId } });
    const categories = await db.category.findMany();
    return json({ tasks: tasksFromCategory, category, categories });
  } catch (error) {
    console.error(error);
    // Customize the status code and message based on the error
    throw new Response("An error occurred", { status: 500 });
  }
};