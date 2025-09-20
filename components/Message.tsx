"use client";

import { Clipboard } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

export interface MessageProps {
    origin: 'user' | 'bot';
    content: string;
    timestamp: Date;
    isLoading?: boolean;
}

export default function Message({ origin, content, timestamp, isLoading }: MessageProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <div
            className={`relative group w-[95%] p-3 rounded-xl shadow-sm 
        ${origin === "user"
                    ? "ml-auto text-right bg-[#1E1E1E] text-[#EAEAEA] border border-[#3A86FF40]"
                    : "mr-auto text-left bg-[#121212] text-[#F5F5F5] border border-[#00C89640]"
                } 
        ${isLoading ? "animate-pulse" : ""}`}
        >
            <ReactMarkdown>
                {content}
            </ReactMarkdown>

            {/* Timestamp */}
            <span className={`absolute ${origin == "user" ? "bottom-1 left-2" : "bottom-1 right-2"} text-[10px] text-gray-500 opacity-70`}>
                {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>

            {/* Copy Button (appears on hover) */}
            <button
                onClick={handleCopy}
                className={`absolute hover:cursor-pointer ${origin == "user" ? "top-1 left-2" : "top-1 right-2"} opacity-0 group-hover:opacity-100 transition-opacity`}
            >
                <Clipboard size={14} className="text-gray-400 hover:text-gray-200" />
            </button>

            {/* Copied feedback */}
            {copied && (
                <span className="absolute top-1 right-8 text-[10px] text-green-400">
                    Copied!
                </span>
            )}
        </div>
    );
}
