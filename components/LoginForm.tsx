"use client";
import { formSchema } from "@/lib";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState, useTransition } from "react";
import login from "@/actions/login.action";
import { FormError } from "./formError";
import { FormSuccess } from "./FormSuccess";
import Link from "next/link";

const LoginForm = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: ""
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setError("");
    setSuccess("");

    startTransition(() => {
      login(values).then((data) => {
        setError(data.error);
        setSuccess(data.success);
      });
    });
  }

  return (
    <div className="w-[450px] border p-8 bg-slate-100 rounded-lg shadow-lg">
      <h1 className="text-center text-2xl font-semibold text-sky-800">انشئ حساب جديد</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>الإسم</FormLabel>
                <FormControl>
                  <Input disabled={isPending} placeholder="ادخل اسمك هنا" {...field} />
                </FormControl>
                <FormDescription>
                هذا هو إسم العرض الخاص بك.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>إيميل</FormLabel>
                <FormControl>
                  <Input disabled={isPending} placeholder="ادخل ايميلك هنا" {...field} />
                </FormControl>
                <FormDescription>
                هذا هو البريد الإلكتروني الخاص بك.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button disabled={isPending} type="submit">أرسل</Button>
        </form>
      </Form>
      <div className="flex gap-1 mt-3">
        <p>هل لديك حساب؟</p>
        <Link className="text-cyan-600" href="/auth/login">انقر هنا لتسجيل الدخول</Link>
      </div>
    </div>
  );
};

export default LoginForm;
