import { Message } from "@/types/chat";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

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
          : "bg-gray-100 py-3 px-4 self-start max-w-[80%]"
      }`}
    >
      {message.from === "user" ? (
        message.text
      ) : (
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");
              const isInline = !className;
              return !isInline && match ? (
                <SyntaxHighlighter
                  customStyle={{ margin: 0 }}
                  // @ts-expect-error: Unreachable code error
                  style={vscDarkPlus as { [key: string]: React.CSSProperties }}
                  language={match[1]}
                  {...props}
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
            p: ({ children }) => <p className="mb-2">{children}</p>,
            ul: ({ children }) => <ul className="list-disc pl-4 mb-2">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal pl-4 mb-2">{children}</ol>,
            li: ({ children }) => <li className="mb-1">{children}</li>,
            strong: ({ children }) => <strong className="font-bold">{children}</strong>,
            em: ({ children }) => <em className="italic">{children}</em>,
            table: ({ children }) => (
              <div className="overflow-x-auto my-4">
                <table className="min-w-full divide-y divide-gray-300 border border-gray-300">
                  {children}
                </table>
              </div>
            ),
            thead: ({ children }) => (
              <thead className="bg-gray-50">
                {children}
              </thead>
            ),
            tbody: ({ children }) => (
              <tbody className="divide-y divide-gray-200 bg-white">
                {children}
              </tbody>
            ),
            tr: ({ children }) => (
              <tr className="hover:bg-gray-50">
                {children}
              </tr>
            ),
            th: ({ children }) => (
              <th className="py-2 px-4 text-left text-xs font-semibold text-gray-900">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="py-2 px-4 text-sm text-gray-500">
                {children}
              </td>
            ),
          }}
        >
          {message.text}
        </ReactMarkdown>
      )}
    </div>
  </div>
);
