"use client";

import type { Session } from "next-auth";
import { signOut } from "@/lib/actions/auth";
import { changeLanguage } from "@/lib/actions/language";
import { Avatar, Switch } from "@nextui-org/react";
import { useLocale, useTranslations } from "next-intl";

import { cn } from "@tanya.in/ui";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@tanya.in/ui/dropdown";

export function UserButton(props: { user?: Session["user"] }) {
  const t = useTranslations("User");
  const locale = useLocale();

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
          <p className="font-semibold">{t("signedInAs")}</p>
          <p className="font-semibold">{props.user?.email}</p>
        </DropdownItem>
        <DropdownItem key="language" isReadOnly>
          <Switch
            classNames={{
              base: "flex-row-reverse gap-2 justify-between w-full max-w-none",
              wrapper: "m-0",
            }}
            defaultSelected={locale === "id"}
            size="sm"
            color="primary"
            thumbIcon={({ isSelected, className }) =>
              isSelected ? (
                <p className={cn(className, "text-[8px]")}>ID</p>
              ) : (
                <p className={cn(className, "text-[8px]")}>EN</p>
              )
            }
            onChange={async (e) => {
              e.target.checked
                ? await changeLanguage("id")
                : await changeLanguage("en");
            }}
          >
            {t("language")}
          </Switch>
        </DropdownItem>
        <DropdownItem key="logout" color="danger">
          {t("signOut")}
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
