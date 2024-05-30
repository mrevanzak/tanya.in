import { env } from "@/env";
import { auth } from "@/server/auth";

export async function POST(req: Request) {
  const session = await auth();
  if (session?.user.role !== "admin") {
    return new Response("Unauthorized", { status: 401 });
  }

  return await fetch(env.BACKEND_URL + "/files", {
    method: "PUT",
    body: await req.formData(),
    // @ts-expect-error must set duplex to "half" to allow streaming
    duplex: "half",
  });
}
