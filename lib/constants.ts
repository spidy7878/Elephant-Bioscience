// ============================================
// VIDEO CONFIGURATION
// ============================================

export const VIDEO_CONFIG = {
  portalMaxSize: 400,
  scrubSensitivity: 1,
  morphStartScroll: 0.3,
  morphEndScroll: 0.7,
  maxVideoScale: 1.2,
  maxBlur: 20,
  smoothingFactor: 0.1,
};
// src/lib/constants.ts

// ============================================
// FEATURE TYPES & DATA
// ============================================

export interface Feature {
  icon: string;
  title: string;
  description: string;
}

export const FEATURES: Feature[] = [
  {
    icon: "CheckCircle",
    title: "99%+ Verified Purity",
    description:
      "Every batch is subjected to HPLC and mass spectrometry analysis, ensuring consistent pharmaceutical-grade purity.",
  },
  {
    icon: "Shield",
    title: "Third-Party Validated",
    description:
      "Independent laboratory verification from Janoshik Analytical provides unbiased confirmation of compound identity.",
  },
  {
    icon: "FileText",
    title: "Complete Documentation",
    description:
      "Full Certificate of Analysis, handling protocols, and reconstitution guides included with every shipment.",
  },
  {
    icon: "Truck",
    title: "Cryo-Shipping",
    description:
      "Temperature-controlled logistics with real-time monitoring ensures compound integrity.",
  },
  {
    icon: "Clock",
    title: "24-Hour Dispatch",
    description:
      "Orders placed before 2 PM EST ship same day. Global delivery network ensures rapid arrival.",
  },
  {
    icon: "MessageCircle",
    title: "Expert Support",
    description:
      "Our team of biochemists provides technical consultation for experimental design.",
  },
];

// ============================================
// MICROSCOPE CONFIGURATION
// ============================================

export const MICROSCOPE_CONFIG = {
  totalFrames: 120,
  imagePrefix: "/images2/",
  imageSuffix: "_converted.avif",
  scrollHeight: "600vh",

  // Frame ranges for different zoom levels
  zoomLevels: {
    overview: { start: 1, end: 30 }, // 1x - 50x magnification
    medium: { start: 31, end: 60 }, // 50x - 150x magnification
    close: { start: 61, end: 90 }, // 150x - 300x magnification
    ultraClose: { start: 91, end: 120 }, // 300x - 500x magnification
  },

  // UI display settings
  magnification: {
    min: 1,
    max: 500,
  },
  focusDepth: {
    min: 0,
    max: 5.0,
    unit: "μm",
  },
};

// Helper function to generate image paths
export const generateMicroscopeImagePaths = (): string[] => {
  const images: string[] = [];
  for (let i = 1; i <= MICROSCOPE_CONFIG.totalFrames; i++) {
    const paddedNumber = i.toString().padStart(4, "0");
    images.push(
      `${MICROSCOPE_CONFIG.imagePrefix}${paddedNumber}${MICROSCOPE_CONFIG.imageSuffix}`
    );
  }
  return images;
};

// ============================================
// PRODUCT DATA
// ============================================

export interface Product {
  name: string;
  catalogNumber: string;
  description: string;
  shortDescription: string;
  price: number;
  quantity: string;
  purity: number;
  molecularWeight: number;
  molecularFormula: string;
  sequence: string;
  solubility: string;
  storage: string;
  halfLife: string;
  netCharge: string;
  ph: string;
  inStock: boolean;
  casNumber?: string;
  appearance?: string;
}

export const PRODUCT_DATA: Product = {
  name: "NXB-7749",
  catalogNumber: "NXB-7749",
  description:
    "A novel peptide-based compound designed for targeted neural pathway research. Engineered for high binding affinity to GABA-A receptor subtypes with exceptional selectivity and metabolic stability.",
  shortDescription:
    "Novel peptide-based compound for targeted neural pathway research",
  price: 2450,
  quantity: "10mg",
  purity: 99.7,
  molecularWeight: 847.3,
  molecularFormula: "C₄₂H₆₃N₉O₁₁S",
  sequence: "H-Gly-Arg-Phe-NH₂",
  solubility: "DMSO, H₂O",
  storage: "-20°C, desiccated",
  halfLife: ">24h (in vitro)",
  netCharge: "+2.4",
  ph: "7.4",
  inStock: true,
  casNumber: "12345-67-8",
  appearance: "White lyophilized powder",
};

// ============================================
// BINDING / RECEPTOR DATA
// ============================================

export interface BindingData {
  label: string;
  value: number;
  ki: string;
  highlight?: boolean;
}

export const BINDING_DATA: BindingData[] = [
  { label: "α1β2γ2", value: 85, ki: "847" },
  { label: "α2β3γ2", value: 72, ki: "623" },
  { label: "α3β3γ2", value: 45, ki: "312" },
  { label: "α5β3γ2", value: 4, ki: "4.2", highlight: true },
  { label: "α5β2γ2", value: 8, ki: "12.8", highlight: true },
];

// ============================================
// PUBLICATIONS / REFERENCES
// ============================================

export interface Publication {
  title: string;
  journal: string;
  year: string;
  volume: string;
  doi: string;
  authors?: string;
}

