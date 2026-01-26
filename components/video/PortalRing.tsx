"use client";

import { cn } from "@/lib/utils";
import { easeOutCubic } from "@/lib/utils";
import { VIDEO_CONFIG } from "@/lib/constants";

interface PortalRingProps {
  heroProgress: number;
}

export default function PortalRing({ heroProgress }: PortalRingProps) {
  const isVisible = heroProgress > 0.1 && heroProgress < 0.7;
  const portalProgress = Math.max(0, (heroProgress - 0.1) / 0.6);
  const portalSize =
    150 + easeOutCubic(portalProgress) * VIDEO_CONFIG.portalMaxSize;

  return (
    <div
      className={cn(
        "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-accent-orange/50 z-[5] pointer-events-none transition-opacity duration-400"
      )}
      style={{
        width: portalSize,
        height: portalSize,
        boxShadow:
          "0 0 60px rgba(255, 107, 44, 0.3), inset 0 0 60px rgba(255, 107, 44, 0.15)",
        opacity: isVisible ? 1 - portalProgress : 0,
      }}
    >
      <div className="absolute -inset-5 border border-accent-orange/20 rounded-full animate-portal-rotate" />
      <div
        className="absolute -inset-10 border border-accent-orange/10 rounded-full animate-portal-rotate"
        style={{ animationDirection: "reverse", animationDuration: "12s" }}
      />
    </div>
  );
}
