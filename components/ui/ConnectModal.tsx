"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

type RequestHandlerResult =
    | boolean
    | { success: boolean; errors?: { email?: string; phone?: string } };

interface ConnectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onRequest?: (data?: {
        email: string;
        phone: string;
    }) => RequestHandlerResult | Promise<RequestHandlerResult> | void;
}

/* Motion variants */
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

/* Style objects */
const containerStyle: React.CSSProperties = {
    background:
        "linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03))",
    boxShadow:
        "0 10px 30px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.03)",
    willChange: "transform, opacity",
    transform: "translate3d(0, 0, 0)",
    backfaceVisibility: "hidden" as const,
};

function ConnectModalInner({ isOpen, onClose, onRequest }: ConnectModalProps) {
    const reduceMotion = useReducedMotion();

    // Request Entry fields
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [emailError, setEmailError] = useState<string | null>(null);
    const [phoneError, setPhoneError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const prevBodyOverflow = useRef<string>("");

    useEffect(() => {
        if (isOpen) {
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
        }
    }, [isOpen, onClose]);

    const handleConnectSubmit = useCallback(
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

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="fixed inset-0 z-50 flex items-center justify-center"
                >
                    {/* Backdrop */}
                    <motion.div
                        variants={overlayVariants}
                        className="absolute inset-0 bg-black/50"
                        onClick={onClose}
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
                        className="relative flex flex-col rounded-xl w-[85vw] max-w-[320px] min-h-[340px] p-6 shadow-none border border-white/10 overflow-hidden items-center justify-center"
                        style={containerStyle}
                    >
                        {/* Close button */}
                        <div className="absolute top-2 right-2 z-[100]">
                            <button
                                aria-label="Close modal"
                                onClick={onClose}
                                className="text-white/90 hover:text-white transition flex items-center justify-center w-8 h-8 rounded-full bg-white/6 hover:bg-white/10 text-2xl"
                            >
                                ×
                            </button>
                        </div>

                        {/* Title */}


                        <div className="w-full">
                            <form
                                onSubmit={handleConnectSubmit}
                                className="flex flex-col items-center gap-3"
                            >
                                <div className="w-full flex flex-col items-center">
                                    <input
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            if (emailError) setEmailError(null);
                                        }}
                                        placeholder={emailError ?? "Email"}
                                        className={`w-full py-2.5 px-4 rounded-lg font-medium outline-none ${emailError
                                            ? "placeholder-red-500"
                                            : "placeholder-[#8C2224]/60"
                                            } ${emailError ? "border-2 border-red-400" : ""}`}
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

                                <div className="w-full flex flex-col items-center">
                                    <input
                                        value={phone}
                                        onChange={(e) => {
                                            setPhone(e.target.value);
                                            if (phoneError) setPhoneError(null);
                                        }}
                                        placeholder={phoneError ?? "Phone No."}
                                        className={`w-full py-2.5 px-4 rounded-lg font-medium outline-none ${phoneError
                                            ? "placeholder-red-500"
                                            : "placeholder-[#8C2224]/60"
                                            } ${phoneError
                                                ? "border-2 border-red-400"
                                                : "border-2 border-black/40"
                                            }`}
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
                                    className="w-full py-2.5 rounded-xl bg-[#8C2224] text-white font-semibold text-lg mt-4 shadow-md transition-transform active:scale-95"
                                    style={{ boxShadow: "0 8px 30px rgba(140,34,36,0.18)" }}
                                >
                                    {loading ? "Connecting..." : "Connect"}
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

const ConnectModal = (props: ConnectModalProps) => {
    if (typeof document === "undefined") return null;
    return createPortal(<ConnectModalInner {...props} />, document.body);
};

export default React.memo(ConnectModal);
