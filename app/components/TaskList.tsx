// components/TaskList.tsx
import { Box , Text} from "@mantine/core";
import type { Task } from "@prisma/client";
import TaskItem from "./TaskITem";


interface TaskListProps {
  tasks: Task[];
}

const TaskList: React.FC<TaskListProps> = ({ tasks } : {
    tasks: Task[];
}) => {
  return tasks.length === 0 ? (
    <Box
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        border: "1px solid black",
        padding: "8px",
        width: "65vw",
      }}
    >
      <Text>Weekly tasks</Text>
    </Box>
  ) : (
    tasks.map((task) => <TaskItem key={task.id} task={task} />)
  );
};

export default TaskList;
