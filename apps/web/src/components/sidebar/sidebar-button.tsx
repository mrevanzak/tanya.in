"use client";

import { useSession } from "next-auth/react";
import { IoMenu } from "react-icons/io5";

import { Button } from "@tanya.in/ui/button";

import { useSidebarContext } from "./sidebar-context";

export const SidebarButton = () => {
  const { setCollapsed } = useSidebarContext();
  const { data: session } = useSession();

  return (
    session?.user.role === "admin" && (
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
};
