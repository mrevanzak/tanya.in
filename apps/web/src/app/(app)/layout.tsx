import { Navbar } from "@/components/navbar";

export default function AuthLayout(props: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {props.children}
    </>
  );
}
