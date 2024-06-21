import { Box, ScrollArea, Button, Input, Text } from "@mantine/core";
import { useState } from "react";
import { useLoaderData } from "@remix-run/react";
import TaskList from "~/components/TaskList";
import { useDisclosure } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";
import styles from "~/styles/index.module.css"; 
import { convertTaskDates } from "~/utils/helpers";
import { IconPlus } from "@tabler/icons-react";
import CreateEditCategoryModal from "~/components/modals/CreateEditCategoryModal";
import TaskModal from "~/components/modals/TaskModal";
import { loader as indexLoader } from "../data-layer/loaders/index.loader"; 
import { action as indexAction } from "../data-layer/actions/index.action"; 

export const loader = indexLoader; 
export const action = indexAction; 

export default function Index() {
  const data = useLoaderData<IndexLoader>();

  const doingTasks = data.doingTasks.map(convertTaskDates);
  const doneTasks = data.doneTasks.map(convertTaskDates);
  const pendingTasks = data.pendingTasks.map(convertTaskDates);
  const categories = data.categories;
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQueryCategory, setSearchQueryCategory] = useState("");

  const filteredPendingTasks = pendingTasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  ).//sort by dueDate
    sort((a, b) => {
      if (a.dueDate && b.dueDate) {
        return a.dueDate.getTime() - b.dueDate.getTime();
      }
      return 0;
    });

  const [opened, { open, close }] = useDisclosure(false);
  const [categoryModalOpened, { open: categoryModalOpen, close: categoryModalClose }] = useDisclosure(false);
  const navigate = useNavigate();

  return (
    <Box className={styles.container}>
      <Box className={styles.sidebar}>
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
      <TaskModal task={null} opened={opened} onClose={close} isCreate={true} categories={categories} />
      <CreateEditCategoryModal opened={categoryModalOpened} onClose={categoryModalClose} mode={"create"} />
      <Box className={styles.main}>
        <ScrollArea className={styles.doingDoneTasks}>
          <Box className={styles.taskListContainer}>
            <TaskList tasks={[...doingTasks, ...doneTasks]} categories={categories} />
          </Box>
        </ScrollArea>
        <Box className={styles.controls}>
          <Box className={styles.controlGroup}>
            <Button onClick={open}>Create new Task</Button>
            <Input
              placeholder="Search task"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.currentTarget.value)}
            />
            <Button onClick={() => navigate('/completed')}>GoTo Completed Tasks</Button>
          </Box>
        </Box>
        <ScrollArea className={styles.pendingTasks}>
          <Box className={styles.taskListContainer}>
            <TaskList tasks={filteredPendingTasks} categories={categories} />
          </Box>
        </ScrollArea>
      </Box>
      <Box className={styles.rightSpace}></Box>
    </Box>
  );

  
}
