"use client";

import { changeLanguage } from "@/lib/actions/language";
import { Tooltip } from "@nextui-org/react";
import { useLocale, useTranslations } from "next-intl";
import { IoLanguage } from "react-icons/io5";

import { Button } from "@tanya.in/ui/button";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@tanya.in/ui/dropdown";

export function LanguageToggle() {
  const t = useTranslations("Common");
  const locale = useLocale();

  return (
    <Dropdown placement="bottom-end" classNames={{ content: "min-w-32" }}>
      <Tooltip content={t("changeLanguage")} placement="bottom" closeDelay={0}>
        <div>
          <DropdownTrigger as="span">
            <Button isIconOnly variant="light">
              <IoLanguage className="size-5" />
            </Button>
          </DropdownTrigger>
        </div>
      </Tooltip>
      <DropdownMenu
        aria-label="Language"
        disallowEmptySelection
        selectionMode="single"
        selectedKeys={[locale]}
        onSelectionChange={async (keys) => {
          if (keys === "all") return;
          await changeLanguage(Array.from(keys).at(0)?.toString() ?? "en");
        }}
      >
        <DropdownItem key="en">English</DropdownItem>
        <DropdownItem key="id">Bahasa Indonesia</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
