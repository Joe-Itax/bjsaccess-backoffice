"use client";
import { useEffect, useState } from "react";
import {
  CircleCheckIcon,
  XIcon,
  CircleAlert,
  TriangleAlert,
  InfoIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";
import useProgressTimer from "@/hooks/use-progress-timer";

interface NotificationProps {
  type?: "success" | "error" | "info" | "note";
  title?: string;
  message: string;
  onClose?: () => void;
  showAction?: boolean;
}

const notificationConfig = {
  success: {
    icon: CircleCheckIcon,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500",
    defaultTitle: "Succès!",
  },
  error: {
    icon: CircleAlert,
    color: "text-red-500",
    bgColor: "bg-red-500",
    defaultTitle: "Erreur!",
  },
  info: {
    icon: TriangleAlert,
    color: "text-amber-500",
    bgColor: "bg-amber-500",
    defaultTitle: "Information",
  },
  note: {
    icon: InfoIcon,
    color: "text-blue-500",
    bgColor: "bg-blue-500",
    defaultTitle: "Note",
  },
};

export function Notification({
  type = "success",
  title,
  message,
  onClose,
  showAction = false,
}: NotificationProps) {
  const [open, setOpen] = useState(true);
  const toastDuration = 5000;
  const { progress, start, pause, resume } = useProgressTimer({
    duration: toastDuration,
    // onComplete: () => {
    //   setOpen(false);
    //   onClose?.();
    // },
  });

  useEffect(() => {
    start();
  }, [start]);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      onClose?.();
    }
  };

  const { icon: Icon, color, bgColor, defaultTitle } = notificationConfig[type];

  return (
    <ToastProvider swipeDirection="left">
      <Toast
        open={open}
        onOpenChange={handleOpenChange}
        onPause={pause}
        onResume={resume}
        className="relative overflow-hidden"
      >
        <div className="flex w-full justify-between gap-3">
          <Icon
            className={`mt-0.5 shrink-0 ${color}`}
            size={16}
            aria-hidden="true"
          />
          <div className="flex grow flex-col gap-3">
            <div className="space-y-1">
              <ToastTitle>{title || defaultTitle}</ToastTitle>
              <ToastDescription>{message}</ToastDescription>
            </div>
            {showAction && (
              <ToastAction altText="Action" asChild>
                <Button size="sm">Action</Button>
              </ToastAction>
            )}
          </div>
          <ToastClose asChild>
            <Button
              variant="ghost"
              className="group -my-1.5 -me-2 size-8 shrink-0 p-0 hover:bg-transparent"
              aria-label="Close notification"
            >
              <XIcon
                size={16}
                className="opacity-60 transition-opacity group-hover:opacity-100"
                aria-hidden="true"
              />
            </Button>
          </ToastClose>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
          <div
            className={`h-full ${bgColor}`}
            style={{
              width: `${(progress / toastDuration) * 100}%`,
              transition: "width 100ms linear",
            }}
          />
        </div>
      </Toast>
      <ToastViewport className="sm:right-auto sm:left-0" />
    </ToastProvider>
  );
}
