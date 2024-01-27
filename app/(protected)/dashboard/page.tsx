"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition, useState, useEffect } from "react";
import { useSession } from "next-auth/react";

import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { settings } from "@/actions/settings";
import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCurrentUser } from "@/hooks/use-current-user";
import { UserRole } from "@prisma/client";
import { FormError } from "@/components/formError";
import { FormSuccess } from "@/components/FormSuccess";
import { SettingsSchema } from "@/lib";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaUser } from "react-icons/fa";

const SettingsPage = () => {
  const user = useCurrentUser();
  const [imageSrc, setImageSrc] = useState("");

  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const { update } = useSession();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      name: user?.name || undefined,
      image: user?.image || undefined,
      email: user?.email || undefined,
      role: user?.role || undefined,
      // @ts-ignore
      isTwoFactorEnabled: user?.isTwoFactorEnabled || undefined,
    },
  });

  async function handleFileUpload(event: any) {
    const fileInput = event.target.files;
    const formData = new FormData();

    for (const file of fileInput) {
      formData.append("file", file);
    }

    formData.append("upload_preset", "my-uploads");

    const data = await fetch(
      "https://api.cloudinary.com/v1_1/de4xbguwz/image/upload",
      {
        method: "POST",
        body: formData,
      }
    ).then((r) => r.json());

    setImageSrc(data.secure_url);
  }

  useEffect(() => {
    const uploadInput = document.getElementById("upload");
    const filenameLabel = document.getElementById("filename");
    const imagePreview = document.getElementById("image-preview");

    // Check if the event listener has been added before
    let isEventListenerAdded = false;
    // @ts-ignore
    uploadInput.addEventListener("change", (event) => {
      // @ts-ignore
      const file = event.target.files[0];

      if (file) {
        // @ts-ignore
        filenameLabel.textContent = file.name;

        const reader = new FileReader();
        reader.onload = (e) => {
          // @ts-ignore
          imagePreview.innerHTML = `<img src="${e.target.result}" class="max-h-48 rounded-lg mx-auto" alt="Image preview" />`;
          // @ts-ignore
          imagePreview.classList.remove(
            "border-dashed",
            "border-2",
            "border-gray-400"
          );

          // Add event listener for image preview only once
          if (!isEventListenerAdded) {
            // @ts-ignore
            imagePreview.addEventListener("click", () => {
              // @ts-ignore
              uploadInput.click();
            });

            isEventListenerAdded = true;
          }
        };
        reader.readAsDataURL(file);
      } else {
        // @ts-ignore
        filenameLabel.textContent = "";
        // @ts-ignore
        imagePreview.innerHTML = `<div class="bg-gray-200 h-48 rounded-lg flex items-center justify-center text-gray-500">No image preview</div>`;
        // @ts-ignore
        imagePreview.classList.add(
          "border-dashed",
          "border-2",
          "border-gray-400"
        );

        // Remove the event listener when there's no image
        // @ts-ignore
        imagePreview.removeEventListener("click", () => {
          // @ts-ignore
          uploadInput.click();
        });

        isEventListenerAdded = false;
      }
    });

    // @ts-ignore
    uploadInput.addEventListener("click", (event) => {
      event.stopPropagation();
    });
  }, []);

  const onSubmit = (values: z.infer<typeof SettingsSchema>) => {
    values.image = imageSrc;
    startTransition(() => {
      settings(values)
        .then((data) => {
          if (data.error) {
            setError(data.error);
          }

          if (data.success) {
            update();
            setSuccess(data.success);
          }
        })
        .catch(() => setError("Something went wrong!"));
    });
  };

  return (
    <Card className="w-[600px]">
      <CardHeader>
        <p className="text-2xl font-semibold text-center">⚙️ الإعدادات</p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الإسم</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="John Doe"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الإيميل</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="mahmud..@example.com"
                        type="email"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div
                id="image-preview"
                className="max-w-sm p-6 mb-4 bg-gray-100 border-dashed border-2 border-gray-400 rounded-lg items-center mx-auto text-center cursor-pointer"
              >
                {user?.image && (
                  <Avatar>
                    <AvatarImage src={user?.image || ""} />
                    <AvatarFallback className="bg-sky-500">
                      <FaUser className="text-white" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <input
                  id="upload"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileUpload}
                />
                <label htmlFor="upload" className="cursor-pointer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="w-8 h-8 text-gray-700 mx-auto mb-4"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                    />
                  </svg>
                  <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-700">
                    حمل صورة
                  </h5>
                  <p className="font-normal text-sm text-gray-400 md:px-6">
                    اختر حجم الصورة يجب أن يكون أقل من{" "}
                    <b className="text-gray-600">2mb</b>
                  </p>
                  <p className="font-normal text-sm text-gray-400 md:px-6">
                    ويجب أن يكون في{" "}
                    <b className="text-gray-600">JPG, PNG, or GIF</b>
                  </p>
                  <span
                    id="filename"
                    className="text-gray-500 bg-gray-200 z-50"
                  ></span>
                </label>
              </div>
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الصلاحية</FormLabel>
                    <Select
                      disabled={isPending}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={UserRole.ADMIN}>المدير</SelectItem>
                        <SelectItem value={UserRole.SUPERVISOR}>
                          مشرف
                        </SelectItem>
                        <SelectItem value={UserRole.USER}>مستخدم</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isTwoFactorEnabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>المصادقه الثنائيه</FormLabel>
                      <FormDescription>تمكين المصادقة الثنائية</FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        disabled={isPending}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <FormError message={error} />
            <FormSuccess message={success} />
            <Button disabled={isPending} type="submit">
              حفظ
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SettingsPage;
