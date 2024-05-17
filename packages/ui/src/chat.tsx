"use client";

import * as React from "react";
import { Button } from "@nextui-org/button";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/dropdown";
import { useMutation } from "@tanstack/react-query";
import { IoMenu, IoSend } from "react-icons/io5";
import { z } from "zod";

import { cn } from ".";
import { Card, CardDescription } from "./card";
import { Form, FormTextArea, useForm } from "./form";

const TOPICS = [
  "template",
  "MBKM",
  "SKEM",
  "UKT",
  "tugas_akhir",
  "wisuda",
  "silabus",
] as const;

export function Chat() {
  const [chat, setChat] = React.useState<string[]>([]);

  const chatContainerRef = React.useRef<HTMLDivElement>(null);
  function scrollToBottom() {
    const lastBubbleChat = chatContainerRef.current?.lastElementChild;
    lastBubbleChat?.scrollIntoView({
      behavior: "smooth",
    });
  }

  React.useEffect(() => {
    scrollToBottom();
  }, [chat]);

  const { mutate, isPending } = useMutation({
    onMutate: (newChat) => {
      reset();
      // Snapshot the previous value
      const previousChats = chat;

      // Optimistically update to the new value
      // setChat((prev) => [...prev, newChat.prompt]);

      // Return a context object with the snapshotted value
      return { previousChats };
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (_err, _newChats, context) => {
      if (context?.previousChats) setChat(context.previousChats);
    },
    onSuccess: (data) => {
      // setChat((prev) => [...prev, data.answer]);
    },
  });
  //#region  //*=========== Form ===========
  const methods = useForm({
    mode: "onSubmit",
    schema: z.object({
      prompt: z.string().min(1, { message: "Please enter a message" }),
      topic: z.string().optional(),
    }),
  });
  const { handleSubmit, reset, control, watch, setValue } = methods;
  //#endregion  //*======== Form ===========

  const onSubmit = handleSubmit((data) => {
    console.log(data);
    // mutate({ prompt: data.chat });
  });

  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  return (
    <div className="-z-10 flex flex-col space-y-2">
      <div
        className="max-h-unit-8xl space-y-3 overflow-y-auto"
        ref={chatContainerRef}
      >
        {chat.map((item, index) => (
          <div
            key={index}
            className={cn(
              "flex justify-between",
              index % 2 === 0 ? "flex-row-reverse" : "flex-row",
              "space-x-2",
            )}
          >
            <div
              className={cn(
                "rounded-lg px-3 py-2 text-sm",
                index % 2 === 0
                  ? "bg-primary text-white"
                  : "bg-secondary text-black",
              )}
            >
              {item}
            </div>
          </div>
        ))}
      </div>
      <Form {...methods}>
        <form onSubmit={onSubmit}>
          <FormTextArea
            control={control}
            name="prompt"
            label=""
            radius="full"
            classNames={{
              inputWrapper: "p-0",
              input: cn(
                "my-2 self-center !transition-all !duration-500 ease-soft-spring",
                {
                  "-translate-x-6": watch("prompt") && !watch("topic"),
                },
              ),
            }}
            disabled={isPending}
            minRows={1}
            maxRows={3}
            onKeyDown={(e) => {
              if (
                (e.key === "Backspace" || e.key === "Delete") &&
                !watch("prompt") &&
                watch("topic")
              )
                setValue("topic", "");

              // if (e.key === "ArrowDown") {
              //   e.preventDefault();
              //   setSelectedTopicIndex((prev) =>
              //     prev + 1 < TOPICS.length ? prev + 1 : 0,
              //   );
              // }

              // if (e.key === "ArrowUp") {
              //   e.preventDefault();
              //   setSelectedTopicIndex((prev) =>
              //     prev - 1 >= 0 ? prev - 1 : TOPICS.length - 1,
              //   );
              // }
            }}
            onValueChange={(value) =>
              value.startsWith("/") && !watch("topic")
                ? setDropdownOpen(true)
                : setDropdownOpen(false)
            }
            startContent={
              <Dropdown
                isOpen={dropdownOpen}
                placement="bottom-start"
                onClose={() => setDropdownOpen(false)}
              >
                {watch("topic") ? (
                  <Card className="my-auto ml-4 bg-primary">
                    <CardDescription className="p-2 text-primary-foreground">
                      /{watch("topic")}
                    </CardDescription>
                  </Card>
                ) : (
                  <DropdownTrigger>
                    <Button
                      color="default"
                      variant="light"
                      radius="full"
                      isIconOnly
                      className={cn(
                        "opacity-100 delay-100 duration-500 ease-soft-spring transition-transform-opacity",
                        {
                          "pointer-events-none -translate-x-4 opacity-0":
                            watch("prompt"),
                        },
                      )}
                      onClick={() => setDropdownOpen((prev) => !prev)}
                    >
                      <IoMenu size={20} />
                    </Button>
                  </DropdownTrigger>
                )}
                <DropdownMenu
                  aria-label="Select a topic"
                  variant="flat"
                  disallowEmptySelection
                  selectionMode="single"
                  selectedKeys={watch("topic")}
                  shouldFocusWrap
                  onSelectionChange={(selected) => {
                    setDropdownOpen(false);
                    setValue("prompt", "");
                    setValue("topic", Array.from(selected).at(0)?.toString());
                  }}
                >
                  {TOPICS.map((topic) => (
                    <DropdownItem key={topic}>
                      {topic.at(0)?.toUpperCase() +
                        topic.slice(1).replace("_", " ")}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            }
            endContent={
              <Button
                color="primary"
                variant="light"
                radius="full"
                type="submit"
                isIconOnly
                isLoading={isPending}
                className="my-auto"
              >
                {!isPending && <IoSend size={20} />}
              </Button>
            }
          />
        </form>
      </Form>
    </div>
  );
}
