"use client";

import { useEffect } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { moveOperationAction } from "@/actions/operation-actions";
import { OperationActionState } from "@/actions/definitions";

interface Props {
  operationId: number;
  neighborId: number;
  direction: "up" | "down";
  disabled?: boolean;
}

export default function MoveOperationButton({
  operationId,
  neighborId,
  direction,
  disabled,
}: Props) {
  const [state, formAction, pending] = useActionState<
    OperationActionState | undefined,
    FormData
  >(moveOperationAction, undefined);

  const router = useRouter();

  useEffect(() => {
    if (state && state.success) {
      toast.success(state.message);
      router.refresh();
    } else {
      if (state && state.message) {
        toast.error(state.message);
      }
    }
  }, [state, router]);

  return (
    <form action={formAction}>
      <input type="hidden" name="id" value={operationId} />
      <input type="hidden" name="neighborId" value={neighborId} />
      <Button
        type="submit"
        variant="outline"
        size="icon"
        disabled={disabled || pending}
        title={direction === "up" ? "Mover para cima" : "Mover para baixo"}
      >
        {pending ? <Spinner /> : direction === "up" ? <ArrowUp /> : <ArrowDown />}
      </Button>
    </form>
  );
}
