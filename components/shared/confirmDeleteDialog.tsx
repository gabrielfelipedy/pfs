"use client";

import { useActionState, useState, useEffect } from "react";
import { Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { toast } from "sonner";
import { deleteOperationAction } from "@/actions/operation-actions";
import { OperationActionState } from "@/actions/definitions";
import { useRouter } from "next/navigation";

interface Props {
  id: number | undefined;
}

export default function ConfirmDeleteDialog({ id }: Props) {
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

      router.refresh()

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
    <Dialog key={id} open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">
          <Trash />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-106.25">
        <form action={deleteOperationAc}>
          <DialogHeader>
            <DialogTitle>Você tem certeza?</DialogTitle>
            <DialogDescription>Confirme a deleção</DialogDescription>
          </DialogHeader>

          <input type="hidden" name="id" value={id} />

          <DialogFooter className="mt-12">
            <DialogClose asChild>
              <Button className="w-1/2" variant="outline">
                Cancelar
              </Button>
            </DialogClose>

            <Button variant="destructive" className="w-1/2" disabled={pending}>
              {pending ? "Deletando" : "Deletar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
