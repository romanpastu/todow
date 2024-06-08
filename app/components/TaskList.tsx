import { Box , Text} from "@mantine/core";
import TaskItem, { TaskWithCategory } from "./TaskITem";


interface TaskListProps {
  tasks: TaskWithCategory[];
}

const TaskList: React.FC<TaskListProps> = ({ tasks } : {
    tasks: TaskWithCategory[];
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
