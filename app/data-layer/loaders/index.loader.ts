import { json } from "@remix-run/react";
import { TASK_STATUS } from "~/constants/tasks";
import { db } from "~/utils/db.server";
import { getUser, isLogIn } from "~/utils/session.server";




export const loader = async ({ request }: { request: Request }) => {
  const loginRedirect = await isLogIn(request);
  const user = await getUser(request);
  if (loginRedirect || !user) {
    return loginRedirect;
  }


  try {
    const pendingTasks = await db.task.findMany({
      where: { status: TASK_STATUS.PENDING, user: { id: user.id } },
      include: { category: true }
    });
    const doingTasks = await db.task.findMany({
      where: { status: TASK_STATUS.DOING, user: { id: user.id } },
      include: { category: true },
    });
    const doneTasks = await db.task.findMany({
      where: { status: TASK_STATUS.DONE, user: { id: user.id } },
      include: { category: true },
    });
    const categories = await db.category.findMany({
      where: { user: { id: user.id } }
    });

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