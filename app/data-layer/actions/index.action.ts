import { json } from "@remix-run/react";
import { INDEX_ACTIONS } from "~/constants/loader-actions/index-actions";
import { TASK_STATUS } from "~/constants/tasks";
import { db } from "~/utils/db.server";
export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const taskId = formData.get("taskId") as string;
  const actionType = formData.get("actionType") as string;
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
        dueDate: dueDate ? new Date(dueDate) : null,
        category: { connect: { id: categoryId } },
      },
    });

    return json({ success: true });
  } else if (actionType === INDEX_ACTIONS.DELETE) {
    await db.task.delete({
      where: { id: +taskId },
    });
  } else if (actionType === INDEX_ACTIONS.CREATE) {
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
  } else if (actionType === INDEX_ACTIONS.CREATE_CATEGORY) {
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