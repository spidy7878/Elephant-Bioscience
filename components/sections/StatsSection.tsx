'use client'

import { motion } from 'framer-motion'
import { STATS } from '@/lib/constants'

export default function StatsSection() {
  return (
    <section className="relative z-10 px-6 md:px-16 py-12">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6">
        {STATS.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="group glass-card p-7 relative overflow-hidden interactive"
          >
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-accent-red to-accent-orange scale-x-0 group-hover:scale-x-100 transition-transform duration-400 origin-left" />
            
            <p className="text-[10px] font-semibold uppercase tracking-widest text-text-muted mb-3">
              {stat.label}
            </p>
            <p className="font-mono text-3xl md:text-4xl font-bold bg-gradient-to-br from-white to-accent-orange bg-clip-text text-transparent">
              {stat.value}
              <span className="text-lg md:text-xl text-text-secondary">{stat.unit}</span>
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}