import { Alert, AlertDescription, AlertTitle } from "@/components/alert";
import { get } from "@vercel/edge-config";

import { ChatCard } from "./card";
import { ChatHistory } from "./history";

export default async function HomePage() {
  const isTesting = await get("testing");

  return (
    <>
      {isTesting && (
        <Alert className="absolute left-0 top-0 my-4 bg-warning text-warning-foreground">
          <AlertTitle>Testing mode: ON</AlertTitle>
          <AlertDescription>
            Sorry, currently the site is in testing mode. Chat responses may not
            be accurate.
          </AlertDescription>
        </Alert>
      )}

      <ChatHistory />
      <div className="container flex-1 self-center">
        <ChatCard />
      </div>
    </>
  );
}
