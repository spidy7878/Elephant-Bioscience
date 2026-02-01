"use client";

import { NAV_LINKS } from "lib/constants";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface NavigationBarProps {
  scrollY?: number;
  isImagesLoaded: boolean;
  transparent?: boolean;
  onConnectClick?: () => void;
}

export default function NavigationBar({
  scrollY: propScrollY,
  isImagesLoaded,
  transparent = false,
  onConnectClick,
}: NavigationBarProps) {
  const router = useRouter();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [internalScrollY, setInternalScrollY] = useState(0);

  useEffect(() => {
    if (propScrollY !== undefined) return;
    const handleScroll = () => {
      setInternalScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [propScrollY]);

  const scrollY = propScrollY !== undefined ? propScrollY : internalScrollY;

  // Responsive navItems: filter on desktop, all on mobile
  const navItems = [
    ...NAV_LINKS.filter((link) => link.label !== "Compounds").map((link) => ({
      label: link.label,
      href: link.href,
      color: link.color,
    })),
  ];
  const navItemsAll = [
    ...NAV_LINKS.map((link) => ({
      label: link.label,
      href: link.href,
      color: link.color,
    })),
  ];

  // Determine navbar background and font color based on scroll
  const navBg = scrollY > 100 ? "transparent" : "transparent";
  const navShadow = scrollY > 100 ? "none" : "none";
  const fontColor = "#8C2224";
  const logoBg = "#8C2224";
  const logoStroke = "#fff";
  const getStartedBg = "#8C2224";
  const getStartedColor = "#fff";

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 27px 20px 5px",
        background: transparent ? "transparent" : navBg,
        boxShadow: navShadow,
        backdropFilter: "none",
        transition: "all 0.4s ease",
        opacity: isImagesLoaded ? 1 : 0,
      }}
    >
      {/* Desktop: left logo, right nav links; Mobile: centered logo only */}
      <div
        className="navbar-logo-container"
        style={{
          display: "flex",
          alignItems: "flex-start",
          cursor: "pointer",
          marginTop: "-7px",
          marginLeft: "4px",
          justifyContent: "flex-start",
          flexWrap: "nowrap",
          width: "auto",
        }}
        onClick={() => router.push("/")}
      >
        <svg
          width="87.5"
          height="87.5"
          viewBox="0 0 500 500"
          xmlns="http://www.w3.org/2000/svg"
          style={{ transition: "transform 0.3s ease" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = "scale(1.05)")
          }
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          className="navbar-logo-svg"
        >
          <defs>
            <linearGradient
              id="logo-gradient"
              x1="370.57"
              y1="198.83"
              x2="162.5"
              y2="373.43"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" stopColor="#640b10" />
              <stop offset=".36" stopColor="#640b0f" stopOpacity=".32" />
              <stop offset=".53" stopColor="#640b0f" stopOpacity=".04" />
            </linearGradient>
          </defs>
          <rect
            fill="#b41f24"
            x="310.19"
            y="279.6"
            width="57.01"
            height="117"
            rx="7.12"
            ry="7.12"
          />
          <path
            fill="#b41f24"
            d="M151.08,281.43h57.01v111.93c0,2.8-2.27,5.07-5.07,5.07h-46.87c-2.8,0-5.07-2.27-5.07-5.07v-111.93h0Z"
          />
          <rect
            fill="#ed2024"
            x="401.55"
            y="265.23"
            width="32.24"
            height="107.29"
            rx="7.12"
            ry="7.12"
          />
          <rect
            fill="#b41f24"
            x="408.91"
            y="262.68"
            width="55.04"
            height="15.52"
            rx="2.61"
            ry="2.61"
          />
          <path
            fill="#b41f24"
            d="M360.77,196.81c0-7.11,4.51-13.17,10.83-15.47v-21.69h-151.5c-52.66,0-95.35,42.69-95.35,95.35v88.74c0,1.13.91,2.04,2.04,2.04h11.85c1.13,0,2.04-.91,2.04-2.04v-65.55h10.4l.35,67.58h124.82c52.66,0,95.35-42.69,95.35-95.35v-38.15c-6.32-2.3-10.83-8.36-10.83-15.47Z"
          />
          <path
            fill="url(#logo-gradient)"
            d="M360.77,196.81c0-2.02.36-3.95,1.03-5.74-8.91-18.59-27.9-31.42-49.89-31.42h-96.83c-25.29,1.56-56.91,14.38-74.31,42.43-6.52,9.98-12.07,20.92-14.63,34.86l24.94,38.22v83.35c0,11.03,31.19-13.61,57.01-12.73,79.34,2.69,74.73.53,101.82-6.04,0,0,1.31,55,.29,56.86h57.01v-181.64c0-1.78-.09-3.55-.25-5.29-3.77-3.02-6.19-7.65-6.19-12.85Z"
          />
          <path
            fill="#ed2024"
            d="M368.78,132.05h-81.14v81.14c0,35.91,29.11,65.01,65.01,65.01h81.14v-81.14c0-35.91-29.11-65.01-65.01-65.01ZM377.23,213.27c-9.09,0-16.46-7.37-16.46-16.46s7.37-16.46,16.46-16.46,16.46,7.37,16.46,16.46-7.37,16.46-16.46,16.46Z"
          />
        </svg>
      </div>

      {/* Desktop nav links */}
      <div
        className="navbar-links-desktop"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "32px",
          marginTop: "-5px",
          marginLeft: "4px",
        }}
      >
        {navItems.map((item, idx) => (
          <div
            key={item.label}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              cursor: "pointer",
            }}
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => {
              if (item.href.startsWith("/")) {
                router.push(item.href);
              }
            }}
          >
            <span
              style={{
                color: item.color || fontColor,
                fontSize: "15px",
                fontWeight: 600,
                textDecoration: "none",
                transition: "color 0.3s",
                position: "relative",
                paddingBottom: "4px",
                letterSpacing: 0.5,
                textShadow:
                  scrollY > 100
                    ? "0 2px 8px rgba(255,255,255,0.08)"
                    : "0 2px 8px rgba(0,0,0,0.12)",
              }}
            >
              {item.label}
            </span>
            <span
              style={{
                display: "block",
                height: "3px",
                width: hoveredIndex === idx ? "100%" : "0%",
                background: "#8C2224",
                borderRadius: "2px",
                transition: "width 0.3s cubic-bezier(.4,0,.2,1)",
                marginTop: "2px",
              }}
            />
          </div>
        ))}
        <button
          onClick={onConnectClick}
          style={{
            padding: "10px 24px",
            background: "#8C2224",
            border: "none",
            borderRadius: "100px",
            color: "#fff",
            fontSize: "15px",
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 4px 20px rgba(140, 34, 36, 0.15)",
            letterSpacing: 0.5,
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.boxShadow =
              "0 6px 24px rgba(140, 34, 36, 0.25)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow =
              "0 4px 20px rgba(140, 34, 36, 0.15)";
          }}
        >
          Connect
        </button>
      </div>

      {/* Mobile Connect Button */}
      <button
        className="navbar-connect-mobile"
        onClick={onConnectClick}
        style={{
          padding: "8px 16px",
          background: "#8C2224",
          border: "none",
          borderRadius: "12px",
          color: "#fff",
          fontSize: "13px",
          fontWeight: 700,
          cursor: "pointer",
          boxShadow: "0 4px 20px rgba(140, 34, 36, 0.15)",
          letterSpacing: 0.5,
          marginRight: "-12px", // Negative margin to push closer to edge
          display: "none", // Hidden by default on desktop
        }}
      >
        Connect
      </button>

      <style>{`
        @media (max-width: 1024px) {
          .navbar-links-desktop {
            display: none !important;
          }
          .navbar-connect-mobile {
            display: block !important;
          }
          .navbar-logo-container {
            margin-top: -10px !important;
            margin-left: 0 !important;
            justify-content: flex-start !important;
          }
          .navbar-logo-svg {
            display: block;
            width: 70px !important;
            height: 70px !important;
          }
        }
      `}</style>
    </nav>
  );
}
