import { ChatCard } from "./card";
import { ChatHistory } from "./history";

export default function HomePage() {
  return (
    <>
      <ChatHistory />
      <div className="container flex-1 self-center">
        <ChatCard />
      </div>
    </>
  );
}
