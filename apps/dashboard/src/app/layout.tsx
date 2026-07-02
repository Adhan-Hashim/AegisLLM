import "./globals.css";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Sidebar } from "@/components/shared/Sidebar";
import { CommandPalette } from "@/components/shared/CommandPalette";
import { Providers } from "@/components/shared/Providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

export const metadata = {
  title: "AegisLLM Security Console",
  description: "Enterprise LLM Guardrails & Security Analytics",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className={`${inter.variable} ${jetbrains.variable} font-sans antialiased bg-background text-foreground flex h-screen overflow-hidden`}>
        <Providers>
          <main className="flex-1 flex flex-col h-screen overflow-y-auto">
            {children}
          </main>
          <CommandPalette />
        </Providers>
      </body>
    </html>
  );
}
