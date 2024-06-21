type IndexLoader = {
    pendingTasks: TaskWithCategoryJson[];
    doingTasks: TaskWithCategoryJson[];
    doneTasks: TaskWithCategoryJson[];
    categories: { id: number; title: string }[];
  }

type CategoryIdIndexLoader = { tasks: TaskWithCategoryJson[], category: Category, categories: Category[] }

type CompletedIndexLoader = { completedTasks: TaskWithCategoryJson[], categories: Category[] }