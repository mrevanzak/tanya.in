"use client";

import type { UseChatOptions } from "ai/react";
import * as React from "react";
import { api } from "@/trpc/react";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { ScrollShadow } from "@nextui-org/scroll-shadow";
import { keepPreviousData } from "@tanstack/react-query";
import { useChat } from "ai/react";
import { IoMenu, IoSend } from "react-icons/io5";
import { toast } from "sonner";
import { useDebounceValue } from "usehooks-ts";
import { z } from "zod";

import { cn } from "@tanya.in/ui";
import { Card, CardDescription } from "@tanya.in/ui/card";
import { useChatScroll } from "@tanya.in/ui/chat";
import { Form, FormTextArea, useForm } from "@tanya.in/ui/form";

const TOPICS = ["template", "MBKM", "SKEM", "UKT", "TA", "wisuda", "silabus"];

interface ChatProps extends UseChatOptions {
  placeholder?: string;
  value?: string;
}

export function Chat({
  onFinish,
  initialMessages,
  placeholder,
  id,
  value = "",
}: ChatProps) {
  const chatId = React.useMemo(() => (id ? id : crypto.randomUUID()), [id]);

  const {
    messages,
    isLoading,
    append: mutate,
  } = useChat({
    streamMode: "text",
    onError: (error) => toast.error(error.message),
    sendExtraMessageFields: true,
    onFinish,
    initialMessages,
    id: chatId,
  });
  const chatContainerRef = useChatScroll(messages);

  //#region  //*=========== Form ===========
  const methods = useForm({
    mode: "onSubmit",
    values: { prompt: value },
    schema: z.object({
      prompt: z.string().min(1, { message: "Please enter a message" }),
      topic: z.string().optional(),
    }),
  });
  const { handleSubmit, control, watch, setValue } = methods;
  const onSubmit = handleSubmit(async (data) => {
    setValue("prompt", "");
    setValue("topic", "");
    await mutate(
      { content: data.prompt, role: "user" },
      { options: { body: { topic: data.topic, chatId } } },
    );
  });
  //#endregion  //*======== Form ===========

  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [suggestionsOpen, setSuggestionsOpen] = React.useState(false);
  const [filteredTopics, setFilteredTopics] = React.useState(TOPICS);

  const [debouncedPrompt] = useDebounceValue(watch("prompt"), 500);
  const suggestions = api.chat.getSuggestion.useQuery(debouncedPrompt, {
    enabled: !debouncedPrompt.startsWith("/") && debouncedPrompt.length > 0,
    placeholderData: keepPreviousData,
  });
  const isAnySuggestion = suggestions.data && suggestions.data.length > 0;

  return (
    <div
      className="flex max-h-[60vh] flex-col space-y-4"
      data-started={messages.length > 0}
    >
      <ScrollShadow ref={chatContainerRef}>
        <div className="mb-4 space-y-3">
          {messages.map((item) => (
            <div
              key={item.id}
              className={cn(
                "flex justify-between",
                item.role === "user" ? "flex-row-reverse" : "flex-row",
                "space-x-2",
              )}
            >
              <div
                className={cn(
                  "rounded-lg px-3 py-2",
                  item.role === "user"
                    ? "ml-2 bg-primary text-white"
                    : "mr-2 bg-content2",
                )}
              >
                {item.content.includes("</") && item.content.includes(">") ? (
                  <div
                    className="prose dark:prose-invert"
                    dangerouslySetInnerHTML={{ __html: item.content }}
                  />
                ) : (
                  item.content
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollShadow>

      <Form {...methods}>
        <form onSubmit={onSubmit}>
          <FormTextArea
            placeholder={!watch("topic") ? placeholder : ""}
            control={control}
            name="prompt"
            label=""
            aria-label="prompt"
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

              console.log("value", value);
              if (isAnySuggestion && value.length > 0) {
                setSuggestionsOpen(true);
                return;
              }

              setDropdownOpen(false);
              setSuggestionsOpen(false);
            }}
            startContent={
              <>
                <Dropdown
                  placement="bottom-start"
                  isOpen={suggestionsOpen}
                  onClose={() => setSuggestionsOpen(false)}
                  classNames={{ content: "min-w-[24.8rem]" }}
                >
                  <DropdownTrigger>
                    <div className="h-10" />
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label="Sugesstions"
                    variant="flat"
                    disallowEmptySelection
                    selectionMode="single"
                    selectedKeys={[]}
                    shouldFocusWrap
                    onSelectionChange={(selected) => {
                      const selectedId = Array.from(selected).at(0)?.toString();

                      setSuggestionsOpen(false);
                      setValue(
                        "prompt",
                        suggestions.data?.find((s) => s.id === selectedId)
                          ?.content ?? "",
                      );
                    }}
                  >
                    {suggestions.data?.map((suggestion) => (
                      <DropdownItem key={suggestion.id}>
                        {suggestion.content}
                      </DropdownItem>
                    )) ?? <DropdownItem>No suggestion</DropdownItem>}
                  </DropdownMenu>
                </Dropdown>

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
                        aria-label="Select a topic button"
                        color="default"
                        variant="light"
                        radius="full"
                        isIconOnly
                        className={cn(
                          "opacity-100 delay-100 duration-500 ease-soft-spring transition-transform-opacity",
                          {
                            "pointer-events-none -translate-x-4 !opacity-0":
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
              </>
            }
            endContent={
              <Button
                aria-label="Send message button"
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
