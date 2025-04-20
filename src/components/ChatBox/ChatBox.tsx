"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { chatService } from "../../services/chatService";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";

interface Message {
  from: "user" | "bot";
  text: string;
}

interface ChatBoxProps {
  open: boolean;
  setOpen: (val: boolean) => void;
}

const useChatMessages = () => {
  const [messages, setMessages] = useState<Message[]>([
    { from: "bot", text: "Hi 👋 I'm ForgeBot. How can I help you today?" },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = { from: "user", text: text.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);
    setError(null);

    try {
      const response = await chatService.sendMessage("user_123", text.trim());
      const botReply: Message = {
        from: "bot",
        text: response.reply,
      };
      console.log("Bot Reply ", botReply);
      setMessages((prev) => [...prev, botReply]);
    } catch (err) {
      setError("Failed to send message. Please try again.");
      console.error("Error:", err);
    } finally {
      setIsTyping(false);
    }
  };

  return { messages, isTyping, error, sendMessage };
};

export default function ChatBox({ setOpen }: ChatBoxProps) {
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const { messages, isTyping, error, sendMessage } = useChatMessages();
  const [visibleError, setVisibleError] = useState(false);

  // Update this in the same useChatMessages block (or move it here if needed)
  useEffect(() => {
    if (error) {
      setVisibleError(true);
      const timer = setTimeout(() => setVisibleError(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleSend = () => {
    sendMessage(input);
    setInput("");
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <div className="fixed p-2 bottom-3 right-3 w-[95vw] max-w-[400px] h-[80vh] max-h-[600px] rounded-2xl shadow-lg z-[9998] flex flex-col overflow-hidden border border-gray-200 bg-white">
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
          <MessageBubble key={i} message={msg} />
        ))}
        {isTyping && <TypingIndicator />}
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
        {/* Error display */}
        {visibleError && (
          <div
            className={`px-4 py-2 text-xs justify-center text-red-700 bg-red-50 border border-red-200 rounded-md mt-2 flex items-center gap-2 transition-opacity duration-1000 ease-in-out ${
              visibleError ? "opacity-100" : "opacity-0"
            }`}
          >
            <svg
              className="w-4 h-4 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01M12 5a7 7 0 11-7 7 7 7 0 017-7z"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex py-3 px-3 pt-4 gap-1 text-xs justify-center text-gray-500">
        <span className="italic">Powered by</span>
        <Image src="/chat_logo.png" alt="alt" width={16} height={16} />
        <span className="font-medium text-gray-700">ForgeBot</span>
      </div>
    </div>
  );
}
