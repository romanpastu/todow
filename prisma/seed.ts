import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

async function seed() {
  await Promise.all(
    getTasks().map((task) => {
      return db.task.create({ data: task });
    })
  );
}

seed();

function getTasks() {
  return [
    {
        title : "Task 1",
        done : true,
        updatedAt: undefined
    },
    {
        title : "Task 2",
        done : false,
        updatedAt: undefined
    },
    {
        title : "Task 3",
        done : true,
        updatedAt: undefined
    },
    {
        title : "Task 4",
        done : false,
        updatedAt: undefined
    },
    {
        title : "Task 5",
        done : true,
        updatedAt: undefined
    },
    {
        title : "Task 6",
        done : false,
        updatedAt: undefined
    },
    {
        title : "Task 7",
        done : true,
        updatedAt: undefined
    },
    {
        title : "Task 8",
        done : false,
        updatedAt: undefined
    },
    {
        title : "Task 9",
        done : true,
        updatedAt: undefined
    },
    {
        title : "Task 10",
        done : false,
        updatedAt: undefined
    },
]
}