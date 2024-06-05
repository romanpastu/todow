import { Box } from "@mantine/core";
import { json, type MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader = async () => {
  return json({
    taskItems: await db.task.findMany(),
  });
};

export default function Index() {
  const data = useLoaderData<typeof loader>();

  return (
    <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: "100vh" }}>
      <Box style={{
        border: "1px solid #000",
        height: "5vh",
        width: "70vw",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',

      }}>
        <p>No Weekly Task Selected</p>
      </Box>

      <Box style={{
        width: "70vw",
        overflowY: "scroll",
        flex: 1,
        boxSizing: 'border-box'
      }}>
        {data.taskItems.map((task) => (
          <Box key={task.id}
            style={{
              border: "1px solid #000",
              width: "100%",
            }}>
            {task.title}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
