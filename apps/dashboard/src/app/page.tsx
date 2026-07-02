"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-black relative overflow-hidden flex flex-col text-white font-sans selection:bg-purple-500/30">
      {/* --- BACKGROUND EFFECTS --- */}
      
      {/* Deep Space Background */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none z-0"></div>
      
      {/* The Giant Glowing Planet Arc */}
      <div className="absolute top-[-40%] left-1/2 -translate-x-1/2 w-[150vw] max-w-[1200px] h-[150vw] max-h-[1200px] rounded-full z-0
        bg-gradient-to-b from-[#0f0518] via-[#1a0b2e] to-black
        shadow-[0_0_150px_rgba(139,92,246,0.15),inset_0_-50px_100px_rgba(139,92,246,0.4)]
        border border-white/5"
      ></div>

      {/* Bright glowing horizon line for the planet */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[80vw] max-w-[800px] h-[200px] bg-purple-600/30 blur-[100px] rounded-full z-0 pointer-events-none"></div>
      <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[40vw] max-w-[400px] h-[100px] bg-blue-500/20 blur-[80px] rounded-full z-0 pointer-events-none"></div>

      {/* Floating abstract elements (simulating asteroids) */}
      <motion.div 
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }} 
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[30%] left-[15%] w-16 h-20 bg-gradient-to-br from-purple-900/40 to-black rounded-[40%_60%_70%_30%] border border-white/10 backdrop-blur-sm z-10"
      />
      <motion.div 
        animate={{ y: [0, 30, 0], rotate: [0, -10, 0] }} 
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-[50%] right-[20%] w-24 h-24 bg-gradient-to-bl from-blue-900/30 to-black rounded-[30%_70%_50%_50%] border border-white/10 backdrop-blur-sm z-10"
      />
      <motion.div 
        animate={{ y: [0, -15, 0], rotate: [0, 15, 0] }} 
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-[20%] left-[25%] w-12 h-12 bg-gradient-to-tr from-purple-800/50 to-black rounded-[60%_40%_30%_70%] border border-white/10 backdrop-blur-sm z-10"
      />

      {/* --- CONTENT --- */}
      
      {/* Navigation Bar */}
      <nav className="relative z-50 flex items-center justify-between px-8 py-6 w-full max-w-7xl mx-auto">
        <div className="flex items-center gap-8 text-sm font-medium text-white/70">
          <Link href="#" className="flex items-center gap-2 text-white hover:text-white transition-colors">
            <div className="w-4 h-4 bg-white rounded-sm"></div>
            Home
          </Link>
          <Link href="#" className="hover:text-white transition-colors">Solutions</Link>
          <Link href="#" className="hover:text-white transition-colors">About</Link>
          <Link href="#" className="hover:text-white transition-colors">Careers</Link>
          <Link href="#" className="hover:text-white transition-colors">Support</Link>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 text-xl font-bold tracking-wide flex items-center gap-2">
          AEGIS<span className="font-light">LLM</span>
        </div>

        <div className="flex items-center gap-6 text-sm font-medium">
          <span className="text-white/50 hidden md:block">Scale 24/7 ↗</span>
          <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/10 px-4 py-2 rounded-full transition-all text-white backdrop-blur-md">
            See Solutions
            <div className="bg-white text-black p-1 rounded-full">
              <ArrowUpRight className="w-3 h-3" />
            </div>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-20 flex-1 flex flex-col items-center justify-center text-center px-4 mt-[-5%]">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center gap-2 text-white/60 text-sm mb-6 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full backdrop-blur-md"
        >
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span>Security. Speed. Intelligence.</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-[0.2em] mb-4 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70"
        >
          AEGISLLM
        </motion.h1>

        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-2xl font-light tracking-[0.1em] text-white/80 mb-8 uppercase"
        >
          Stop Vulnerabilities - Start Scaling
        </motion.h2>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-white/50 max-w-xl mx-auto mb-10"
        >
          Build Your AI-Powered Security Infrastructure
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <button className="group relative flex items-center gap-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 px-8 py-4 rounded-full font-medium text-white shadow-[0_0_40px_rgba(139,92,246,0.4)] transition-all hover:scale-105 hover:shadow-[0_0_60px_rgba(139,92,246,0.6)]">
            Build My Security Engine
            <div className="bg-white text-black p-1 rounded-full group-hover:rotate-45 transition-transform duration-300">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </button>
        </motion.div>

      </div>

      {/* Bottom atmospheric glow */}
      <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-purple-900/20 to-transparent pointer-events-none z-0"></div>

    </main>
  );
}
