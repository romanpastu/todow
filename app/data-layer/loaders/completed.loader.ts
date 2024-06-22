import { json } from "@remix-run/react";
import { TASK_STATUS } from "~/constants/tasks";
import { db } from "~/utils/db.server";
import { isLogIn } from "~/utils/session.server";

export const loader = async ({ request }: { request: Request }) => {
  const loginRedirect = await isLogIn(request);
  if (loginRedirect) {
    return loginRedirect;
  }
  try {
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
  } catch (error) {
    console.error(error);
    // Customize the status code and message based on the error
    throw new Response("An error occurred", { status: 500 });
  }
};