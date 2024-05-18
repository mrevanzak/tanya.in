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
    <div className="flex flex-1 justify-center self-center">
      <Card className="">
        <CardHeader>
          <CardTitle className="text-center">Tanya.in saja!</CardTitle>
        </CardHeader>
        <CardContent>
          <Chat />
        </CardContent>
        <CardFooter>
          <Card className="m-auto shadow-none">
            <CardContent className="min-w-96 py-4 text-center">
              /: To choose the topic
            </CardContent>
          </Card>
        </CardFooter>
      </Card>
    </div>
  );
}
