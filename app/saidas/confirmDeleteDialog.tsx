"use client";

import { useActionState, useState, useEffect } from "react";
import { ChevronDownIcon } from "lucide-react";

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

import { deleteOperation, SaidaActionState, updateSaida } from "./actions";
import { toast } from "sonner";


interface Props {
  id: number | undefined;
}

export default function ConfirmDeleteDialog({id}: Props) {


  const [dialogOpen, setDialogOpen] = useState(false);

  const [state, deleteOperationAction, pending] = useActionState<SaidaActionState | undefined, FormData>(
    deleteOperation,
    undefined
  );

  useEffect(() => {
    if (state && state.success) {
      console.log('Action successful, closing dialog.');
      toast.success(state.message);
      setTimeout(() => {
      setDialogOpen(false);
    }, 0);
    }
    else{
      if(state && state.message){
        toast.error(state.message);
      }
    }
  }, [state]);

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">Deletar</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form action={deleteOperationAction}>
          <DialogHeader>
            <DialogTitle>Você tem certeza?</DialogTitle>
            <DialogDescription>
              Confirme a deleção
            </DialogDescription>
          </DialogHeader>

          <input type="hidden" name="id" value={id} />

          
          <DialogFooter className="mt-12">
            <DialogClose asChild>
              <Button className="w-1/2" variant="outline">Cancelar</Button>
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