import { TaskWithCategory } from "~/components/TaskITem";
import { TaskWithCategoryJson } from "~/routes/_index";

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
          createdBy: task.category.createdBy
        }
        : undefined,
    };
  };
  