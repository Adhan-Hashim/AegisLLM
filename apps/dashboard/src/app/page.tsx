"use client";

import Link from "next/link";
import { Search, Menu } from "lucide-react";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["700", "900"] });

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#161a1d] text-gray-300 relative overflow-hidden font-sans">
      {/* Diagonal Glass Overlays */}
      <div className="absolute top-0 left-0 w-[150%] h-[150%] pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[20%] w-[20%] h-[200%] bg-white/[0.02] backdrop-blur-3xl transform rotate-[35deg] shadow-2xl"></div>
        <div className="absolute top-[-30%] left-[45%] w-[10%] h-[200%] bg-black/30 backdrop-blur-xl transform rotate-[35deg]"></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Navigation */}
        <nav className="w-full px-8 py-8 flex justify-between items-center">
          <div className="flex items-center gap-3 text-white">
            <img src="/logo.png" alt="AegisLLM Logo" className="h-10 object-contain" />
            <span className="text-sm font-bold tracking-[0.2em] uppercase mt-1">AegisLLM</span>
          </div>
          <div className="flex items-center gap-8">
            <button className="text-gray-400 hover:text-white transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors cursor-pointer group">
              <span className="text-xs tracking-widest uppercase font-semibold">Menu</span>
              <div className="p-2 border border-gray-700/50 rounded bg-white/5 group-hover:bg-white/10 transition-colors">
                <Menu className="w-4 h-4" />
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col md:flex-row relative">
          
          {/* Left Vertical Pagination */}
          <div className="hidden md:flex flex-col justify-center gap-8 px-10 text-xs font-semibold tracking-widest text-gray-600">
            <div className="hover:text-white cursor-pointer transition-colors">01</div>
            <div className="hover:text-white cursor-pointer transition-colors">02</div>
            <div className="flex items-center gap-4 text-white font-bold">
              <div className="w-8 h-[2px] bg-[#ff5722]"></div>
              03
            </div>
            <div className="hover:text-white cursor-pointer transition-colors">04</div>
          </div>

          {/* Center Content */}
          <div className="flex-1 flex flex-col justify-center pl-8 md:pl-20 z-20">
            <h1 className={`${playfair.className} text-6xl md:text-8xl font-black text-[#e8e4db] leading-[0.9] tracking-tight uppercase`}>
              Aegis <br /> <span className="font-light italic opacity-90 tracking-normal">Dark</span>
            </h1>
            
            <div className="mt-12">
              <Link href="/attack-lab" className="inline-block px-10 py-3 bg-[#ff5722] hover:bg-[#ff7043] text-white text-xs font-bold tracking-[0.2em] uppercase rounded transition-all shadow-[0_0_20px_rgba(255,87,34,0.3)]">
                Discover
              </Link>
            </div>

            {/* Bottom Text Columns */}
            <div className="mt-auto mb-12 flex flex-col md:flex-row gap-8 md:gap-12 max-w-2xl text-xs leading-relaxed text-gray-500 pt-20">
              <div className="flex-1">
                <h4 className="text-white font-bold mb-2">Risk Engine</h4>
                <p>This engine intercepts every payload before it reaches your LLM. It relies on concurrent execution across a suite of advanced deterministic and AI-driven rules to provide latency-free security.</p>
              </div>
              <div className="flex-1">
                <h4 className="text-white font-bold mb-2">Minimalist</h4>
                <p>A declarative YAML schema ensures authoring detectors requires no custom code, complemented by the incredibly fast forensic replay functionality.</p>
              </div>
            </div>
          </div>

          {/* Right Image & Social Links */}
          <div className="flex-1 flex relative justify-end items-center pointer-events-none">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-full max-w-3xl translate-x-[15%]">
              <img src="/hero_shield.png" alt="3D Shield" className="w-full h-auto drop-shadow-[0_20px_50px_rgba(0,0,0,0.7)] opacity-95" />
            </div>

            {/* Right Vertical Links */}
            <div className="hidden md:flex flex-col items-center justify-center gap-16 px-10 text-[10px] font-bold tracking-[0.3em] uppercase text-gray-500 pointer-events-auto h-full absolute right-0">
              <a href="https://github.com/Adhan-Hashim/AegisLLM" className="-rotate-90 hover:text-white cursor-pointer transition-colors w-16 text-center block">GITHUB</a>
              <div className="w-[1px] h-12 bg-gray-700"></div>
              <a href="/rules-studio" className="-rotate-90 hover:text-white cursor-pointer transition-colors w-16 text-center block">RULES</a>
              <div className="w-[1px] h-12 bg-gray-700"></div>
              <a href="/api-explorer" className="-rotate-90 hover:text-white cursor-pointer transition-colors w-16 text-center block">API</a>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
