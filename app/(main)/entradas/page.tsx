import { redirect } from "next/navigation";

export default function EntradasRedirect() {
  redirect("/operations?tab=entradas");
}
