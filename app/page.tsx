import auth from "@/utils/auth";
import { redirect } from "next/navigation";

export default async function RootPage() {
  const uid = await auth();
  if (uid === undefined) redirect("/auth/login");
  return <h1>Hello World</h1>;
}
