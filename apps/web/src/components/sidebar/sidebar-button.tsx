"use client";

import type { Session } from "next-auth";
import { IoMenu } from "react-icons/io5";

import { Button } from "@tanya.in/ui/button";

import { useSidebarContext } from "./sidebar-context";

export function SidebarButton(props: { user?: Session["user"] }) {
  const { setCollapsed } = useSidebarContext();

  return (
    props.user?.role === "admin" && (
      <Button
        isIconOnly
        variant="light"
        aria-label="Menu"
        onClick={setCollapsed}
        className="md:hidden"
      >
        <IoMenu size={28} />
      </Button>
    )
  );
}
