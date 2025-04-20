import Image from "next/image";

export const TypingIndicator = () => (
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
  );