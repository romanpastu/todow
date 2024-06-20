import { Box, Button, Grid, Modal, Select, Text, TextInput, Textarea } from "@mantine/core";
import { TASK_STATUS, getPrioritiesMap, getStatusString } from "~/constants/tasks";
import { TaskWithCategory } from "./TaskITem";
import { useState, useEffect } from "react";
import { useFetcher } from "@remix-run/react";

export default function TaskModal({ task, opened, onClose, isCreate, categories }: {
  task: TaskWithCategory | null;
  opened: boolean;
  onClose: () => void;
  isCreate?: boolean;
  categories: { id: number; title: string }[];
}) {
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [priority, setPriority] = useState(task?.priority?.toString());
  const [category, setCategory] = useState(task?.category?.id.toString() || "");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const fetcher = useFetcher();

  useEffect(() => {
    if (opened) {
      setTitle(task?.title || "");
      setDescription(task?.description || "");
      setPriority(task?.priority?.toString());
      setCategory(task?.category?.id.toString() || "");
    }
  }, [task, opened]);

  const handleUpdate = () => {
    if (task) {
      fetcher.submit({
        taskId: task.id.toString(),
        title,
        description,
        priority: priority || "",
        categoryId: +category || "",
        actionType: "update"
      }, {
        method: "put",
      });
      onClose(); // Close the modal after saving
    }
  };

  const handleDelete = () => {
    if (task) {
      fetcher.submit({
        taskId: task.id.toString(),
        actionType: "delete"
      }, {
        method: "delete",
      });
      onClose(); // Close the modal after deleting
    }
  };

  const handleCreate = () => {
    fetcher.submit({
      title,
      description,
      priority: priority || 3,
      status: TASK_STATUS.PENDING,
      categoryId: category,
      actionType: "create"
    }, {
      method: "post",
    });
    onClose(); // Close the modal after creating
  };

  const prioritiesMap = getPrioritiesMap();

  return (
    <>
      <Modal opened={opened} onClose={onClose} size="70vw">
        <Box>
          <Grid>
            <Grid.Col span={12}>
              <Text><strong>Title:</strong></Text>
              <TextInput value={title} onChange={(e) => setTitle(e.currentTarget.value)} />
            </Grid.Col>

            <Grid.Col span={12}>
              <Text><strong>Description:</strong></Text>
              <Textarea value={description} onChange={(e) => setDescription(e.currentTarget.value)} autosize resize="both" />
            </Grid.Col>

            <Grid.Col span={12}>
              <Text><strong>Status:</strong></Text>
              <Text>{task && getStatusString(task.status)}</Text>
            </Grid.Col>

            <Grid.Col span={12}>
              <Text><strong>Priority:</strong></Text>
              <Select
                value={priority}
                onChange={(e) => setPriority(e || "")}
                data={Object.entries(prioritiesMap).map(([value, label]) => ({
                  value,
                  label,
                }))}
              />
            </Grid.Col>

            <Grid.Col span={12}>
              <Text><strong>Created At:</strong></Text>
              <Text>{task && new Date(task.createdAt).toLocaleString()}</Text>
            </Grid.Col>

            <Grid.Col span={12}>
              <Text><strong>Updated At:</strong></Text>
              <Text>{task && new Date(task.updatedAt).toLocaleString()}</Text>
            </Grid.Col>

            <Grid.Col span={12}>
              <Text><strong>Set to Doing/Done At:</strong></Text>
              <Text>{task && task.dateSetToDoingDone ? new Date(task.dateSetToDoingDone).toLocaleString() : 'N/A'}</Text>
            </Grid.Col>

            <Grid.Col span={12}>
              <Text><strong>Category:</strong></Text>
              <Select
                value={category}
                onChange={(e) => setCategory(e || "")}
                data={categories.map((category) => ({
                  value: category.id.toString(),
                  label: category.title,
                }))}
              />
            </Grid.Col>

            <Grid.Col span={12} style={{ textAlign: 'center' }} >
              <Box style={{
                display: "flex",
                gap: "2vw",
                justifyContent: "center",
              }}>
                {isCreate ?
                  <Button onClick={handleCreate}>Create</Button>
                  :
                  <Button onClick={handleUpdate}>Save</Button>}
                {(task?.status === TASK_STATUS.PENDING || task?.status === TASK_STATUS.FINISHED) && <Button onClick={() => setConfirmDelete(true)} style={{
                  backgroundColor: "red",
                }}>Delete</Button>}
              </Box>
            </Grid.Col>
          </Grid>
        </Box>
      </Modal>

      {/* Confirmation Modal */}
      <Modal
        opened={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        title="Confirm Deletion"
      >
        <Text>Are you sure you want to delete this task?</Text>
        <Box style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
          <Button onClick={() => setConfirmDelete(false)}>Cancel</Button>
          <Button
            onClick={handleDelete}
            style={{ backgroundColor: 'red' }}
          >
            Confirm
          </Button>
        </Box>
      </Modal>
    </>
  );
}
