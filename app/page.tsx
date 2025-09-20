"use client";

import ChatInterface from "@/components/ChatInterface";

async function sendMessage(email: string, message: string) {
  const res = await fetch("/api/converse", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, message }),
  });

  const data = await res.json();
  return data;
}

export default function Home() {
  return (
    <div className="h-dvh w-full bg-[#0D0D0D] text-white">
      <ChatInterface />
    </div>
  );
}
