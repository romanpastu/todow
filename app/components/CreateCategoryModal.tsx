import { Box, Button, Input, Modal, Text } from "@mantine/core";
import { useFetcher } from "@remix-run/react";
import { useState } from "react";

export default function CreateCategoryModal({ opened, onClose }: {
    opened: boolean;
    onClose: () => void;
}) {
    const [title, setTitle] = useState("");
    const fetcher = useFetcher();

    const handleCreate = () => {
        fetcher.submit({
            title,
            actionType: "createCategory"
        }, {
            method: "post",
        });
        onClose(); // Close the modal after creating
    }

    return (
        <Modal opened={opened} onClose={onClose}>
            <Box style={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
            }}>
                <Text size="20px">Create Category</Text>
                <Input
                    placeholder="Category Name"
                    value={title}
                    onChange={(e) => setTitle(e.currentTarget.value)}
                />
                <Button onClick={handleCreate}>Create</Button>
            </Box>
        </Modal>
    );
}
