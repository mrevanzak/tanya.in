import { auth } from "@/lib/auth";

export default async function HomePage() {
  const session = await auth();
  console.log(session);

  return (
    <main className="container h-screen py-16">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Create <span className="text-primary">T3</span> Turbo
        </h1>
        <p className="text-center text-lg text-default-400">
          {session?.user ? (
            <span>Welcome back, {session.user.name}!</span>
          ) : (
            <span>
              Welcome to <span className="font-semibold">T3 Turbo</span>, the
              best place to create your own turbocharger
            </span>
          )}
        </p>
      </div>
    </main>
  );
}
