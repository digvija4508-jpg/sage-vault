import AdminClient from "./AdminClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Vault - Sage Protected Downloads",
  description: "Configure files, manage passcodes, and prepare Git releases.",
};

export default function AdminPage() {
  return <AdminClient />;
}
