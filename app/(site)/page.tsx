import Link from "next/link";
import ChatInterface from "~/components/chat/chat-interface";
import { LpConstants } from "~/lib/consts";

export default function Home() {
  return (
    <main>
      <section className="bg-gradient-to-r from-slate-700 via-slate-900 to-slate-800 min-h-screen flex items-center font-sans justify-center text-white">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold mb-6 tracking-wide">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600 font-serif">
              {LpConstants.appName}
            </span>
          </h1>
          <p className="text-lg text-gray-300 mb-8 leading-relaxed">
            {LpConstants.landingHeroText}
          </p>
          <Link
            href="#roast-section"
            className="bg-blue-500 hover:bg-blue-600 text-sm text-white font-bold py-3 px-6 rounded-full cursor-pointer transition duration-300 inline-block"
          >
            {LpConstants.landingHeroButtonText}
          </Link>
        </div>
      </section>

      <section id="roast-section" className="min-h-screen">
        <ChatInterface />
      </section>
    </main>
  );
}
