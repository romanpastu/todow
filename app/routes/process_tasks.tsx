//"https://your-remix-app.com/process_tasks?secret=your_secret_key"
import { Task } from "@prisma/client";
import { LoaderFunction } from "@remix-run/node";
import { TASK_STATUS } from "~/constants/tasks";
import { db } from "~/utils/db.server";


export const loader: LoaderFunction = async ({ request }) => {
    const url = new URL(request.url);
    const secretKey = url.searchParams.get("secret");

    if (secretKey !== process.env.PROCESS_TASKS_SECRET) {
        return new Response("Unauthorized", { status: 401 });
    }
    let doneTasks
    try {
        doneTasks = await db.task.findMany({
            where: { status: TASK_STATUS.DONE },
            include: { category: true },
        });
    } catch (err) {
        console.error(err);
        return new Response("An error occurred", { status: 500 });
    }

    const errTasks: Task[] = [];
    const successTasks: Task[]= [];
    for (const task of doneTasks) {
        try {
            await setTaskToFinished(task);
            successTasks.push(task);
        } catch (err) {
            errTasks.push(task);
        }
    }

    if (errTasks?.length === 0) {
        const successTaskIds = successTasks.map((task) => task.id);
        return new Response(`Tasks processed successfully ${successTaskIds?.join()}`, { status: 200 });
    } else {
        const errTaskIds = errTasks.map((task) => task.id);
        return new Response(`Some tasks failed to process ${errTaskIds?.join()}`, { status: 500 });
    }
};


async function setTaskToFinished(task: Task) {
    // Your task processing logic goes here.
    await db.task.update({
        where: { id: task.id },
        data: { status: TASK_STATUS.FINISHED },
    });

}
