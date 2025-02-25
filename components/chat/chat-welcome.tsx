import { MessageCircle, User2, ShieldAlert, ShieldCheck, Video, PenSquare, Book } from "lucide-react";
import { ChannelType } from "@prisma/client";
import { getOrCreateConversation } from "@/lib/conversation";

interface ChatWelcomeProps {
  name: string;
  type: "channel" | "conversation";
};

export const ChatWelcome = ({
  name,
  type
}: ChatWelcomeProps) => {
  
  return (
    <div className="space-y-2 px-4 mb-4">
      {type === "channel" && (
        <div className="h-[75px] w-[75px] rounded-full bg-zinc-500 dark:bg-zinc-700 flex items-center justify-center">
          <MessageCircle className="h-12 w-12 text-white" />
        </div>
      )}
      {type === "conversation" && (
        <div className="h-[75px] w-[75px] rounded-full bg-zinc-500 dark:bg-zinc-700 flex items-center justify-center">
          <User2 className="h-12 w-12 text-white" />
        </div>
      )}
      <p className="text-xl md:text-3xl font-bold">
        {type === "channel" ? "" : ""}{name}
      </p>
      <p className="text-zinc-600 dark:text-zinc-400 text-sm">
        {type === "channel"
          ? `This is the ${name} room.`
          : `Start your conversation with ${name}`
        }
      </p>
    </div>
  )
}