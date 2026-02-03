"use client";
import "./globals.css";
import { useEffect } from "react";
import { ProductsProvider } from "@/context/ProductsContext";

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
      <head>
        <link rel="icon" type="image/svg+xml" href="/fevicon.svg" />
        <meta name="theme-color" content="#8C2224" />
      </head>
      <body>
        <ProductsProvider>
          <ScrollToTopOnMount />
          <div className="relative z-10">{children}</div>
        </ProductsProvider>
      </body>
    </html>
  );
}
