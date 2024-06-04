"use client";

import type { Session } from "next-auth";
import { useState } from "react";
import { IoMenu } from "react-icons/io5";

import { Button } from "@tanya.in/ui/button";

import { Sheet, SheetContent, SheetTrigger } from "../sheet";
import { SidebarContent } from "./sidebar-content";

export function SidebarButton(props: { user?: Session["user"] }) {
  const [open, setOpen] = useState(false);

  return (
    props.user?.role === "admin" && (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            isIconOnly
            variant="light"
            aria-label="Menu"
            className="md:hidden"
          >
            <IoMenu size={28} />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex w-72 flex-col px-0">
          <SidebarContent onMenuClick={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
    )
  );
}
