"use client";
import "./globals.css";
import { useEffect } from "react";

function ScrollToTopOnMount() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
  }, []);
  return null;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ScrollToTopOnMount />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
