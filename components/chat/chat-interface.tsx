"use client";

import React, { FormEvent, useEffect, useState } from "react";
import { ChatSession } from "@google/generative-ai";
import { model, PROMPT, SAFETY_CONFIG } from "~/Gemini/config";
import { filterResponse } from "~/lib/utils";

type Message = {
  role: string;
  parts: string;
}


export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState("");
  const [chat, setChat] = useState<ChatSession>();

  useEffect(() => {
    const chat = model.startChat({
      generationConfig: { maxOutputTokens: 700 },
      safetySettings: SAFETY_CONFIG
    });
    setChat(chat);
  }, []);

  useEffect(() => {
    if (chat) {
      (async () => {
        const result = await chat.sendMessage(PROMPT);
        const response = result.response;
        const text = response.text();
        const filteredResponse = filterResponse(text)

        setMessages((prevMessages) => [
          ...prevMessages,
          { parts: filteredResponse, role: "model" },
        ]);
      })();
    }
  }, [chat]);


  const sendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (userInput.trim() === "") return;

    const newMessage = {role: "user", parts: userInput};

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setUserInput("");

    if (chat) {
      const result = await chat.sendMessage(userInput);
      const response = result.response;
      const text = response.text();

      const newMessage = { role: "model", parts: text};
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    }
  };


  return (
    <div className="font-sans flex flex-col p-6 mx-auto max-w-4xl min-h-screen">
      <div className="flex-grow overflow-y-auto h-[40rem] p-4">
        {messages.map((message, ix) => (
          <div key={ix} className={`mb-2 py-2 px-3 rounded-xl ${message.role === "user" ? "text-right self-end" : "text-left"} 
            ${message.role === "user" ? "bg-indigo-700 text-white" : "bg-gray-200 text-black"} transition-opacity duration-300 ease-in`}
              style={{ transitionDelay: `${ix * 0.1}s` }}
            >
            <span className="text-sm">{message.parts}</span>
          </div>
        ))}
      </div>

      <form className="flex items-center p-4 w-full" onSubmit={(e) => sendMessage(e)}>
        <input
          className="flex-grow text-sm rounded-lg p-2 mr-2 border-2 w-full text-black"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Roast away ... no mercy"
        />
        <button className="bg-indigo-700 text-white p-2 rounded-lg">Send</button>
      </form>
    </div>
  );
}