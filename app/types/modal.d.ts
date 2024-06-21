interface TaskModalProps {
    task: TaskWithCategory | null;
    opened: boolean;
    onClose: () => void;
    isCreate?: boolean;
    categories: { id: number; title: string }[];
  }

interface CategoryModalProps {
  opened: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  currentTitle?: string;
}