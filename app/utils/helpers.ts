

export const convertTaskDates = (task: TaskWithCategoryJson): TaskWithCategory => {
  return {
    id: task.id,
    title: task.title,
    status: task.status,
    createdAt: new Date(task.createdAt),
    createdBy: task.createdBy,
    updatedAt: new Date(task.updatedAt),
    dueDate: task.dueDate ? new Date(task.dueDate) : null,
    priority: task.priority,
    categoryId: task.categoryId,
    description: task.description,
    dateSetToDoingDone: task.dateSetToDoingDone ? new Date(task.dateSetToDoingDone) : null,
    category: task.category
      ? {
          id: task.category.id,
          title: task.category.title,
          createdAt: new Date(task.category.createdAt),
          updatedAt: new Date(task.category.updatedAt),
          createdBy: task.category.createdBy
        }
      : undefined,
  };
};
