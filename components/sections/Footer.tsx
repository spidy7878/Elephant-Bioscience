"use client";

import { FEATURES, FOOTER_LINKS, SITE_CONFIG } from "lib/constants";
import Link from "next/link";
import {
    CheckCircle,
    Shield,
    FileText,
    Truck,
    Clock,
    MessageCircle,
    Twitter,
    Linkedin,
    Github,
    Mail,
    Phone,
} from "lucide-react";

const iconMap: Record<string, any> = {
    CheckCircle,
    Shield,
    FileText,
    Truck,
    Clock,
    MessageCircle,
};

export default function Footer() {
    return (
        <footer className="relative bg-black text-white pt-24 pb-12 overflow-hidden z-20">
            <div className="absolute top-0 left-0 w-full h-full bg-black/60 z-[-1] pointer-events-none" />
            <div className="max-w-7xl mx-auto px-6">
                {/* FEATURES GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                    {FEATURES.map((feature, idx) => {
                        const Icon = iconMap[feature.icon];
                        return (
                            <div
                                key={idx}
                                className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-white/20"
                            >
                                <div className="w-12 h-12 rounded-full bg-[#8C2224]/20 flex items-center justify-center mb-4">
                                    {Icon && <Icon className="w-6 h-6 text-[#8C2224]" />}
                                </div>
                                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                                <p className="text-gray-400 leading-relaxed text-sm">
                                    {feature.description}
                                </p>
                            </div>
                        );
                    })}
                </div>

                <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-16" />

                {/* FOOTER LINKS */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
                    {/* BRAND */}
                    <div className="md:col-span-4 space-y-6">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-[#8C2224] rounded-lg flex items-center justify-center">
                                <span className="font-bold text-xl">NX</span>
                            </div>
                            <span className="text-2xl font-bold tracking-tight">
                                {SITE_CONFIG.name}
                            </span>
                        </div>
                        <p className="text-gray-400 leading-relaxed">
                            {SITE_CONFIG.description}
                        </p>
                        <div className="flex items-center gap-4">
                            <Link
                                href={SITE_CONFIG.social.twitter}
                                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#8C2224] transition-colors"
                            >
                                <Twitter className="w-5 h-5" />
                            </Link>
                            <Link
                                href={SITE_CONFIG.social.linkedin}
                                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#8C2224] transition-colors"
                            >
                                <Linkedin className="w-5 h-5" />
                            </Link>
                            <Link
                                href={SITE_CONFIG.social.github}
                                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#8C2224] transition-colors"
                            >
                                <Github className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>

                    {/* LINK COLUMNS */}
                    <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
                        <div>
                            <h4 className="font-bold mb-6 text-[#8C2224]">Products</h4>
                            <ul className="space-y-4">
                                {FOOTER_LINKS.products.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="text-gray-400 hover:text-white transition-colors text-sm"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-6 text-[#8C2224]">Resources</h4>
                            <ul className="space-y-4">
                                {FOOTER_LINKS.resources.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="text-gray-400 hover:text-white transition-colors text-sm"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-6 text-[#8C2224]">Company</h4>
                            <ul className="space-y-4">
                                {FOOTER_LINKS.company.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="text-gray-400 hover:text-white transition-colors text-sm"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-6 text-[#8C2224]">Contact</h4>
                            <ul className="space-y-4">
                                <li className="flex items-center gap-3 text-gray-400 text-sm">
                                    <Mail className="w-4 h-4 text-[#8C2224]" />
                                    {SITE_CONFIG.contact.email}
                                </li>
                                <li className="flex items-center gap-3 text-gray-400 text-sm">
                                    <Phone className="w-4 h-4 text-[#8C2224]" />
                                    {SITE_CONFIG.contact.phone}
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* BOTTOM BAR */}
                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-sm">
                        © {new Date().getFullYear()} {SITE_CONFIG.name}. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        {FOOTER_LINKS.legal.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                className="text-gray-500 hover:text-white transition-colors text-sm"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
