

tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GIEA Paris 16 — Formation Closer 7 Jours",
  description: "Plateforme de formation commerciale GIEA Paris 16",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    
      {children}
    
  );
}
