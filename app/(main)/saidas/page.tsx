import { redirect } from "next/navigation";

export default function SaidasRedirect() {
  redirect("/dashboard?tab=saidas");
}
