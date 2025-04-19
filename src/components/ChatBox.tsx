"use client";

import { useState } from "react";
import Image from "next/image";

export default function ChatBox({
  setOpen,
}: {
  open: boolean;
  setOpen: (val: boolean) => void;
}) {
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi 👋 I'm ForgeBot. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { from: "user", text: input.trim() };
    const botReply = {
      from: "bot",
      text: "Thanks for your message. I'm just a placeholder for now! 🤖",
    };

    setMessages([...messages, userMessage, botReply]);
    setInput("");
  };

  return (
    <div className="fixed p-2 bottom-4 right-1 w-95 h-132 rounded-2xl shadow-lg z-[9998] flex flex-col overflow-hidden border border-gray-200">
      {/* Header */}
      <div className="text-black px-4 py-2 text-sm flex justify-between">
        <div className="flex items-center justify-center gap-1 flex-1">
          <Image src="/chat_logo.png" alt="alt" width={24} height={24} />
          <span className="font-bold">ForgeBot</span>
        </div>
        <button
          onClick={() => setOpen(false)}
          className="text-black text-lg leading-none cursor-pointer opacity-50"
        >
          <Image src="/down.svg" alt="cross" width={14} height={14} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-2 items-baseline ${
              msg.from === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.from !== "user" && (
              <div className="p-1.5 bg-indigo-600 rounded-4xl">
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
              className={`text-sm px-3 py-2 rounded-md ${
                msg.from === "user"
                  ? "bg-indigo-700 text-white text-right py-3 px-4 w-fit"
                  : "bg-gray-100 py-3 px-4 self-start"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="px-3">
        <div className="flex">
          <input
            type="text"
            autoComplete="new-password"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 text-sm px-3 py-3 border rounded-l-md outline-none border-gray-200 focus:border-indigo-300"
            placeholder="Type a message..."
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            onClick={handleSend}
            className="bg-indigo-600 text-white px-4 rounded-r-md hover:bg-indigo-700 transition"
          >
            Send
          </button>
        </div>
      </div>

      <div className="flex py-3 px-3  pt-4 gap-1 text-xs justify-center">
        <span className="text-gray-500 italic">Powered by</span>
        <Image
          src="/chat_logo.png"
          alt="alt"
          width={16}
          height={16}
        />
        <span>ForgeBot</span>
      </div>
    </div>
  );
}
