"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { chatService } from '../../services/chatService';
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
      const response = await chatService.sendMessage('user_123', text.trim());
      const botReply: Message = {
        from: "bot",
        text: response.reply,
      };
      console.log("Bot Reply ", botReply);
      setMessages((prev) => [...prev, botReply]);
    } catch (err) {
      setError('Failed to send message. Please try again.');
      console.error('Error:', err);
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
  const [dimensions, setDimensions] = useState({ width: 380, height: 528 }); // 528px = 132 * 4px (original height)
  const [isResizing, setIsResizing] = useState(false);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing) return;
    
    const resizeType = (e.target as HTMLElement).dataset.resize;
    if (resizeType === 'height') {
      const newHeight = Math.max(400, window.innerHeight - e.clientY);
      setDimensions(prev => ({ ...prev, height: newHeight }));
    } else if (resizeType === 'width') {
      const newWidth = Math.max(300, window.innerWidth - e.clientX);
      setDimensions(prev => ({ ...prev, width: newWidth }));
    }
  }, [isResizing]);

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, isResizing]);

  const handleSend = () => {
    sendMessage(input);
    setInput("");
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <div 
      className="fixed p-2 bottom-4 right-1 rounded-2xl shadow-lg z-[9998] flex flex-col overflow-hidden border border-gray-200 bg-white"
      style={{ 
        width: `${dimensions.width}px`, 
        height: `${dimensions.height}px`,
      }}
    >
      {/* Resize handles */}
      <div 
        className="absolute top-0 left-0 w-full h-1 cursor-n-resize hover:bg-indigo-200 transition-colors"
        data-resize="height"
        onMouseDown={() => setIsResizing(true)}
      />
      <div 
        className="absolute top-0 left-0 w-1 h-full cursor-w-resize hover:bg-indigo-200 transition-colors"
        data-resize="width"
        onMouseDown={() => setIsResizing(true)}
      />

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
