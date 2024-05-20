import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@tanya.in/ui/card";
import { Chat } from "@tanya.in/ui/chat";

export default function HomePage() {
  return (
    <div className="flex-1 self-center">
      <Card className="m-2 mx-auto w-full duration-500 transition-size has-[[data-started=false]]:min-[450px]:w-96">
        <CardHeader>
          <CardTitle className="text-center">Admin</CardTitle>
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
  );
}
