"use client";

import { useState } from "react";
import Image from "next/image";
import ChatBox from "./ChatBox/ChatBox";

export default function ChatHead() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Chatbox */}
      <div
        className={`fixed bottom-0 right-4 z-50 transition-all duration-300 ease-out transform ${
          open
            ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
            : "opacity-0 translate-y-4 scale-95 pointer-events-none"
        }`}
      >
        <ChatBox open={open} setOpen={setOpen} />
      </div>

      {/* Chat Head */}
      {!open && (
        <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 9999 }}>
          <button onClick={() => setOpen(true)}>
            <div className="relative flex items-center justify-center">
              {/* Pulsing shadow */}
              <div className="absolute w-12 h-12 rounded-full animate-ping bg-indigo-300 duration-1000" />

              {/* Actual chat head */}
              <div className="relative flex items-center justify-center rounded-full p-4 bg-indigo-600 hover:bg-indigo-500 cursor-pointer transition-all duration-500 ease-in-out">
                <Image
                  src="/chat_logo.png"
                  alt="ChatHead"
                  width={36}
                  height={36}
                  style={{ filter: "invert(1) brightness(200%)" }}
                />
              </div>
            </div>
          </button>
        </div>
      )}
    </>
  );
}
