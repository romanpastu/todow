import { json } from "@remix-run/react";
import moment from "moment";
import { INDEX_ACTIONS } from "~/constants/loader-actions/index-actions";
import { TASK_STATUS } from "~/constants/tasks";
import { db } from "~/utils/db.server";
import { getUser } from "~/utils/session.server";

export const action = async ({ request }: { request: Request }) => {
  try {
    const formData = await request.formData();
    const taskId = formData.get("taskId") as string;
    const actionType = formData.get("actionType") as string;
    const user = await getUser(request);
  
    if (actionType === INDEX_ACTIONS.START || actionType === INDEX_ACTIONS.DOING) {
      await db.task.update({
        where: { id: +taskId },
        data: { status: TASK_STATUS.DOING },
      });
    } else if (actionType === INDEX_ACTIONS.CANCEL) {
      await db.task.update({
        where: { id: +taskId },
        data: { status: TASK_STATUS.PENDING },
      });
    } else if (actionType === INDEX_ACTIONS.DONE) {
      await db.task.update({
        where: { id: +taskId },
        data: { status: TASK_STATUS.DONE },
      });
    } else if (actionType === INDEX_ACTIONS.UPDATE) {
      const title = formData.get("title") as string;
      const description = formData.get("description") as string;
      const priority = parseInt(formData.get("priority") as string);
      const categoryId = parseInt(formData.get("categoryId") as string);
      const dueDate = formData.get("dueDate") as string;
      await db.task.update({
        where: { id: +taskId },
        data: {
          title,
          description,
          priority,
          dueDate: moment(dueDate, "YYYY-MM-DD").isValid() ? moment(dueDate).toISOString() : null,
          category: { connect: { id: categoryId } },
        },
      });
      

      return json({ success: true });
    } else if (actionType === INDEX_ACTIONS.DELETE) {
      await db.task.delete({
        where: { id: +taskId },
      });
    } else if (actionType === INDEX_ACTIONS.CREATE && user) {
      const title = formData.get("title") as string;
      const description = formData.get("description") as string;
      const priority = parseInt(formData.get("priority") as string);
      const categoryId = parseInt(formData.get("categoryId") as string);
      const userId = user.id; 
      await db.task.create({
        data: {
          title,
          description,
          priority,
          status: TASK_STATUS.PENDING,
          ...(categoryId ? { category: { connect: { id: categoryId } } } : {}),
          user: { connect: { id: userId } },
        },
      });

      return json({ success: true });
    } else if (actionType === INDEX_ACTIONS.CREATE_CATEGORY && user) {
      const title = formData.get("title") as string;
      const userId = user.id; 
      await db.category.create({
        data: {
          title,
          user: { connect: { id: userId }}
        },
      });

      return json({ success: true });
    }

    return json({ success: true });
  } catch (error) {
    console.error(error);
    // Customize the status code and message based on the error
    throw new Response("An error occurred", { status: 500 });
  }
};