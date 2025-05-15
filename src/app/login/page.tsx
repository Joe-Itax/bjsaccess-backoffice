"use client";

import Image from "next/image";
import Link from "next/link";
import { LinkIcon } from "lucide-react";

import { LoginForm } from "@/components/login-form";
import { DashboardSkeleton } from "../dashboard/skeleton";
import { useAuthRedirect } from "@/hooks/use-auth-redirect";

export default function LoginPage() {
  const { isLoading } = useAuthRedirect({ ifAuthenticated: "/dashboard" });

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <LinkIcon className="size-4" />
            </div>
            BJS Access
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <Image
          src={`/placeholder.svg`}
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          width={800}
          height={1200}
        />
      </div>
    </div>
  );
}
