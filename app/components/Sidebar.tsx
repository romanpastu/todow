import { Box, Input, ScrollArea, Text } from "@mantine/core";
import CreateEditCategoryModal from "./modals/CreateEditCategoryModal";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { IconPlus } from "@tabler/icons-react";
import styles from "~/styles/sidebar.module.css";
import { useNavigate } from "@remix-run/react";

const Sidebar = ({ categories, doneTasks, doingTasks, pendingTasks }: {
    categories: { id: number; title: string }[];
    doneTasks: TaskWithCategory[];
    doingTasks: TaskWithCategory[];
    pendingTasks: TaskWithCategory[];
}) => {
    const [searchQueryCategory, setSearchQueryCategory] = useState("");
    const navigate = useNavigate();
    const [categoryModalOpened, { open: categoryModalOpen, close: categoryModalClose }] = useDisclosure(false);
    return (
        <Box className={styles.sidebar}>
            <CreateEditCategoryModal opened={categoryModalOpened} onClose={categoryModalClose} mode={"create"} />
            <Box className={styles.categoryUtils}>
                <Text size="15px" className={styles.sidebarTitle}>Categories</Text>
                <Input
                    placeholder="Search category"
                    value={searchQueryCategory}
                    onChange={(e) => setSearchQueryCategory(e.currentTarget.value)}
                />
                <IconPlus size={20} style={{
                    cursor: 'pointer',
                }}
                    onClick={categoryModalOpen}
                />

            </Box>
            <ScrollArea className={styles.categoryList}>
                {categories.filter((cat) => cat.title.toLocaleLowerCase().includes(searchQueryCategory.toLowerCase())).map((category) => (
                    <Box
                        key={category.id}
                        onClick={() => navigate(`/category/${category.id}`)}
                        className={styles.categoryItem}
                    >
                        <Text>{category.title} - ({
                            [...doingTasks, ...doneTasks, ...pendingTasks].filter(task => task.category?.id === category.id)?.length
                        })</Text>
                    </Box>
                ))}
            </ScrollArea>
        </Box>
    );
}

export default Sidebar;