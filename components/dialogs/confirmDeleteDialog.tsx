"use client";

import { useActionState, useState, useEffect } from "react";
import { Trash } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { toast } from "sonner";
import { deleteOperationAction } from "@/actions/operation-actions";
import { OperationActionState } from "@/actions/definitions";
import { useRouter } from "next/navigation";
import { Spinner } from "../ui/spinner";
import { Operation } from "@/lib/definitions";
import { formatter } from "@/lib/utils";

interface Props {
  operation: Operation;
}

export default function ConfirmDeleteDialog({ operation }: Props) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const [state, deleteOperationAc, pending] = useActionState<
    OperationActionState | undefined,
    FormData
  >(deleteOperationAction, undefined);

  const router = useRouter();

  useEffect(() => {
    if (state && state.success) {
      console.log("Action successful, closing dialog.");
      toast.success(state.message);

      router.refresh();

      setTimeout(() => {
        setDialogOpen(false);
      }, 0);
    } else {
      if (state && state.message) {
        toast.error(state.message);
      }
    }
  }, [state, router]);

  return (
    <AlertDialog key={operation.id} open={dialogOpen} onOpenChange={setDialogOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">
          <Trash />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-106.25">
        <form action={deleteOperationAc}>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirme a deleção</AlertDialogTitle>
                        <AlertDialogDescription>Deletando a transação {operation.name} de {formatter.format((operation.value ?? 0) / 100)}</AlertDialogDescription>
          </AlertDialogHeader>

          <input type="hidden" name="id" value={operation.id} />

          <AlertDialogFooter className="mt-12">
            <AlertDialogCancel className="w-1/2" asChild>
              <Button variant="outline">
                Cancelar
              </Button>
            </AlertDialogCancel>

          <AlertDialogAction className="w-1/2 p-0">
            <Button variant="destructive" className="w-full" disabled={pending}>
              {pending && <Spinner />}
              {pending ? "Deletando" : "Deletar"}
            </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}