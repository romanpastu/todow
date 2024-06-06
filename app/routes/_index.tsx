import { Box, ScrollArea, Text } from "@mantine/core";
import { json, type MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { TASK_STATUS } from "~/constants/tasks";
import { db } from "~/utils/db.server";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader = async () => {
  const pendingTasks = await db.task.findMany({ where: { status: TASK_STATUS.PENDING } });
  const doingTasks = await db.task.findMany({ where: { status: TASK_STATUS.DOING } });
  const doneTasks = await db.task.findMany({ where: { status: TASK_STATUS.DONE } });

  return json({
    pendingTasks,
    doingTasks,
    doneTasks,
  });
};



export default function Index() {
  const data = useLoaderData<typeof loader>();
  return (
    <Box
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <Box
        style={{
          border: '1px solid #000',
          width: '70vw',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: "column"
        }}
      >
        {
          [...data.doingTasks, ...data.doneTasks].length === 0 ?
            (
              <Box style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', border: "1px solid black", padding: "8px", width: "65vw" }}>
                <Text>Weekly tasks</Text>
              </Box>
            )
            :
            (
              [...data.doingTasks, ...data.doneTasks].map((task) => (
                <Box key={task.id} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', border: "1px solid black", padding: "8px", width: "65vw", marginTop: '4px', marginBottom: "4px" }}>
                  <Text>{task.title}</Text>
                </Box>
              ))
            )
        }

      </Box>

      <ScrollArea
        style={{
          width: '70vw',
          flex: 1,
        }}
      >
        {data.pendingTasks.map((task) => (
          <Box
            key={task.id}
            style={{
              border: '1px solid #000',
              width: '100%',
              marginTop: '8px',
            }}
          >
            <Box style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: '8px' }}>
              <Text>{task.title}</Text>
            </Box>
          </Box>
        ))}
      </ScrollArea>
    </Box>
  );
}
