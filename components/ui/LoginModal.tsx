"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

// Assign env variables to constants at build time for client-side use
const ENV_LOGIN_ID = process.env.NEXT_PUBLIC_LOGIN_ID;
const ENV_LOGIN_PASSWORD = process.env.NEXT_PUBLIC_LOGIN_PASSWORD;

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
  const [id, setId] = useState("");
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

  const handleLoginSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();
      setIdError(null);
      setPasswordError(null);

      let hasError = false;
      if (!id.trim()) {
        setIdError("Please enter ID");
        hasError = true;
      }
      if (!password.trim()) {
        setPasswordError("Please enter Password");
        hasError = true;
      }
      if (hasError) return;

      if (onLogin) {
        try {
          setLoading(true);
          const result = await Promise.resolve(
            onLogin({ id: id.trim(), password })
          );
          setLoading(false);

          if (typeof result === "boolean") {
            if (result === true) {
              onClose();
              router.push("/products");
              return;
            } else {
              setIdError("Invalid ID");
              setPasswordError("Invalid Password");
              setPassword("");
              return;
            }
          } else {
            if (result.success) {
              onClose();
              router.push("/products");
              return;
            } else {
              setIdError(result.errors?.id ?? "Invalid ID");
              setPasswordError(result.errors?.password ?? "Invalid Password");
              setPassword("");
              return;
            }
          }
        } catch {
          setLoading(false);
          setIdError("Login failed. Try again.");
        }
      } else {
        // Use credentials from environment variables or dummy fallback
        const dummyId = ENV_LOGIN_ID || "admin";
        const dummyPassword = ENV_LOGIN_PASSWORD || "admin";

        if (id.trim() === dummyId && password === dummyPassword) {
          onClose();
          router.push("/products");
        } else {
          setIdError("Invalid ID");
          setPasswordError("Invalid Password");
          setPassword("");
        }
      }
    },
    [id, password, onLogin, onClose, router]
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

      if (onRequest) {
        try {
          setLoading(true);
          const result = await Promise.resolve(
            onRequest({ email: email.trim(), phone: phone.trim() })
          );
          setLoading(false);

          if (result === undefined) {
            onClose();
            return;
          }

          if (typeof result === "boolean") {
            if (result === true) {
              onClose();
              return;
            } else {
              setEmailError("Invalid Email");
              setPhoneError("Invalid Phone");
              return;
            }
          } else {
            if (result.success) {
              onClose();
              return;
            } else {
              setEmailError(result.errors?.email ?? "Invalid Email");
              setPhoneError(result.errors?.phone ?? "Invalid Phone");
              return;
            }
          }
        } catch {
          setLoading(false);
          setEmailError("Request failed. Try again.");
        }
      } else {
        onClose();
      }
    },
    [email, phone, onRequest, onClose]
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
            className="relative flex rounded-xl max-h-[80vh] h-auto w-full py-12 px-3 sm:w-[min(95vw,300px)] shadow-none border border-white/10 overflow-hidden items-center justify-center"
            style={containerStyle}>

            {/* Back icon for login/request mode */}
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
                className="absolute top-3 left-3 text-white/90 hover:text-white transition flex items-center justify-center w-11 h-11 rounded-full bg-white/6 hover:bg-white/10 text-2xl"
                type="button"
                style={{ zIndex: 2 }}
              >
                {/* Simple left arrow SVG */}
                <svg
                  width="24"
                  height="24"
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

            <button
              aria-label="Close modal"
              onClick={handleClose}
              className="absolute top-3 right-3 text-white/90 hover:text-white transition flex items-center justify-center w-11 h-11 rounded-full bg-white/6 hover:bg-white/10 text-3xl"
            >
              ×
            </button>

            <div className="relative z-10 w-full">
              {children ? (
                children
              ) : mode === "choices" ? (
                <div className="flex flex-col items-center gap-6 py-4">
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
