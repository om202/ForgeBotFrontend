import { Message } from "@/types/chat";
import Image from "next/image";

export const MessageBubble = ({ message }: { message: Message }) => (
  <div
    className={`flex gap-2 items-baseline transition-all duration-300 ease-out transform ${
      message.from === "user" ? "justify-end" : "justify-start"
    }`}
  >
    {message.from !== "user" && (
      <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center shrink-0">
        <Image
          src="/chat_logo.png"
          alt="bot"
          width={20}
          height={20}
          style={{ filter: "invert(1) brightness(200%)" }}
        />
      </div>
    )}
    <div
      className={`text-sm px-3 py-2 rounded-md transition-all duration-300 ease-in-out transform ${
        message.from === "user"
          ? "bg-indigo-700 text-white text-right py-3 px-4 w-fit"
          : "bg-gray-100 py-3 px-4 self-start"
      }`}
    >
      {message.text}
    </div>
  </div>
);
