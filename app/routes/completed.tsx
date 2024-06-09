import { json, useLoaderData, useNavigate } from "@remix-run/react";
import TaskList from "~/components/TaskList";
import { TASK_STATUS } from "~/constants/tasks";
import { db } from "~/utils/db.server";
import { TaskWithCategoryJson, convertTaskDates } from "./_index";
import { Box, Button, Input, Text } from "@mantine/core";
import { useState } from "react";

export const loader = async () => {
    const completedTasks = await db.task.findMany({ where: { status: TASK_STATUS.FINISHED }, orderBy: { priority: 'asc' }, include: { category: true } });

    return json({
        completedTasks,
    });
};
export default function CompletedRoute() {
    const data = useLoaderData<{ completedTasks: TaskWithCategoryJson[] }>();

    const completedTasks = data.completedTasks.map(convertTaskDates);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredCompletedTasks = completedTasks.filter((task) =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const navigate = useNavigate();
    return (
        <Box style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            height: '100vh',
            width: '100vw'

        }}>
            <Text size="50px" style={{
                marginBottom: '20px'
            }}>Completed Tasks</Text>
            <Box style={{
                display: 'flex',
                flexDirection: 'row',
                gap: '20px',
                justifyContent: 'center',
                width: '65vw'
            }}>

                <Input
                    placeholder="Search task"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.currentTarget.value)}
                    style={{
                        marginBottom: '20px'
                    }}
                />
                <Button onClick={() => navigate("/")}>Go back</Button>
            </Box>

            <TaskList tasks={filteredCompletedTasks} />
        </Box>
    );


}