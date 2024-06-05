import { Alert, AlertDescription, AlertTitle } from "@/components/alert";
import { ChatHistory } from "@/components/chat-history";
import { get } from "@vercel/edge-config";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@tanya.in/ui/card";
import { Chat } from "@tanya.in/ui/chat";

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
        <Card className="m-2 mx-auto w-full duration-500 transition-size has-[[data-started=false]]:min-[450px]:w-96">
          <CardHeader>
            <CardTitle className="text-center">Tanya.in saja!</CardTitle>
          </CardHeader>
          <CardContent>
            <Chat />
          </CardContent>
          <CardFooter>
            <Card className="m-auto shadow-none">
              <CardContent className="py-4 text-center">
                /: To choose the topic
              </CardContent>
            </Card>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
