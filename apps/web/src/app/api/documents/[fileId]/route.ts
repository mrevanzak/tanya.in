import { env } from "@/env";
import { auth } from "@/server/auth";

export async function GET(_: Request, context: { params: { fileId: string } }) {
  const session = await auth();
  if (session?.user.role !== "admin") {
    return new Response("Unauthorized", { status: 401 });
  }

  const res = await fetch(
    env.BACKEND_URL + "/files/download/" + context.params.fileId,
  );
  return res;
}
