"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

// Strapi API endpoints
const STRAPI_LOGIN_URL = process.env.NEXT_PUBLIC_STRAPI_URL
  ? `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/auth/local`
  : "/api/auth/local";
const STRAPI_REQUEST_ENTRY_URL = process.env.NEXT_PUBLIC_STRAPI_URL
  ? `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/request-entries`
  : "/api/request-entries";

type LoginHandlerResult =
  | boolean
  | { success: boolean; errors?: { id?: string; password?: string } };
type RequestHandlerResult =
  | boolean
  | { success: boolean; errors?: { email?: string; phone?: string } };

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  onLogin?: (creds?: {
    id: string;
    password: string;
  }) => LoginHandlerResult | Promise<LoginHandlerResult>;
  onRequest?: (data?: {
    email: string;
    phone: string;
  }) => RequestHandlerResult | Promise<RequestHandlerResult> | void;
}

/* Motion variants kept outside component to avoid recreating them */
const overlayVariants = {
  hidden: { opacity: 0, pointerEvents: "none" as const },
  visible: { opacity: 1, pointerEvents: "auto" as const },
  exit: { opacity: 0, pointerEvents: "none" as const },
};

const modalVariants = {
  hidden: { y: 20, opacity: 0, scale: 0.985, willChange: "transform, opacity" },
  visible: { y: 0, opacity: 1, scale: 1, willChange: "transform, opacity" },
  exit: { y: 20, opacity: 0, scale: 0.985, willChange: "auto" },
};

/* small constant style objects to avoid inline recreation */
const containerStyle: React.CSSProperties = {
  background:
    "linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03))",
  boxShadow:
    "0 10px 30px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.03)",
  willChange: "transform, opacity",
  transform: "translate3d(0, 0, 0)",
  backfaceVisibility: "hidden" as const,
};

