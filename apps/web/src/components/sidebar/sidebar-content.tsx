"use client";

import { usePathname } from "next/navigation";
import { IoDocumentText, IoHome } from "react-icons/io5";

import Logo from "~/logo.svg";
import { SidebarItem } from "./sidebar-item";
import { SidebarMenu } from "./sidebar-menu";

export function SidebarContent(props: { onMenuClick?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full max-h-screen flex-col gap-2">
      <Logo className="m-4 h-9" />

      <div className="flex-1 ">
        <nav className="grid items-start gap-6 px-4 font-medium">
          <SidebarItem
            title="Home"
            icon={<IoHome size={24} />}
            isActive={pathname === "/"}
            href="/"
            onClick={props.onMenuClick}
          />
          <SidebarMenu title="Main Menu">
            <SidebarItem
              title="Documents"
              icon={<IoDocumentText size={24} />}
              isActive={pathname === "/documents"}
              href="/documents"
              onClick={props.onMenuClick}
            />
          </SidebarMenu>
        </nav>
      </div>
    </div>
  );
}
