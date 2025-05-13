"use client";

import * as React from "react";
import {
  // IconChartBar,
  IconDashboard,
  // IconFolder,
  // IconSettings,
  IconUsers,
  IconFileText
} from "@tabler/icons-react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { LinkIcon } from "lucide-react";
import { useAuthUserQuery } from "@/hooks/use-auth-user";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Posts",
      url: "/dashboard/posts",
      icon: IconFileText,
    },
    {
      title: "Users",
      url: "/dashboard/users",
      icon: IconUsers,
    },
    // {
    //   title: "Analytics",
    //   url: "",
    //   icon: IconChartBar,
    // },
    // {
    //   title: "Projects",
    //   url: "",
    //   icon: IconFolder,
    // },
  ],
  navSecondary: [
    // {
    //   title: "Paramètres",
    //   url: "",
    //   icon: IconSettings,
    // },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: user } = useAuthUserQuery();

  return (
    <Sidebar collapsible="icon" {...props} variant="floating">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <div>
                <LinkIcon className="!size-6" />
                <span className="text-base font-semibold">Cantine Connect</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user || { name: "", email: "", avatar: "" }} />
      </SidebarFooter>
    </Sidebar>
  );
}
