import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div >
      <p>Welcome to todowsssd s d  </p>
      <p>{process.env.NODE_ENV}</p>
    </div>
  );
}
