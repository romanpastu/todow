import { Box, Button, Input, Modal, Text } from "@mantine/core";
import { useFetcher } from "@remix-run/react";
import { useState } from "react";
import { CATEGORY_ID_ACTIONS } from "~/constants/loader-actions/category-id-actions";
import { INDEX_ACTIONS } from "~/constants/loader-actions/index-actions";

export default function CreateEditCategoryModal({ opened, onClose, mode , currentTitle}: CategoryModalProps) {
    const [title, setTitle] = useState(currentTitle ?? "");
    const fetcher = useFetcher();

    const handleCreate = () => {
        fetcher.submit({
            title,
            actionType: INDEX_ACTIONS.CREATE_CATEGORY
        }, {
            method: "post",
        });
        onClose(); // Close the modal after creating
    }

    const handleEdit = () => {
        fetcher.submit({
            title,
            actionType: CATEGORY_ID_ACTIONS.EDIT_CATEGORY
        }, {
            method: "post",
        });
        onClose(); // Close the modal after editing
    }

    const modalTitle = mode === "edit" ? "Edit Category" : "Create Category";
    const buttonText = mode === "edit" ? "Edit" : "Create";
    return (
        <Modal opened={opened} onClose={onClose}>
            <Box style={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
            }}>
                <Text size="20px">{modalTitle}</Text>
                <Input
                    placeholder="Category Name"
                    value={title}
                    onChange={(e) => setTitle(e.currentTarget.value)}
                />
                <Button onClick={
                    mode === "create" ? handleCreate : handleEdit
                }>{buttonText}</Button>
            </Box>
        </Modal>
    );
}
