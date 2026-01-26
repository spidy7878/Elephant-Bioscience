// src/components/ui/FeatureIcon.tsx

interface FeatureIconProps {
  name: string;
}

export default function FeatureIcon({ name }: FeatureIconProps) {
  const icons: Record<string, string> = {
    CheckCircle: "✓",
    Shield: "🛡",
    FileText: "📄",
    Truck: "🚚",
    Clock: "⏱",
    MessageCircle: "💬",
  };
  return <span>{icons[name] || "✓"}</span>;
}
