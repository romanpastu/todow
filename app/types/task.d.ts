type TaskWithCategoryJson = Omit<TaskWithCategory, "createdAt" | "updatedAt" | "dateSetToDoingDone" | "dueDate" | "category"> & {
    createdAt: string;
    updatedAt: string;
    dueDate: string | null;
    dateSetToDoingDone: string | null;
    category: {
      id: number;
      title: string;
      createdAt: string;
      updatedAt: string;
      createdBy: number;
    } | null;
  };

  type TaskWithCategory = Task & {
    category?: Category
  };