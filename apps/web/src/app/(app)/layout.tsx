import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { SidebarWrapper } from "@/components/sidebar/sidebar";
import { auth } from "@/lib/auth";

export default async function AuthLayout(props: {
  user: React.ReactNode;
  admin: React.ReactNode;
}) {
  const session = await auth();
  const isAdmin = session?.user.role === "admin";

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
