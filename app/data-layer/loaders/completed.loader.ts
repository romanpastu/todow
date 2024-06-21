import { json } from "@remix-run/react";
import { TASK_STATUS } from "~/constants/tasks";
import { db } from "~/utils/db.server";

export const loader = async () => {
    const completedTasks = await db.task.findMany({
      where: { status: TASK_STATUS.FINISHED },
      orderBy: { priority: 'asc' },
      include: { category: true }
    });
    const categories = await db.category.findMany();
  
    return json({
      completedTasks,
      categories,
    });
  };