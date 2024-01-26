"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { UserButton } from "@/components/user-button";

export const Navbar = () => {
  const pathname = usePathname();

  return (
    <nav className="bg-[#F1F5F9] flex justify-between items-center p-4 rounded-xl w-[600px] shadow-sm">
      <div className="flex gap-x-2">
        <Button 
          asChild
          variant={pathname === "/server" ? "default" : "outline"}
        >
          <Link href="/server">
            السيرفر
          </Link>
        </Button>
        <Button 
          asChild
          variant={pathname === "/client" ? "default" : "outline"}
        >
          <Link href="/client">
            الموقع
          </Link>
        </Button>
        <Button 
          asChild
          variant={pathname === "/admin" ? "default" : "outline"}
        >
          <Link href="/admin">
            المستخدمين
          </Link>
        </Button>
        <Button 
          asChild
          variant={pathname === "/dashboard" ? "default" : "outline"}
        >
          <Link href="/dashboard">
            لوحة التحكم
          </Link>
        </Button>
      </div>
      <UserButton />
    </nav>
  );
};