export const PUBLICATIONS: Publication[] = [
  {
    title:
      "Selective modulation of α5-containing GABA-A receptors in cognitive enhancement",
    journal: "Nature Neuroscience",
    year: "2024",
    volume: "Vol. 27, pp. 1842-1856",
    doi: "10.1038/s41593-024-01642-8",
    authors: "Chen et al.",
  },
  {
    title:
      "Novel peptide-based approaches for targeted neural pathway research",
    journal: "Cell Reports",
    year: "2023",
    volume: "Vol. 42, Issue 8",
    doi: "10.1016/j.celrep.2023.112847",
    authors: "Martinez et al.",
  },
  {
    title: "Structure-activity relationships of synaptic modulators",
    journal: "Journal of Medicinal Chemistry",
    year: "2024",
    volume: "67 (4), pp. 2891-2904",
    doi: "10.1021/acs.jmedchem.3c02156",
    authors: "Williams et al.",
  },
];

// ============================================
// CHEMICAL PROPERTIES
// ============================================

export interface ChemicalProperty {
  label: string;
  value: string;
}

export const CHEMICAL_PROPERTIES: ChemicalProperty[] = [
  { label: "Molecular Formula", value: PRODUCT_DATA.molecularFormula },
  { label: "Sequence", value: PRODUCT_DATA.sequence },
  { label: "Solubility", value: PRODUCT_DATA.solubility },
  { label: "Storage", value: PRODUCT_DATA.storage },
  { label: "Half-life", value: PRODUCT_DATA.halfLife },
  { label: "Appearance", value: PRODUCT_DATA.appearance || "White powder" },
];

// ============================================
// QUALITY ASSURANCE
// ============================================

export interface QualityBadge {
  label: string;
  verified: boolean;
  description?: string;
}

export const QUALITY_BADGES: QualityBadge[] = [
  { label: "COA", verified: true, description: "Certificate of Analysis" },
  {
    label: "HPLC",
    verified: true,
    description: "High Performance Liquid Chromatography",
  },
  { label: "MS", verified: true, description: "Mass Spectrometry" },
  {
    label: "Third-Party Tested",
    verified: true,
    description: "Independent verification",
  },
  { label: "NMR", verified: true, description: "Nuclear Magnetic Resonance" },
];

// ============================================
// SITE CONFIGURATION
// ============================================

export const SITE_CONFIG = {
  name: "Nexora Biosciences",
  shortName: "Nexora",
  description:
    "Advanced peptide-based compounds for precision neuroscience research.",
  url: "https://nexora.bio",
  logo: {
    text: "NX",
    gradient: "from-orange-500 to-red-600",
  },
  contact: {
    email: "research@nexora.bio",
    phone: "+1 (555) 123-4567",
  },
  social: {
    twitter: "https://twitter.com/nexorabio",
    linkedin: "https://linkedin.com/company/nexorabio",
    github: "https://github.com/nexorabio",
  },
};

// ============================================
// NAVIGATION
// ============================================

export interface NavLink {
  label: string;
  href: string;
  external?: boolean;
  color?: string;
}

export const NAV_LINKS: NavLink[] = [
  { label: "contact@elephantbiosciences.com", href: "#about", color: "#8C2224" },
];

export const FOOTER_LINKS = {
  products: [
    { label: "Peptides", href: "/peptides" },
    { label: "Small Molecules", href: "/small-molecules" },
    { label: "Custom Synthesis", href: "/custom" },
    { label: "Bulk Orders", href: "/bulk" },
  ],
  resources: [
    { label: "Documentation", href: "/docs" },
    { label: "Research Papers", href: "/papers" },
    { label: "Protocols", href: "/protocols" },
    { label: "FAQ", href: "/faq" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Contact", href: "/contact" },
    { label: "Legal", href: "/legal" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Settings", href: "/cookies" },
  ],
};

// ============================================
// ANIMATION CONFIGURATION
// ============================================

export const ANIMATION_CONFIG = {
  scroll: {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  },
  fade: {
    duration: 0.6,
    ease: "easeOut",
  },
  slide: {
    duration: 0.8,
    ease: [0.25, 0.1, 0.25, 1],
  },
  stagger: {
    delay: 0.1,
  },
};

// ============================================
// MICROSCOPE UI SETTINGS
// ============================================

export const MICROSCOPE_UI = {
  leftPanels: [
    {
      label: "MAGNIFICATION",
      key: "magnification",
      format: (v: number) => `${v}x`,
    },
    {
      label: "FRAME",
      key: "frame",
      format: (v: number) => v.toString().padStart(4, "0"),
    },
    {
      label: "FOCUS",
      key: "focus",
      format: (v: number) => `${v.toFixed(2)}μm`,
    },
    { label: "SPECIMEN", key: "specimen", value: PRODUCT_DATA.name },
  ],
  rightPanels: [
    {
      label: "DATE",
      key: "date",
      value: () => new Date().toLocaleDateString("en-CA"),
    },
    { label: "TEMP", key: "temperature", value: "37.0°C" },
    { label: "EXPOSURE", key: "exposure", value: "1/250s" },
    { label: "LENS", key: "lens", value: "100x Oil" },
  ],
  reticle: {
    circleRadii: [60, 120, 180],
    crosshairDash: "6,6",
    cornerBracketSize: 12,
  },
};

// ============================================
// STATS DISPLAY
// ============================================

export interface StatItem {
  label: string;
  value: string;
  highlight?: boolean;
}

export const PRODUCT_STATS: StatItem[] = [
  { label: "PURITY", value: `${PRODUCT_DATA.purity}%` },
  { label: "Ki VALUE", value: "4.2 nM", highlight: true },
  { label: "SELECTIVITY", value: ">100x" },
  { label: "MOL. WEIGHT", value: `${PRODUCT_DATA.molecularWeight} g/mol` },
];

export const QUICK_STATS: StatItem[] = [
  { label: "PURITY", value: `${PRODUCT_DATA.purity}%` },
  { label: "Ki", value: "4.2 nM", highlight: true },
  { label: "SELECT.", value: ">100x" },
];
