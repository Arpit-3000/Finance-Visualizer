// src/app/layout.tsx
import "./globals.css";
import { ReactNode } from "react";
import { Toaster } from "sonner";

export const metadata = {
  title: "Personal Finance Visualizer",
  description: "Track your expenses with charts and summaries",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        
        <Toaster richColors position="bottom-center" />
        {children}
      </body>
    </html>
  );
}
