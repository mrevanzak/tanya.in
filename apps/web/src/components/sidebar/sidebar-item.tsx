import React from "react";
import NextLink from "next/link";

import { cn } from "@tanya.in/ui";

interface Props {
  title: string;
  icon: React.ReactNode;
  isActive?: boolean;
  href?: string;
  onClick?: () => void;
}

export const SidebarItem = ({
  icon,
  title,
  isActive,
  href = "",
  onClick,
}: Props) => {
  return (
    <NextLink
      href={href}
      className="max-w-full text-default-900 active:bg-none"
      onClick={onClick}
    >
      <div
        className={cn(
          isActive
            ? "bg-primary-100 [&_svg_path]:fill-primary-500"
            : "hover:bg-default-100",
          "flex h-full min-h-[44px] w-full cursor-pointer items-center gap-2 rounded-xl px-3.5 transition-all duration-150 active:scale-[0.98]",
        )}
      >
        {icon}
        <span className="text-default-900">{title}</span>
      </div>
    </NextLink>
  );
};
