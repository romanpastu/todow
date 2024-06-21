import { json } from "@remix-run/react";
import { TASK_STATUS } from "~/constants/tasks";
import { db } from "~/utils/db.server";

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
    const categories = await db.category.findMany();
    return json({ tasks: tasksFromCategory, category, categories});
  };