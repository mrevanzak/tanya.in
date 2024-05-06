import { Spinner } from "@tanya.in/ui/spinner";

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-center font-sans text-foreground antialiased ">
      <Spinner size="lg" />
      <h3 className="mt-8">Loading...</h3>
    </div>
  );
}
