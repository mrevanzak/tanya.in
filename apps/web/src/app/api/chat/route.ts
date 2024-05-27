import { env } from "@/env";
import { auth } from "@/server/auth";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { get } from "@vercel/edge-config";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

// TODO: Remove this when backend has domain
// export const runtime = "edge";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  // rate limit to 5 req/10s
  limiter: Ratelimit.slidingWindow(5, "10 s"),
  analytics: true,
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { success } = await ratelimit.limit(session.user.id);
  if (!success) return new Response("Too many request", { status: 429 });

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

  const isTesting = await get("testing");
  const res = await fetch(
    env.BACKEND_URL + "/questions" + (isTesting ? "/stream-generator" : ""),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question: body.data.messages.pop()?.content,
        isBahasa: true,
      }),
    },
  );

  if (!res.ok) {
    console.error("Failed to fetch from backend", await res.json());
    return new Response("Internal server error", { status: 500 });
  }

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
        const text = new TextDecoder()
          .decode(value, { stream: true })
          // Convert Uint8Array to string and remove "data: " prefix
          .replace(/^data: /gm, "")
          // Remove all whitespaces except for space
          .replace(/[\r\n\t\f\v]/g, "");

        // Enqueue the modified chunk back into the stream
        controller.enqueue(text);
      }
    },
  });

  return new Response(stream);
}
