"use client";

import type { Session } from "next-auth";
import { signOut } from "@/lib/actions/auth";
import { Avatar } from "@nextui-org/react";

import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@tanya.in/ui/dropdown";

export function UserButton(props: { user?: Session["user"] }) {
  return (
    <Dropdown classNames={{ content: "min-w-32 bg-default-50" }}>
      <DropdownTrigger>
        <Avatar
          isBordered
          src="https://api.dicebear.com/8.x/lorelei/png"
          showFallback
          name={props.user?.name ?? ""}
          color="primary"
          as="button"
          className="!size-8 sm:!size-10"
        />
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Profile Actions"
        variant="flat"
        disabledKeys={["profile"]}
        onAction={async () => await signOut()}
      >
        <DropdownItem key="profile" className="h-14 gap-2">
          <p className="font-semibold">Signed in as</p>
          <p className="font-semibold">{props.user?.email}</p>
        </DropdownItem>
        <DropdownItem key="logout" color="danger">
          Sign out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
