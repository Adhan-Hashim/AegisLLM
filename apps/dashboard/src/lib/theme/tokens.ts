export const tokens = {
  colors: {
    // Backgrounds
    background: "hsl(var(--background))", // deep slate/zinc
    foreground: "hsl(var(--foreground))",
    card: "hsl(var(--card))",
    cardForeground: "hsl(var(--card-foreground))",
    popover: "hsl(var(--popover))",
    popoverForeground: "hsl(var(--popover-foreground))",
    
    // Status (Vibrant)
    success: "#10b981", // Emerald 500
    successMuted: "rgba(16, 185, 129, 0.15)",
    warning: "#f59e0b", // Amber 500
    warningMuted: "rgba(245, 158, 11, 0.15)",
    danger: "#ef4444", // Red 500
    dangerMuted: "rgba(239, 68, 68, 0.15)",
    info: "#3b82f6", // Blue 500
    infoMuted: "rgba(59, 130, 246, 0.15)",
    
    // Core actions
    primary: "hsl(var(--primary))",
    primaryForeground: "hsl(var(--primary-foreground))",
    secondary: "hsl(var(--secondary))",
    secondaryForeground: "hsl(var(--secondary-foreground))",
    muted: "hsl(var(--muted))",
    mutedForeground: "hsl(var(--muted-foreground))",
    accent: "hsl(var(--accent))",
    accentForeground: "hsl(var(--accent-foreground))",
    destructive: "hsl(var(--destructive))",
    destructiveForeground: "hsl(var(--destructive-foreground))",
    
    border: "hsl(var(--border))",
    input: "hsl(var(--input))",
    ring: "hsl(var(--ring))",
  },
  typography: {
    fontSans: "var(--font-inter)",
    fontMono: "var(--font-jetbrains)",
  },
  animation: {
    duration: "200ms", // Snappy
    easing: "cubic-bezier(0.4, 0, 0.2, 1)",
  }
};
