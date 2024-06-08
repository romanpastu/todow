import { Box, Button, Grid, Modal, Text, TextInput, Textarea } from "@mantine/core";
import { TASK_STATUS, getStatusString } from "~/constants/tasks";
import { TaskWithCategory } from "./TaskITem";
import { useState } from "react";
import { useFetcher } from "@remix-run/react";

export default function TaskModal({ task, opened, onClose }: {
    task: TaskWithCategory;
    opened: boolean;
    onClose: () => void;
}) {
    const [title, setTitle] = useState(task?.title || "");
    const [description, setDescription] = useState(task?.description || "");
    const [confirmDelete, setConfirmDelete] = useState(false);
    const fetcher = useFetcher();

    const handleSave = () => {
        fetcher.submit({
            taskId: task.id.toString(),
            title,
            description,
            actionType: "update"
        }, {
            method: "put",
        });
        onClose(); // Close the modal after saving
    };

    const handleDelete = () => {
        fetcher.submit({
            taskId: task.id.toString(),
            actionType: "delete"
        }, {
            method: "delete",
        });
        onClose(); // Close the modal after deleting
    };

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
                            <Text>{getStatusString(task.status)}</Text>
                        </Grid.Col>

                        <Grid.Col span={12}>
                            <Text><strong>Priority:</strong></Text>
                            <Text>{task.priority}</Text>
                        </Grid.Col>

                        <Grid.Col span={12}>
                            <Text><strong>Created At:</strong></Text>
                            <Text>{new Date(task.createdAt).toLocaleString()}</Text>
                        </Grid.Col>

                        <Grid.Col span={12}>
                            <Text><strong>Updated At:</strong></Text>
                            <Text>{new Date(task.updatedAt).toLocaleString()}</Text>
                        </Grid.Col>

                        <Grid.Col span={12}>
                            <Text><strong>Set to Doing/Done At:</strong></Text>
                            <Text>{task.dateSetToDoingDone ? new Date(task.dateSetToDoingDone).toLocaleString() : 'N/A'}</Text>
                        </Grid.Col>

                        <Grid.Col span={12}>
                            <Text><strong>Category:</strong></Text>
                            <Text>{task.category ? task.category.title : 'N/A'}</Text>
                        </Grid.Col>

                        <Grid.Col span={12} style={{ textAlign: 'center' }} >
                            <Box style={{
                                display: "flex",
                                gap: "2vw",
                                justifyContent: "center",
                            }}>
                                <Button onClick={handleSave}>Save</Button>
                                {task?.status === TASK_STATUS.PENDING && <Button onClick={() => setConfirmDelete(true)} style={{
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
