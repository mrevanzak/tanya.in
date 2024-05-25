import { env } from "@/env";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

export async function POST(req: Request) {
  const body = z
    .object({
      messages: z
        .object({
          role: z.enum(["user", "assistant"] as const),
          content: z.string(),
        })
        .array(),
    })
    .safeParse(await req.json());

  if (body.error) {
    const error = fromZodError(body.error).toString();
    return new Response(error, { status: 400 });
  }

  const res = await fetch(env.BACKEND_URL + "/questions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      question: body.data.messages.pop()?.content,
      isBahasa: true,
    }),
  });

  if (!res.body) {
    return new Response("No response body", { status: 500 });
  }
  const reader = res.body.getReader();
  const stream = new ReadableStream({
    async start(controller) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          controller.close();
          break;
        }
        // Convert Uint8Array to string and remove "data: " prefix
        const text = new TextDecoder().decode(value).replace(/^data:\s*/gm, "");

        // Enqueue the modified chunk back into the stream
        controller.enqueue(new TextEncoder().encode(text));
      }
    },
  });

  return new Response(stream);
}
