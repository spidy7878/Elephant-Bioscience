"use client";

import {
  CheckCircle,
  Shield,
  FileText,
  Truck,
  Clock,
  MessageCircle,
} from "lucide-react";

const FEATURES = [
  {
    icon: CheckCircle,
    title: "99%+ Verified Purity",
    description:
      "Every batch is subjected to HPLC and mass spectrometry analysis.",
  },
  {
    icon: Shield,
    title: "Third-Party Validated",
    description:
      "Independent laboratory verification provides unbiased confirmation.",
  },
  {
    icon: FileText,
    title: "Complete Documentation",
    description: "Full Certificate of Analysis included with every shipment.",
  },
  {
    icon: Truck,
    title: "Cryo-Shipping",
    description: "Temperature-controlled logistics ensures compound integrity.",
  },
  {
    icon: Clock,
    title: "24-Hour Dispatch",
    description: "Orders placed before 2 PM EST ship same day.",
  },
  {
    icon: MessageCircle,
    title: "Expert Support",
    description: "Our team provides technical consultation.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-24 px-6 md:px-16 bg-transparent">
      {/* Header */}
      <div className="text-center mb-16">
        <span className="text-xs font-bold uppercase tracking-[0.3em] text-orange-500 mb-4 block">
          Why Choose Us
        </span>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6">
          Engineered for Excellence
        </h2>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          Every compound undergoes rigorous multi-stage verification to ensure
          pharmaceutical-grade quality.
        </p>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {FEATURES.map((feature, index) => {
          const IconComponent = feature.icon;

          return (
            <div
              key={index}
              className="group bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 hover:border-orange-500/30 hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-500"
            >
              {/* Icon */}
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500/20 to-red-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <IconComponent className="w-8 h-8 text-orange-500" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
