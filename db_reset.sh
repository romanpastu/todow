npx prisma db push //generates the schema
npx ts-node --esm --require tsconfig-paths/register prisma/seed.ts //seeds the database
npx prisma migrate reset //resets the database
check zod for type asserting in database


#Remember, if your database gets messed up, you can always delete the prisma/dev.db file and run npx prisma db push again. Remember to also restart your dev server with npm run dev.