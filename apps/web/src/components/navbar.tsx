import { auth } from "@/lib/auth";

import Logo from "~/logo.svg";
import { UserButton } from "./user";

export async function Navbar() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-50 bg-content1 px-8">
      <div className="flex h-16 items-center justify-between">
        <Logo className="h-9 text-white" />

        <nav>
          <UserButton user={session?.user} />
        </nav>
      </div>
    </header>
  );
}
