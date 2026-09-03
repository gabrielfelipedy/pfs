"use client";

import { useEffect } from "react";
import { Copy } from "lucide-react";
import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

import { toast } from "sonner";
import { duplicateOperationAction } from "@/actions/operation-actions";
import { OperationActionState } from "@/actions/definitions";
import { Operation } from "@/lib/definitions";
import { useOperations } from "../operations/OperationsProvider";

interface Props {
  operation: Operation;
}

export default function DuplicateOperationButton({ operation }: Props) {
  const [state, formAction, pending] = useActionState<
    OperationActionState | undefined,
    FormData
  >(duplicateOperationAction, undefined);

  const { refresh } = useOperations();

  useEffect(() => {
    if (state && state.success) {
      toast.success(state.message);
      refresh();
    } else {
      if (state && state.message) {
        toast.error(state.message);
      }
    }
  }, [state, refresh]);

  return (
    <form action={formAction}>
      <input type="hidden" name="id" value={operation.id} />
      <Button type="submit" variant="outline" disabled={pending}>
        {pending && <Spinner />}
        {!pending && <Copy />}
      </Button>
    </form>
  );
}
