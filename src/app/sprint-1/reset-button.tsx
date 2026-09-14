"use client";

import { useTransition } from "react";
import { resetBoard } from "@/app/actions";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export function ResetButton() {
  const [pending, start] = useTransition();
  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="outline" size="lg" disabled={pending} className="h-10 border-navy/60 px-4 text-[15px] font-semibold text-navy" />}>
        {pending ? "Wird zurückgesetzt…" : "↺ Board zurücksetzen"}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="font-serif text-lg text-navy">Board zurücksetzen?</AlertDialogTitle>
          <AlertDialogDescription>
            Alle Aufgaben kehren in ihren ursprünglichen Status zurück. Das gilt für alle, die das Board gerade ansehen.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Abbrechen</AlertDialogCancel>
          <AlertDialogCancel variant="destructive" onClick={() => start(() => resetBoard())}>
            Ja, zurücksetzen
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
