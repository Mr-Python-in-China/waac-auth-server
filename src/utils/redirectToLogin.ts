import { redirect } from "next/navigation";
import "server-only";
export default function redirectToLogin(): never {
  return redirect("/auth/login");
}