function ModalInner({
  isOpen,
  onClose,
  children,
  onLogin,
  onRequest,
}: ModalProps) {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [mode, setMode] = useState<"choices" | "login" | "request">("choices");

  // Login fields
  const [id, setId] = useState(""); // username or email
  const [password, setPassword] = useState("");
  const [idError, setIdError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Request Entry fields
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  const prevBodyOverflow = useRef<string>("");

  useEffect(() => {
    if (isOpen) {
      setMode("choices");
      setId("");
      setPassword("");
      setIdError(null);
      setPasswordError(null);
      setEmail("");
      setPhone("");
      setEmailError(null);
      setPhoneError(null);

      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      document.addEventListener("keydown", onKey);
      prevBodyOverflow.current = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.removeEventListener("keydown", onKey);
        document.body.style.overflow = prevBodyOverflow.current;
      };
    } else {
      setIdError(null);
      setPasswordError(null);
      setEmailError(null);
      setPhoneError(null);
    }
  }, [isOpen, onClose]);

  // Login handler for Strapi CMS
  const handleLoginSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();
      setIdError(null);
      setPasswordError(null);

      let hasError = false;
      if (!id.trim()) {
        setIdError("Please enter username or email");
        hasError = true;
      }
      if (!password.trim()) {
        setPasswordError("Please enter Password");
        hasError = true;
      }
      if (hasError) return;

      setLoading(true);
      try {
        // Strapi allows login with either identifier (username or email) and password
        const res = await fetch(STRAPI_LOGIN_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ identifier: id.trim(), password }),
        });
        const data = await res.json();
        setLoading(false);

        if (res.ok && data.jwt) {
          // Optionally, store JWT in localStorage or cookie for session
          localStorage.setItem("strapi_jwt", data.jwt);
          // You may also want to store user info
          localStorage.setItem("strapi_user", JSON.stringify(data.user));
          onClose();
          router.push("/products");
        } else {
          // Strapi error format: { error: { message: ... } }
          const errorMsg = data?.error?.message || "Invalid credentials";
          setIdError(errorMsg);
          setPasswordError(errorMsg);
          setPassword("");
        }
      } catch (err) {
        setLoading(false);
        setIdError("Login failed. Try again.");
      }
    },
    [id, password, onClose, router]
  );

  const handleRequestSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();
      setEmailError(null);
      setPhoneError(null);

      let hasError = false;
      if (!email.trim()) {
        setEmailError("Please enter Email");
        hasError = true;
      } else {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!re.test(email.trim())) {
          setEmailError("Enter a valid email");
          hasError = true;
        }
      }
      if (!phone.trim()) {
        setPhoneError("Please enter Phone No.");
        hasError = true;
      } else {
        const digits = phone.replace(/\D/g, "");
        if (digits.length < 7) {
          setPhoneError("Enter a valid phone no.");
          hasError = true;
        }
      }
      if (hasError) return;

      setLoading(true);
      try {
        // Send request entry to Strapi backend
        const res = await fetch(STRAPI_REQUEST_ENTRY_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            data: {
              email: email.trim(),
              phone: phone.trim(),
            },
          }),
        });
        setLoading(false);

        if (res.ok) {
          onClose();
        } else {
          setEmailError("Failed to submit request.");
        }
      } catch {
        setLoading(false);
        setEmailError("Request failed. Try again.");
      }
    },
    [email, phone, onClose]
  );

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          {/* Backdrop: animate only opacity; static blur for performance */}
          <motion.div
            variants={overlayVariants}
            className="absolute inset-0 bg-black/50"
            onClick={handleClose}
            style={{
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
            }}
            transition={{
              duration: reduceMotion ? 0 : 0.15,
              ease: "easeOut",
            }}
          />

          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 300,
              mass: 0.8,
              duration: reduceMotion ? 0 : undefined,
            }}
            exit={{
              y: 20,
              opacity: 0,
              scale: 0.985,
              transition: {
                duration: reduceMotion ? 0 : 0.15,
                ease: "easeIn",
              },
            }}
            role="dialog"
            aria-modal="true"
            className="relative flex rounded-xl w-[85vw] h-[70vw] max-w-[280px] max-h-[280px] sm:w-[300px] sm:h-[300px] md:w-[320px] md:h-[320px] px-3 py-4 shadow-none border border-white/10 overflow-hidden items-center justify-center"
            style={containerStyle}
          >
            {/* Top Navigation Bar: Back and Close buttons */}
            <div className="absolute top-2 left-0 right-0 flex items-center justify-between px-3 z-[100] w-full pointer-events-none">
              <div className="flex-1 pointer-events-auto">
                {(mode === "login" || mode === "request") && (
                  <button
                    aria-label="Back"
                    onClick={() => {
                      setMode("choices");
                      setIdError && setIdError(null);
                      setPasswordError && setPasswordError(null);
                      setEmailError && setEmailError(null);
                      setPhoneError && setPhoneError(null);
                    }}
                    className="text-white/90 hover:text-white transition flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/6 hover:bg-white/10 text-xl sm:text-2xl"
                    type="button"
                  >
                    <svg
                      width="20"
                      height="20"
                      className="sm:w-6 sm:h-6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M15 19l-7-7 7-7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                )}
              </div>
              <div className="flex-none pointer-events-auto">
                <button
                  aria-label="Close modal"
                  onClick={handleClose}
                  className="text-white/90 hover:text-white transition flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/6 hover:bg-white/10 text-2xl sm:text-3xl"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="relative z-10 w-full">
              {children ? (
                children
              ) : mode === "choices" ? (
                <div className="flex flex-col items-center gap-8 py-4">
                  <button
                    onClick={() => {
                      setMode("login");
                      setIdError(null);
                      setPasswordError(null);
                    }}
                    className="w-44 py-2.5 rounded-xl bg-[#661113] text-white font-normal text-lg shadow-md opacity-66"
                  >
                    Login
                  </button>

                  <button
                    onClick={() => {
                      setMode("request");
                      setEmailError(null);
                      setPhoneError(null);
                    }}
                    className="w-44 py-2.5 rounded-xl bg-[#661113] text-white font-normal text-lg shadow-md opacity-66"
                  >
                    Request Entry
                  </button>
                </div>
              ) : mode === "login" ? (
                <form
                  onSubmit={handleLoginSubmit}
                  className="flex flex-col items-center gap-2"
                >
                  <div className="w-full flex flex-col items-center">
                    <input
                      value={id}
                      onChange={(e) => {
                        setId(e.target.value);
                        if (idError) setIdError(null);
                      }}
                      placeholder={idError ?? "ID"}
                      className={`w-44 py-3 px-4 rounded-lg font-medium outline-none ${idError ? "placeholder-red-500" : "placeholder-[#8C2224]/60"} ${idError ? "border-2 border-red-400" : ""}`}
                      style={{
                        background: "rgba(255,255,255,0.95)",
                        color: "#8C2224",
                        boxShadow: "inset 0 1px 0 rgba(0,0,0,0.06)",
                      }}
                      autoFocus
                    />
                    {idError && (
                      <p className="mt-1 text-red-400 text-sm">{idError}</p>
                    )}
                  </div>

                  <div className="w-full flex flex-col items-center mt-2">
                    <input
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (passwordError) setPasswordError(null);
                      }}
                      placeholder={passwordError ?? "Password"}
                      type="password"
                      className={`w-44 py-3 px-4 rounded-lg font-medium outline-none ${passwordError ? "placeholder-red-500" : "placeholder-[#8C2224]/60"} ${passwordError ? "border-2 border-red-400" : "border-2 border-black/40"}`}
                      style={{
                        background: "rgba(255,255,255,0.9)",
                        color: "#8C2224",
                      }}
                    />
                    {passwordError && (
                      <p className="mt-1 text-red-400 text-sm">
                        {passwordError}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-44 py-2.5 rounded-xl bg-[#8C2224] text-white font-semibold text-lg mt-4 shadow-md"
                    style={{ boxShadow: "0 8px 30px rgba(140,34,36,0.18)" }}
                  >
                    {loading ? "Checking..." : "Login"}
                  </button>
                </form>
              ) : (
                <form
                  onSubmit={handleRequestSubmit}
                  className="flex flex-col items-center gap-2"
                >
                  <div className="w-full flex flex-col items-center">
                    <input
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (emailError) setEmailError(null);
                      }}
                      placeholder={emailError ?? "Email"}
                      className={`w-44 py-2.5 px-4 rounded-lg font-medium outline-none ${emailError ? "placeholder-red-500" : "placeholder-[#8C2224]/60"} ${emailError ? "border-2 border-red-400" : ""}`}
                      style={{
                        background: "rgba(255,255,255,0.95)",
                        color: "#8C2224",
                        boxShadow: "inset 0 1px 0 rgba(0,0,0,0.06)",
                      }}
                      autoFocus
                    />
                    {emailError && (
                      <p className="mt-1 text-red-400 text-sm">{emailError}</p>
                    )}
                  </div>

                  <div className="w-full flex flex-col items-center mt-2">
                    <input
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (phoneError) setPhoneError(null);
                      }}
                      placeholder={phoneError ?? "Phone No."}
                      className={`w-44 py-2.5 px-4 rounded-lg font-medium outline-none ${phoneError ? "placeholder-red-500" : "placeholder-[#8C2224]/60"} ${phoneError ? "border-2 border-red-400" : "border-2 border-black/40"}`}
                      style={{
                        background: "rgba(255,255,255,0.9)",
                        color: "#8C2224",
                      }}
                    />
                    {phoneError && (
                      <p className="mt-1 text-red-400 text-sm">{phoneError}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-44 py-2.5 rounded-xl bg-[#661113] text-white font-semibold text-lg mt-4 shadow-md"
                    style={{ boxShadow: "0 8px 30px rgba(140,34,36,0.18)" }}
                  >
                    {loading ? "Submitting..." : "Request Entry"}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const Modal = (props: ModalProps) => {
  if (typeof document === "undefined") return null;
  return createPortal(<ModalInner {...props} />, document.body);
};

/* Memoize the modal to avoid re-renders when parent re-renders but props unchanged */
export default React.memo(Modal);
