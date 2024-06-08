import { Box, Grid, Modal, Text } from "@mantine/core";
import { Task } from "@prisma/client";
import { getStatusString } from "~/constants/tasks";

export default function TaskModal({ task, opened, onClose }: {
    task: Task;
    opened: boolean;
    onClose: () => void;
}) {

    return (
      <Modal opened={opened} onClose={onClose} title={task.title}>
        <Box>
          <Grid>
            <Grid.Col span={6}>
              <Text><strong>Description:</strong></Text>
            </Grid.Col>
            <Grid.Col span={6}>
              <Text>{task.description}</Text>
            </Grid.Col>
  
            <Grid.Col span={6}>
              <Text><strong>Status:</strong></Text>
            </Grid.Col>
            <Grid.Col span={6}>
              <Text>{getStatusString(task.status)}</Text>
            </Grid.Col>
  
            <Grid.Col span={6}>
              <Text><strong>Priority:</strong></Text>
            </Grid.Col>
            <Grid.Col span={6}>
              <Text>{task.priority}</Text>
            </Grid.Col>
  
            <Grid.Col span={6}>
              <Text><strong>Created At:</strong></Text>
            </Grid.Col>
            <Grid.Col span={6}>
              <Text>{new Date(task.createdAt).toLocaleString()}</Text>
            </Grid.Col>
  
            <Grid.Col span={6}>
              <Text><strong>Updated At:</strong></Text>
            </Grid.Col>
            <Grid.Col span={6}>
              <Text>{new Date(task.updatedAt).toLocaleString()}</Text>
            </Grid.Col>
  
            <Grid.Col span={6}>
              <Text><strong>Set to Doing/Done At:</strong></Text>
            </Grid.Col>
            <Grid.Col span={6}>
              <Text>{task.dateSetToDoingDone ? new Date(task.dateSetToDoingDone).toLocaleString() : 'N/A'}</Text>
            </Grid.Col>
            
            <Grid.Col span={6}>
              <Text><strong>Category:</strong></Text>
            </Grid.Col>
            {/* <Grid.Col span={6}>
              <Text>{task.category ? task.category.name : 'N/A'}</Text>
            </Grid.Col>
   */}
            
          </Grid>
        </Box>
      </Modal>
    );
  }
  