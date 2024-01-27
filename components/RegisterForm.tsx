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
import register from "@/actions/register.action";
import { Social } from "./Social";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const RegisterForm = () => {
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "البريد الإلكتروني قيد الاستخدام بالفعل !"
      : "";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      register(values)
        .then((data) => {
          if (data?.error) {
            form.reset();
            setError(data.error);
          }
          if (data?.success) {
            form.reset();
            setSuccess(data?.success);
          }

          if (data?.twoFactor) {
            setShowTwoFactor(true);
          }
        })
        .catch((error) => console.log(error));
    });
  };

  return (
    <div className="w-[450px] border p-8 bg-slate-100 rounded-lg shadow-lg">
      <h1 className="text-center text-2xl font-semibold text-sky-800">تسجيل دخول</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {!showTwoFactor ? (
            <>
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الإسم</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        placeholder="ادخل اسمك هنا"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                    هذا هو اسم العرض الخاص بك.
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
                    <FormLabel>ايميل</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        placeholder="ادخل ايميلك هنا"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>هذا هو البريد الإلكتروني الخاص بك.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          ) : (
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>رمز المصادقة الثنائيه</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      placeholder="123456"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>جب أن يكون هذا الرمز الخاص بك</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <FormError message={error || urlError} />
          <FormSuccess message={success} />

          <div className="flex justify-between w-full">
            <Button type="submit">{showTwoFactor ? "Verify" : "دخول"}</Button>
            <Button type="submit">
              <Link href="/auth/reset">نسيت الاسم ؟</Link>
            </Button>
          </div>
        </form>
      </Form>
      <div className="flex gap-1 mt-3">
        <p>ليس لديك حساب ؟</p>
        <Link className="text-cyan-600" href="/">انقر هنا لإنشاء حساب </Link>
      </div>
      <Social />
    </div>
  );
};

export default RegisterForm;
