"use client";

import * as React from "react";
import { Tooltip } from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { RxMoon, RxSun } from "react-icons/rx";

import { Button } from "@tanya.in/ui/button";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@tanya.in/ui/dropdown";
import { useTheme } from "@tanya.in/ui/theme";

export function ThemeToggle() {
  const t = useTranslations("Common.theme");
  const { setTheme } = useTheme();

  return (
    <Dropdown classNames={{ content: "min-w-32 bg-default-50" }}>
      <Tooltip content={t("toggle")} placement="bottom" closeDelay={0}>
        <div>
          <DropdownTrigger>
            <Button variant="light" isIconOnly>
              <RxSun className="size-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <RxMoon className="absolute size-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownTrigger>
        </div>
      </Tooltip>
      <DropdownMenu aria-label="Theme Toggle" variant="flat">
        <DropdownItem key="light" onClick={() => setTheme("light")}>
          {t("light")}
        </DropdownItem>
        <DropdownItem key="dark" onClick={() => setTheme("dark")}>
          {t("dark")}
        </DropdownItem>
        <DropdownItem key="system" onClick={() => setTheme("system")}>
          {t("system")}
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}