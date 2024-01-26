"use client";

import React from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { removeUser } from "@/actions/user";
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
} from "@/components/ui/alert-dialog";
import EditUserForm from "./EditUserForm";

const Actions = ({ userId, role, user }: { userId: string; role: any, user: any }) => {
  const remove = async (userId: any) => {
    if (role == "ADMIN") {
      await removeUser(userId);

      toast.success("User removed");
    } else {
      toast.error("You are not an admin");
    }
  };

  return (
    <>
      <Button onClick={() => remove(userId)}>حذف</Button>
      <AlertDialog>
        <AlertDialogTrigger>
          <Button>تحرير</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center font-semibold text-2xl">
            تحرير المستخدم
            </AlertDialogTitle>
          </AlertDialogHeader>
          <EditUserForm role={role} user={user} />
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Actions;
