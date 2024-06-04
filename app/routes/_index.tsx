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
    jokeListItems: await db.task.findMany(),
  });
};

export default function Index() {
  const data = useLoaderData<typeof loader>();
  
  return (
    <div >
      <p>Welcome to todowsssd s d  </p>
      <p>{process.env.NODE_ENV}</p>
      {data?.jokeListItems.map((joke) => (
        <div key={joke.id}>
          <h2>{joke.title}</h2>
          <p>{joke.done ? "Done" : "Not done"}</p>
      </div>
      ))}
    </div>
  );
}
