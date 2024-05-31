"use client";

import React, { FormEvent, useEffect, useState, useRef } from "react";
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
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(
    null
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

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
        speakMessage(text);
      })();
    }
  }, [chat]);

  const pauseSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.pause();
      setPaused(true);
    }
  };

  const resumeSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.resume();
      setPaused(false);
    }
  };

  const speakMessage = (text: string) => {
    if ('speechSynthesis' in window && !paused) {
      const synth = window.speechSynthesis;
      if (utterance) {
        // Stop current speech
        synth.cancel();
      }
      const newUtterance = new SpeechSynthesisUtterance(text);
      setUtterance(newUtterance);
      setSpeaking(true);
      newUtterance.addEventListener('end', () => setSpeaking(false));
      synth.speak(newUtterance);
    } else {
      console.log('Speech synthesis not supported or paused');
    }
  };


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
      const filteredResponse = filterResponse(text)

      const newMessage = { role: "model", parts: filteredResponse};
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      speakMessage(filteredResponse);
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
            {message.role === 'model' && (
              <div className="flex mt-1">
                <button className="mr-2 text-blue-500" onClick={() => speakMessage(message.parts)} disabled={speaking || paused}>
                  {speaking ? 'Speaking...' : 'Read out loud'}
                </button>
                <button className="text-blue-500" onClick={paused ? resumeSpeech : pauseSpeech}>
                  {paused ? 'Resume' : 'Pause'}
                </button>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
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