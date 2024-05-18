import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { auth } from "@/lib/auth";

export default async function AuthLayout(props: {
  user: React.ReactNode;
  admin: React.ReactNode;
}) {
  const session = await auth();

  return (
    <>
      <Navbar />
      <main className="container flex min-h-[calc(100vh-8rem)]">
        {session?.user.role === "admin" ? props.admin : props.user}
      </main>
      <Footer />
    </>
  );
}
