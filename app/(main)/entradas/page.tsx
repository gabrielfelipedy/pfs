import { redirect } from "next/navigation";

export default function EntradasRedirect() {
  redirect("/dashboard?tab=entradas");
}
