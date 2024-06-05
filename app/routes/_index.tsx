import { Box, Button, ScrollArea, Text } from "@mantine/core";
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
          height: '5vh',
          width: '70vw',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text>No Weekly Task Selected</Text>
      </Box>

      <ScrollArea
        style={{
          width: '70vw',
          flex: 1,
        }}
      >
        {data.taskItems.map((task) => (
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
              <Button>Set weekly</Button>
            </Box>
          </Box>
        ))}
      </ScrollArea>
    </Box>
  );
}
