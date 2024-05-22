import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { SidebarWrapper } from "@/components/sidebar/sidebar";
import { auth } from "@/server/auth";
import { get } from "@vercel/edge-config";

export default async function AuthLayout(props: {
  user: React.ReactNode;
  admin: React.ReactNode;
}) {
  const session = await auth();
  const isAdmin = session?.user.role === "admin";

  const isMaintenance = await get("maintenance");

  if (isMaintenance && !isAdmin)
    throw new Error(
      "Unfortunately, the site is under maintenance. We'll be back soon!",
    );

  return (
    <div className="flex flex-row">
      {session?.user.role === "admin" && <SidebarWrapper />}
      <div className="flex-1">
        <Navbar />
        <main className="container flex min-h-[calc(100vh-8rem)]">
          {isAdmin ? props.admin : props.user}
        </main>
        <Footer />
      </div>
    </div>
  );
}
