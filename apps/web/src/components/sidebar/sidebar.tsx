"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { IoDocumentText, IoHome } from "react-icons/io5";

import { cn } from "@tanya.in/ui";

import Logo from "~/logo.svg";
import { useSidebarContext } from "./sidebar-context";
import { SidebarItem } from "./sidebar-item";
import { SidebarMenu } from "./sidebar-menu";

export const SidebarWrapper = () => {
  const pathname = usePathname();
  const { collapsed, setCollapsed } = useSidebarContext();

  return (
    <aside className="sticky top-0 z-50 h-full">
      {collapsed ? (
        <div
          className="fixed inset-0 z-10 bg-[rgb(15_23_42/0.3)] opacity-80 transition-opacity md:z-auto md:hidden md:opacity-100"
          onClick={setCollapsed}
        />
      ) : null}
      <div
        className={cn(
          "fixed z-[202] h-full w-64 shrink-0 -translate-x-full flex-col overflow-y-auto border-r border-divider bg-background px-3 pb-6 transition-transform md:static md:ml-0 md:flex md:h-screen md:translate-x-0 ",
          collapsed && "ml-0 translate-x-0 [display:inherit]",
        )}
      >
        <div className="flex h-full flex-col">
          <Logo className="m-4 h-7 sm:h-9" />

          <div className="flex flex-col gap-6 px-2">
            <SidebarItem
              title="Home"
              icon={<IoHome size={24} />}
              isActive={pathname === "/"}
              href="/"
            />
            <SidebarMenu title="Main Menu">
              <SidebarItem
                title="Files"
                icon={<IoDocumentText size={24} />}
                isActive={pathname === "/files"}
                href="/files"
              />
            </SidebarMenu>
          </div>
        </div>
      </div>
    </aside>
  );
};
