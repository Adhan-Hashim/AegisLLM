import Link from "next/link";
import { Shield, Activity, RefreshCw, FileCode, List, Settings, BookOpen } from "lucide-react";

export function Sidebar() {
  return (
    <div className="w-64 border-r border-border/50 bg-card/50 flex flex-col h-screen p-4">
      <div className="flex items-center justify-center px-2 py-4 mb-6">
        <img src="/logo.png" alt="AegisLLM Logo" className="h-24 object-contain" />
      </div>

      <nav className="flex flex-col gap-1">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">Workspaces</span>
        
        <Link href="/console" className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-secondary text-foreground/80 hover:text-foreground transition-colors">
          <Activity className="w-4 h-4" />
          Security Console
        </Link>
        
        <Link href="/attack-lab" className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-secondary text-foreground/80 hover:text-foreground transition-colors">
          <Shield className="w-4 h-4" />
          Attack Lab
        </Link>

        <Link href="/replay-center" className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-secondary text-foreground/80 hover:text-foreground transition-colors">
          <RefreshCw className="w-4 h-4" />
          Replay Center
        </Link>

        <Link href="/rules-studio" className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-secondary text-foreground/80 hover:text-foreground transition-colors">
          <FileCode className="w-4 h-4" />
          Rules Studio
        </Link>

        <Link href="/sessions" className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-secondary text-foreground/80 hover:text-foreground transition-colors">
          <List className="w-4 h-4" />
          Sessions
        </Link>
        
        <Link href="/api-explorer" className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-secondary text-foreground/80 hover:text-foreground transition-colors">
          <BookOpen className="w-4 h-4" />
          API Explorer
        </Link>
      </nav>

      <div className="mt-auto">
        <Link href="/settings" className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-secondary text-foreground/80 hover:text-foreground transition-colors">
          <Settings className="w-4 h-4" />
          Settings
        </Link>
      </div>
    </div>
  );
}
