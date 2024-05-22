"use client";

import * as React from "react";
import { useChat } from "ai/react";
import { IoMenu, IoSend } from "react-icons/io5";
import { toast } from "sonner";
import { z } from "zod";

import { cn } from ".";
import { Button } from "./button";
import { Card, CardDescription } from "./card";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "./dropdown";
import { Form, FormTextArea, useForm } from "./form";

const TOPICS = ["template", "MBKM", "SKEM", "UKT", "TA", "wisuda", "silabus"];

function useChatScroll<T>(dep: T) {
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [dep]);
  return ref;
}

export function Chat() {
  const {
    messages,
    isLoading,
    append: mutate,
  } = useChat({
    api: "http://localhost:8000/generate_stream",
    streamMode: "text",
    onError: (error) => toast.error(error.message),
  });
  const chatContainerRef = useChatScroll(messages);

  //#region  //*=========== Form ===========
  const methods = useForm({
    mode: "onSubmit",
    schema: z.object({
      prompt: z.string().min(1, { message: "Please enter a message" }),
      topic: z.string().optional(),
    }),
  });
  const { handleSubmit, reset, control, watch, setValue } = methods;
  const onSubmit = handleSubmit(async (data) => {
    reset();
    await mutate(
      { content: data.prompt, role: "user" },
      { options: { body: { topic: data.topic } } },
    );
  });
  //#endregion  //*======== Form ===========

  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [filteredTopics, setFilteredTopics] = React.useState(TOPICS);

  return (
    <div
      className="flex max-h-[60vh] flex-col space-y-4"
      data-started={messages.length > 0}
    >
      <div className="space-y-3 overflow-y-auto" ref={chatContainerRef}>
        {messages.map((item, index) => (
          <div
            key={index}
            className={cn(
              "flex justify-between",
              index % 2 === 0 ? "flex-row-reverse" : "flex-row",
              "space-x-2",
            )}
          >
            <p
              className={cn(
                "rounded-lg px-3 py-2",
                index % 2 === 0
                  ? "ml-2 bg-primary text-white"
                  : "mr-2 bg-content2",
              )}
            >
              {item.content}
            </p>
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
                "my-2 self-center !transition-all !duration-500 ease-soft-spring disabled:cursor-not-allowed",
                {
                  "-translate-x-6": watch("prompt") && !watch("topic"),
                },
              ),
            }}
            disabled={isLoading}
            minRows={1}
            maxRows={3}
            onKeyDown={async (e) => {
              if (
                (e.key === "Backspace" || e.key === "Delete") &&
                !watch("prompt") &&
                watch("topic")
              )
                setValue("topic", "");

              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                await onSubmit();
              }

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
            onValueChange={(value) => {
              if (value.startsWith("/") && !watch("topic")) {
                setFilteredTopics(
                  TOPICS.filter((topic) =>
                    topic.toLowerCase().includes(value.slice(1).toLowerCase()),
                  ),
                );
                setDropdownOpen(true);
                return;
              }

              setDropdownOpen(false);
            }}
            startContent={
              <Dropdown
                isOpen={dropdownOpen}
                placement="bottom-start"
                onClose={() => setDropdownOpen(false)}
              >
                {watch("topic") ? (
                  <Card className="my-auto ml-4 bg-primary">
                    <CardDescription className="w-full p-2 capitalize text-primary-foreground">
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
                  {filteredTopics.map((topic) => (
                    <DropdownItem key={topic} className="capitalize">
                      {topic}
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
                isLoading={isLoading}
                className="my-auto"
              >
                {!isLoading && <IoSend size={20} />}
              </Button>
            }
          />
        </form>
      </Form>
    </div>
  );
}
