import Link from "next/link";
import { Shield } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background">
      <div className="flex items-center gap-4 mb-8">
        <Shield className="w-16 h-16 text-primary" />
        <h1 className="text-6xl font-bold tracking-tighter">AegisLLM</h1>
      </div>
      <p className="text-xl text-muted-foreground mb-12 max-w-2xl text-center">
        The open-source, event-driven Risk Engine for Large Language Models. 
        Detect prompt injection, jailbreaks, PII, and toxicity in real-time.
      </p>
      
      <div className="flex gap-4">
        <Link 
          href="/attack-lab" 
          className="px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors"
        >
          Try Attack Lab
        </Link>
        <Link 
          href="/console" 
          className="px-8 py-3 bg-secondary text-secondary-foreground font-semibold rounded-lg hover:bg-secondary/80 border border-border transition-colors"
        >
          Enter Console
        </Link>
      </div>

      {/* Placeholder for future architecture diagram / feature grid */}
      <div className="mt-24 p-8 border border-border/50 rounded-xl bg-card/30 backdrop-blur-sm max-w-4xl w-full">
        <div className="grid grid-cols-3 gap-8 text-center">
          <div>
            <h3 className="font-bold text-lg mb-2">Streaming Analysis</h3>
            <p className="text-sm text-muted-foreground">Watch the pipeline evaluate risks live via Server-Sent Events.</p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-2">Deterministic Fingerprinting</h3>
            <p className="text-sm text-muted-foreground">Track evolving attack vectors reliably across models.</p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-2">Rules Studio</h3>
            <p className="text-sm text-muted-foreground">Author detectors dynamically with Monaco YAML editor.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
