import { useLoaderData, useNavigate, useFetcher, useRouteError, isRouteErrorResponse } from "@remix-run/react";
import { Box, Button, Input, Text } from "@mantine/core";
import { useState } from "react";
import TaskList from "~/components/TaskList";
import styles from "~/styles/page-list.module.css";
import { convertTaskDates } from "~/utils/helpers";
import { IconPencil } from "@tabler/icons-react";
import CreateEditCategoryModal from "~/components/modals/CreateEditCategoryModal";
import { useDisclosure } from "@mantine/hooks";
import { loader as categoryIdLoader } from "../data-layer/loaders/category.id.loader";
import { action as categoryIdAction } from "../data-layer/actions/category.id.action";

export const loader = categoryIdLoader;
export const action = categoryIdAction;

export default function CategoryRoute() {
  const data = useLoaderData<CategoryIdIndexLoader>();
  const categoryTasks = data.tasks.map(convertTaskDates);
  const category = data.category;
  const [searchQuery, setSearchQuery] = useState("");
  const filteredCategoryTasks = categoryTasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const [categoryModalOpened, { open: categoryModalOpen, close: categoryModalClose }] = useDisclosure(false);

  return (
    <Box className={styles.container}>
      <CreateEditCategoryModal opened={categoryModalOpened} onClose={categoryModalClose} mode={"edit"} currentTitle={
        category?.title
      }
      />
      <Box style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "10px",
      }}>
        <Text size="50px" className={styles.header}>Tasks for category: {category?.title}</Text>
        <IconPencil size="30px" className={styles.header} style={{
          cursor: "pointer",
        }}
          onClick={categoryModalOpen}
        />
      </Box>

      <Box className={styles.searchContainer}>
        <Input
          placeholder="Search task"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.currentTarget.value)}
        />
        <Button onClick={() => navigate("/")}>Go back</Button>
        <fetcher.Form method="post">
          <input type="hidden" name="categoryId" value={category.id} />
          <input type="hidden" name="actionType" value="" />
          <Button color="red" type="submit">Delete Category</Button>
        </fetcher.Form>
      </Box>
      <TaskList tasks={filteredCategoryTasks} categories={data.categories} />
    </Box>
  );
}
export function ErrorBoundary() {

  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div className="error-container">
        There was an error loading the page. Sorry.
      </div>
    );
  }

  return (
    <div className="error-container">
        There was an error loading the page. Sorry.
      </div>
  );
}
