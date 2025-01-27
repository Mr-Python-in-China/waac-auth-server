import { Metadata } from "next";
import SignupClientPage from "./clientPage";

export const metadata: Metadata = {
  title: "注册 - WAAC auth",
};

export default function registerPage() {
  return <SignupClientPage />;
}
