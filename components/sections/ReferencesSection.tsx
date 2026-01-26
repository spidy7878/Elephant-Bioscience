"use client";

import { motion } from "framer-motion";
import { PUBLICATIONS } from "@/lib/constants";

export default function ReferencesSection() {
  return (
    <section className="relative z-10 px-6 md:px-16 py-16 md:py-24 border-t border-border">
      <div className="max-w-5xl mx-auto">
        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-text-muted mb-8">
          Scientific References
        </h3>

        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
          {PUBLICATIONS.map((ref, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="font-mono text-xs md:text-sm text-text-secondary leading-relaxed p-4 md:p-5 bg-white/[0.02] rounded-xl border border-border hover:border-accent-orange/20 hover:bg-accent-orange/[0.02] transition-all interactive"
            >
              [{index + 1}] {ref.authors} ({ref.year}) &quot;{ref.title}&quot;{" "}
              <a href="#" className="text-accent-orange hover:underline">
                {ref.journal}
              </a>{" "}
              {ref.volume}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
