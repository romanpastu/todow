import { isRouteErrorResponse, useLoaderData, useNavigate, useRouteError } from "@remix-run/react";
import TaskList from "~/components/TaskList";
import { Box, Button, Input, Text } from "@mantine/core";
import { useState } from "react";
import styles from "~/styles/page-list.module.css";
import { convertTaskDates } from "~/utils/helpers";
import { loader as completedLoader } from "../data-layer/loaders/completed.loader"; 

export const loader = async ({ request }: { request: Request }) => completedLoader({ request });
export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export default function CompletedRoute() {
  const data = useLoaderData<CompletedIndexLoader>();
  const completedTasks = data.completedTasks.map(convertTaskDates);
  const [searchQuery, setSearchQuery] = useState("");
  const filteredCompletedTasks = completedTasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const navigate = useNavigate();

  return (
    <Box className={styles.container}>
      <Text size="50px" className={styles.header}>Completed Tasks</Text>
      <Box className={styles.searchContainer}>
        <Input
          placeholder="Search task"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.currentTarget.value)}
        />
        <Button onClick={() => navigate("/")}>Go back</Button>
      </Box>
      <TaskList tasks={filteredCompletedTasks} categories={data.categories}/>
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
