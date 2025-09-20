"use client";

import Message, { MessageProps } from "@/components/Message";
import { useState, FormEvent, ChangeEvent } from "react";
import { Send } from "lucide-react";

async function sendMessage(email: string, message: string) {
    const res = await fetch("/api/converse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, message }),
    });

    const data = await res.json();
    return data;
}

export default function ChatInterface() {
    const [input, setInput] = useState<string>("");
    const [email, setEmail] = useState<string>("user@example.com");
    const [messages, setMessages] = useState<MessageProps[]>([]);

    const onSend = async (msg: string) => {
        const timestamp = new Date();

        const userMessage: MessageProps = {
            origin: "user",
            content: msg,
            timestamp,
        };
        setMessages((prev) => [...prev, userMessage]);

        const loadingMessage: MessageProps = {
            origin: "bot",
            content: "Thinking...",
            timestamp: new Date(),
            isLoading: true,
        };
        setMessages((prev) => [...prev, loadingMessage]);

        try {
            const res = await sendMessage(email, msg);

            setMessages((prev) => {
                const withoutLoading = prev.filter((m) => !m.isLoading);
                const botMessage: MessageProps = {
                    origin: "bot",
                    content:
                        res.intent === "normal"
                            ? res.response
                            : JSON.stringify(res.extracted_data, null, 2) + "\n\n\n\n" + res.recommendations,
                    timestamp: new Date(),
                };
                return [...withoutLoading, botMessage];
            });
        } catch (err) {
            console.error("Chat error:", err);
            setMessages((prev) => {
                const withoutLoading = prev.filter((m) => !m.isLoading);
                return [
                    ...withoutLoading,
                    {
                        origin: "bot",
                        content: "⚠️ Failed to get response. Please try again.",
                        timestamp: new Date(),
                    },
                ];
            });
        }
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!input.trim()) return;
        onSend(input);
        setInput("");
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    return (
        <div className="flex flex-col h-dvh bg-[#0D0D0D]">
            <div className="flex flex-col items-center justify-start text-center">
                <h1 className="text-2xl flex flex-col gap-2 md:gap-0 md:flex-row justify-between font-bold p-4 border-b border-[#1E1E1E] w-full">
                    DelCap Recruitment AI Agent
                    <div className="flex items-center justify-center gap-2">
                        <label htmlFor="email" className="text-sm text-gray-400">
                            Active Email:
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="user@example.com"
                            className="bg-[#1E1E1E] text-[#EAEAEA] placeholder-gray-500
                   px-3 py-1 rounded-md focus:outline-none focus:ring-1 
                   focus:ring-[#3A86FF] text-sm w-64"
                        />
                    </div>
                </h1>

                {/* Email Selector */}
                <div className="flex flex-col items-center gap-2 mt-2">
                    <p className="text-xs text-gray-400 mt-1">
                        Chat history is saved for any email. Each unique email maintains its conversation history.
                    </p>
                </div>
            </div>


            {/* Chat messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((m, idx) => (
                    <Message key={idx} {...m} />
                ))}
            </div>

            {/* Input bar */}
            <form
                onSubmit={handleSubmit}
                className="w-full flex items-center gap-2 p-3 bg-[#0D0D0D] border-t border-[#1E1E1E]"
            >
                <input
                    type="text"
                    value={input}
                    onChange={handleChange}
                    placeholder="Type your message..."
                    className="flex-1 bg-[#1E1E1E] text-[#EAEAEA] placeholder-gray-500 
                     px-4 py-2 rounded-xl focus:outline-none focus:ring-1 
                     focus:ring-[#3A86FF] text-sm"
                />

                <button
                    type="submit"
                    className="p-2 rounded-xl bg-[#3A86FF] hover:bg-[#2E6DCC] 
                     transition-colors text-white shadow-sm hover:cursor-pointer"
                >
                    <Send size={18} />
                </button>
            </form>
        </div>
    );
}
