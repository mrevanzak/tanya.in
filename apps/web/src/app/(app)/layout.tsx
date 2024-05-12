import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";

export default function AuthLayout(props: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="container min-h-[calc(100vh-8rem)]">
        {props.children}
      </main>
      <Footer />
    </>
  );
}
