import { env } from "@/env";
import { auth } from "@/server/auth";

// TODO: Remove this when backend has domain
// export const runtime = "edge";

export async function GET(_: Request, context: { params: { fileId: string } }) {
  const session = await auth();
  if (session?.user.role !== "admin") {
    return new Response("Unauthorized", { status: 401 });
  }

  const res = await fetch(
    env.BACKEND_URL + "/files/download/" + context.params.fileId,
  );

  if (!res.ok) {
    return await res.json();
  }

  return new Response(await res.arrayBuffer(), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition":
        res.headers
          .get("Content-Disposition")
          ?.replace("attachment", "inline") ??
        'inline; filename="document.pdf"',
    },
  });
}
