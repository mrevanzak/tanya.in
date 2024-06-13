import { Spinner } from "@nextui-org/react";

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-center font-sans text-foreground antialiased ">
      <Spinner label="Loading..." size="lg" labelColor="primary" />
    </div>
  );
}
