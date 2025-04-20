"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { chatService } from '../services/chatService';

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
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { from: "user", text: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
    setError(null);

    try {
      // Replace 'user_123' with actual user ID from your auth system
      const response = await chatService.sendMessage('user_123', input.trim());
      
      const botReply = {
        from: "bot",
        text: response.message,
      };
      setMessages((prev) => [...prev, botReply]);
    } catch (err) {
      setError('Failed to send message. Please try again.');
      console.error('Error:', err);
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <div className="fixed p-2 bottom-4 right-1 w-95 h-132 rounded-2xl shadow-lg z-[9998] flex flex-col overflow-hidden border border-gray-200 bg-white">
      {/* Header */}
      <div className="text-black px-4 py-2 text-sm flex justify-between items-center border-b border-gray-200">
        <div className="flex items-center gap-1">
          <Image src="/chat_logo.png" alt="alt" width={24} height={24} />
          <span className="font-bold">ForgeBot</span>
        </div>
        <button
          onClick={() => setOpen(false)}
          className="opacity-50 hover:opacity-100 transition"
        >
          <Image src="/down.svg" alt="cross" width={14} height={14} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-2 items-baseline transition-all duration-300 ease-out transform ${
              msg.from === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.from !== "user" && (
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
                msg.from === "user"
                  ? "bg-indigo-700 text-white text-right py-3 px-4 w-fit"
                  : "bg-gray-100 py-3 px-4 self-start"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex gap-2 items-baseline justify-start">
            <div className="p-1.5 bg-indigo-600 rounded-4xl">
              <Image
                src="/chat_logo.png"
                alt="bot"
                width={20}
                height={20}
                style={{ filter: "invert(1) brightness(200%)" }}
              />
            </div>
            <div className="typing bg-gray-100 py-3 px-4 rounded-md text-sm text-gray-500 animate-pulse">
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="px-3">
        <div className="flex overflow-hidden rounded-md focus-within:ring-1 focus-within:ring-indigo-500 transition-all duration-200">
          <input
            type="text"
            autoComplete="new-password"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className={`flex-1 text-sm px-3 py-3 outline-none rounded-l-md border border-r-0 border-gray-200`}
            placeholder="Type a message..."
          />
          <button
            onClick={handleSend}
            className="bg-indigo-600 text-white px-4 hover:bg-indigo-700 transition"
          >
            Send
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="flex py-3 px-3 pt-4 gap-1 text-xs justify-center text-gray-500">
        <span className="italic">Powered by</span>
        <Image src="/chat_logo.png" alt="alt" width={16} height={16} />
        <span className="font-medium text-gray-700">ForgeBot</span>
      </div>

      {/* Error display */}
      {error && (
        <div className="px-3 py-2 text-red-500 text-sm text-center">
          {error}
        </div>
      )}
    </div>
  );
}
