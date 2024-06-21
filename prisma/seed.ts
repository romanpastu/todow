import { PrismaClient, User, Category } from "@prisma/client";
const db = new PrismaClient();

async function seed() {
//   await db.user.deleteMany();
//   await db.category.deleteMany();
//   await db.task.deleteMany();

  const users = await Promise.all(
    getUsers().map((user) => {
      return db.user.create({ data: user });
    })
  );

  const categories = await Promise.all(
    getCategory(users).map((category) => {
      return db.category.create({ data: category });
    })
  );

  await Promise.all(
    getTasks(users, categories).map((task) => {
      return db.task.create({ data: task });
    })
  );
}



function getTasks(users: User[], categories: Category[]) {
  return [
    {
      title: "Task 1",
      createdBy: users[0].id,
      priority: 1,
      categoryId: categories[0].id,
      status: 1,
      dueDate: new Date("2025-10-10T00:00:00.000Z")
    },
    {
      title: "Task 2",
      createdBy: users[1].id,
      priority: 2,
      categoryId: categories[1].id,
      status: 1
    },
    {
      title: "Task 3",
      createdBy: users[0].id,
      priority: 3,
      categoryId: categories[1].id,
      status: 1
    },
    {
      title: "Task 4",
      createdBy: users[0].id,
      priority: 1,
      categoryId: categories[0].id,
      status: 2,
    },
    {
      title: "Task 5",
      createdBy: users[1].id,
      priority: 2,
      categoryId: categories[1].id,
      status: 2
    },
    {
      title: "Task 6",
      createdBy: users[0].id,
      priority: 3,
      categoryId: categories[1].id,
      status: 3
    },
    {
      title: "Task 7",
      createdBy: users[0].id,
      priority: 3,
      categoryId: categories[1].id,
      status: 3
    },
    {
      title: "Task 8",
      createdBy: users[0].id,
      priority: 3,
      categoryId: categories[1].id,
      status: 4
    },
    {
      title: "Task 9",
      createdBy: users[0].id,
      priority: 3,
      categoryId: categories[1].id,
      status: 4
    },
    {
      title: "Task 10",
      createdBy: users[0].id,
      priority: 3,
      categoryId: categories[1].id,
      status: 5
    },
    {
      title: "Task 11",
      createdBy: users[0].id,
      priority: 3,
      categoryId: categories[1].id,
      status: 5
    },
  ];
}

const getUsers = (): Omit<User, "id" | "createdAt" | "updatedAt">[] => {
  return [
    {
      email: "user1@example.com",
      name: "User One",
      password: "password1",
    },
    {
      email: "user2@example.com",
      name: "User Two",
      password: "password2",
    },
  ];
};

const getCategory = (users: User[]): Omit<Category, "id" | "createdAt" | "updatedAt">[] => {
  return [
    {
      title: "Category 1",
      createdBy: users[0].id,
    },
    {
      title: "Category 2",
      createdBy: users[0].id,
    },
  ];
};

seed();