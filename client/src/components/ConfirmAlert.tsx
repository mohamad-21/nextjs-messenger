import React, { useTransition } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";

type Props = {
  title: string;
  desc?: string;
  actionTitle?: string;
  onAction: Function;
  onClose?: Function;
}

function ConfirmAlert({ title, desc, onAction, onClose, actionTitle }: Props) {
  const [isPending, startTransition] = useTransition();

  return (
    <AlertDialog open onOpenChange={(open) => {
      if (!open) {
        onClose?.();
      }
    }}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {desc && (
            <AlertDialogDescription>
              {desc}
            </AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={isPending} onClick={() => startTransition(() => onAction())}>{actionTitle || "Yes"}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default ConfirmAlert;
