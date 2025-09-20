"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { Send } from "lucide-react";

type InputBarProps = {
    onSend: (message: string) => void;
};

export default function InputBar({ onSend }: InputBarProps) {
    const [input, setInput] = useState<string>("");

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
        <form
            onSubmit={handleSubmit}
            className="w-full absolute bottom-0 flex items-center gap-2 p-3 bg-[#0D0D0D] border-t border-[#1E1E1E]"
        >
            {/* Text Input */}
            <input
                type="text"
                value={input}
                onChange={handleChange}
                placeholder="Type your message..."
                className="flex-1 bg-[#1E1E1E] text-[#EAEAEA] placeholder-gray-500 
                   px-4 py-2 rounded-xl focus:outline-none focus:ring-1 
                   focus:ring-[#3A86FF] text-sm"
            />

            {/* Send Button */}
            <button
                type="submit"
                className="p-2 rounded-xl bg-[#3A86FF] hover:bg-[#2E6DCC] 
                   transition-colors text-white shadow-sm hover:cursor-pointer"
            >
                <Send size={18} />
            </button>
        </form>
    );
}
