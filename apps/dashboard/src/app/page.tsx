"use client";

import Link from "next/link";
import React from "react";
import { Terminal, ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#111111] text-[#f4f4f4] font-sans selection:bg-orange-500/30 overflow-x-hidden">
      {/* Navigation */}
      <nav className="w-full px-8 md:px-16 py-8 flex justify-end items-start">
        <div className="hidden md:flex items-center space-x-12 text-xs font-semibold tracking-[0.2em] uppercase text-gray-500">
          <Link href="/attack-lab" className="hover:text-white transition-colors">Attack Lab</Link>
          <Link href="/rules-studio" className="hover:text-white transition-colors">Rules Studio</Link>
          <Link href="/sessions" className="hover:text-white transition-colors">Sessions</Link>
          <Link href="/attack-lab" className="text-orange-500 hover:text-orange-400 border-b border-orange-500/50 pb-1">
            Go to Console
          </Link>
        </div>
      </nav>

      <main className="px-8 md:px-16 pt-4 pb-32 max-w-[1800px] mx-auto">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center pt-4 pb-12">
          <div className="flex items-center gap-4 mb-8">
            <span className="text-orange-500 font-bold tracking-widest text-sm uppercase">
              (1) Enterprise-Grade Security
            </span>
          </div>
          
          <img src="/logo.png" alt="AegisLLM Logo" className="w-[300px] md:w-[400px] lg:w-[450px] object-contain opacity-95 mb-10 drop-shadow-2xl" />
          
          <div className="flex justify-center text-center">
            <p className="text-xl md:text-2xl text-gray-400 font-light italic max-w-2xl leading-snug">
              We help AI engineers realize the full potential of their security pipeline.
            </p>
          </div>
        </div>

        {/* Lower Grid Section */}
        <div className="mt-40 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-start">
          
          {/* Aesthetic Code Blocks (Left) */}
          <div className="lg:col-span-6 relative h-[700px] w-full">
            {/* Terminal Window 1 */}
            <div className="absolute top-0 left-0 w-[80%] md:w-[60%] bg-[#1a1a1a] border border-[#333] rounded-lg shadow-2xl p-6 z-10">
              <div className="flex gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <pre className="text-orange-400 font-mono text-sm leading-relaxed overflow-hidden">
{`POST /v1/evaluate
{
  "prompt": "Ignore previous instructions",
  "metadata": { "user": "ext_991" }
}

=> RISK_SCORE: 98
=> ACTION: BLOCK`}</pre>
            </div>
            
            {/* Terminal Window 2 (overlapping) */}
            <div className="absolute top-48 right-0 md:right-10 w-[80%] md:w-[60%] bg-[#0a0a0a] border border-[#222] rounded-lg shadow-2xl p-6 z-20 opacity-95 backdrop-blur-md">
               <div className="flex gap-2 mb-4">
                <Terminal className="w-4 h-4 text-gray-500" />
                <span className="text-xs text-gray-500 font-mono">rules.yaml</span>
              </div>
              <pre className="text-gray-300 font-mono text-sm leading-relaxed overflow-hidden">
{`detectors:
  - id: prompt_injection
    type: heuristic
    threshold: high
    
  - id: pii_leakage
    type: regex
    patterns: [ssn, credit_card]`}</pre>
            </div>

            {/* Huge pull quote */}
            <div className="absolute top-[520px] left-0 md:-left-8 right-0 z-30">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.1] drop-shadow-2xl">
                We believe that AI security should be both <span className="italic font-light text-orange-500">deterministic</span> and meaningful, where each evaluation protects your core infrastructure.
              </h2>
            </div>
            
            {/* Decorative Asterisk */}
            <div className="absolute bottom-0 left-[40%] text-orange-500 text-[10rem] leading-none opacity-20 -z-10 select-none">
              *
            </div>
          </div>

          {/* Text Content (Right) */}
          <div className="lg:col-span-5 lg:col-start-8 grid grid-cols-1 md:grid-cols-2 gap-12 text-sm text-gray-400 leading-relaxed font-medium mt-16 lg:mt-0">
            <div>
              <p className="mb-6">
                As multidisciplinary engineers and security researchers, we consider the synthesis of deterministic speed and LLM flexibility to be at the heart of our work.
              </p>
              <p>
                We collaborate closely with teams globally, including machine learning engineers, DevOps architects, and compliance officers from regulated industries.
              </p>
            </div>
            <div>
              <p className="mb-6">
                AegisLLM is an open-source security gateway specializing in innovative solutions for GenAI pipelines in both public and private deployments.
              </p>
              <p className="mb-12">
                Our platform's unique blend of ultra-low latency Rust-backed streaming and high-accuracy detection is balanced with exceptional attention to developer experience.
              </p>
              
              <div className="border-t border-[#333] pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-orange-500 font-bold tracking-widest text-xs uppercase">
                    (2) Ready to start?
                  </span>
                  <span className="text-orange-500">+</span>
                </div>
                <Link href="/attack-lab" className="text-white hover:text-orange-500 transition-colors inline-flex items-center gap-2 font-bold text-lg border-b border-transparent hover:border-orange-500 pb-1">
                  Explore the Attack Lab <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
