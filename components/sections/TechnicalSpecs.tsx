'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const TABS = [
  { id: 'chemical', label: 'Chemical Properties' },
  { id: 'description', label: 'Description' },
  { id: 'coa', label: 'COA / HPLC / MS' },
  { id: 'testing', label: '3rd Party Testing' },
  { id: 'storage', label: 'Storage' },
]

const CHEMICAL_PROPERTIES = [
  { label: 'Molecular Formula', value: 'C₁₁₁H₂₀₆N₃₆O₂₈S₂' },
  { label: 'Molecular Weight', value: '2557.2' },
  { label: 'Monoisotopic Mass', value: '2555.5243724' },
  { label: 'Polar Area', value: '1070' },
  { label: 'Complexity', value: '5220' },
  { label: 'XLogP', value: '-11.4' },
  { label: 'Heavy Atom Count', value: '177' },
  { label: 'Hydrogen Bond Donor Count', value: '40' },
  { label: 'Hydrogen Bond Acceptor Count', value: '40' },
  { label: 'Rotatable Bond Count', value: '98' },
]

const DESCRIPTION_CONTENT = {
  title: 'About Adipotide (FTPP)',
  paragraphs: [
    'Adipotide is a peptidomimetic with sequence CKGGRAKDC-GG-D(KLAKLAK)2 that has been shown to cause rapid weight loss in mice and rhesus monkeys by targeting and killing the blood vessels that supply white adipose tissue.',
    'The compound works by selectively triggering apoptosis in the endothelial cells of white adipose tissue vasculature, leading to the resorption of existing fat and prevention of new fat accumulation.',
    'Research has demonstrated significant potential in metabolic studies, with documented effects on body composition and metabolic parameters in preclinical models.',
  ],
}

const COA_DATA = [
  { label: 'Batch Number', value: 'ADT-2024-0892' },
  { label: 'Purity (HPLC)', value: '≥99.2%' },
  { label: 'Appearance', value: 'White Lyophilized Powder' },
  { label: 'Peptide Content', value: '≥85%' },
  { label: 'Acetate Content', value: '≤12%' },
  { label: 'Water Content', value: '≤6%' },
  { label: 'MS Confirmed', value: 'Yes - Mass Spec Verified' },
  { label: 'Endotoxin', value: '<0.1 EU/mg' },
]

const THIRD_PARTY_DATA = [
  { label: 'Testing Laboratory', value: 'Janoshik Analytical' },
  { label: 'Test Date', value: 'January 15, 2024' },
  { label: 'Certificate ID', value: 'JA-8827391-ADT' },
  { label: 'Purity Result', value: '99.1%' },
  { label: 'Identity Confirmed', value: 'Yes' },
  { label: 'Contamination Test', value: 'Pass - No Contaminants' },
  { label: 'Sterility', value: 'Pass' },
  { label: 'Overall Result', value: 'PASS ✓' },
]

const STORAGE_DATA = [
  { label: 'Lyophilized Storage', value: '-20°C (Recommended)' },
  { label: 'Reconstituted Storage', value: '2-8°C for up to 7 days' },
  { label: 'Long-term Reconstituted', value: '-20°C aliquoted' },
  { label: 'Protect From', value: 'Light, Heat, Moisture' },
  { label: 'Shelf Life (Lyophilized)', value: '24 months at -20°C' },
  { label: 'Recommended Solvent', value: 'Bacteriostatic Water / Sterile Water' },
  { label: 'Handling', value: 'Aseptic technique required' },
  { label: 'Container', value: 'Amber glass vial, sealed' },
]

interface TechnicalSpecsProps {
  isVisible: boolean
}

export default function TechnicalSpecs({ isVisible }: TechnicalSpecsProps) {
  const [activeTab, setActiveTab] = useState('chemical')

  const getTabContent = () => {
    switch (activeTab) {
      case 'chemical':
        return CHEMICAL_PROPERTIES
      case 'description':
        return null // Special case for description
      case 'coa':
        return COA_DATA
      case 'testing':
        return THIRD_PARTY_DATA
      case 'storage':
        return STORAGE_DATA
      default:
        return CHEMICAL_PROPERTIES
    }
  }

  const tabContent = getTabContent()

  return (
    <section
      style={{
        position: 'relative',
        zIndex: 10,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        padding: '80px 40px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '1600px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1.5fr 1fr',
          gap: '60px',
          alignItems: 'center',
        }}
      >
        {/* Left Side - Glass Card */}
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -100 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(40px)',
            WebkitBackdropFilter: 'blur(40px)',
            borderRadius: '32px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          }}
        >
          {/* Tab Navigation */}
          <div
            style={{
              display: 'flex',
              gap: '4px',
              padding: '16px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              overflowX: 'auto',
              scrollbarWidth: 'none',
            }}
          >
            {TABS.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  position: 'relative',
                  padding: '12px 20px',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'color 0.3s ease',
                  background: 'transparent',
                  color: activeTab === tab.id ? '#fff' : 'rgba(255,255,255,0.5)',
                  zIndex: 1,
                }}
                whileHover={{ color: '#fff' }}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(135deg, #ff2d55, #ff6b2c)',
                      borderRadius: '12px',
                      zIndex: -1,
                    }}
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                {tab.label}
              </motion.button>
            ))}
          </div>

          {/* Tab Content */}
          <div style={{ padding: '32px' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === 'description' ? (
                  /* Description Content */
                  <div>
                    <h3
                      style={{
                        fontSize: '24px',
                        fontWeight: 700,
                        color: '#fff',
                        marginBottom: '24px',
                      }}
                    >
                      {DESCRIPTION_CONTENT.title}
                    </h3>
                    {DESCRIPTION_CONTENT.paragraphs.map((paragraph, index) => (
                      <p
                        key={index}
                        style={{
                          fontSize: '15px',
                          lineHeight: 1.8,
                          color: 'rgba(255,255,255,0.7)',
                          marginBottom: '16px',
                        }}
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                ) : (
                  /* Data Table */
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                    {tabContent?.map((item, index) => (
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '16px 20px',
                          borderRadius: '12px',
                          background: index % 2 === 0 ? 'rgba(255,255,255,0.03)' : 'transparent',
                        }}
                      >
                        <span
                          style={{
                            fontSize: '14px',
                            color: 'rgba(255,255,255,0.5)',
                            fontWeight: 500,
                          }}
                        >
                          {item.label}
                        </span>
                        <span
                          style={{
                            fontSize: '14px',
                            color: '#fff',
                            fontFamily: 'monospace',
                            fontWeight: 600,
                            textAlign: 'right',
                          }}
                        >
                          {item.value}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Section Label */}
            <div
              style={{
                marginTop: '32px',
                paddingTop: '24px',
                borderTop: '1px solid rgba(255,255,255,0.08)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  background: '#00c853',
                  borderRadius: '50%',
                  boxShadow: '0 0 10px #00c853',
                }}
              />
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em' }}>
                Data verified and updated January 2024
              </span>
            </div>
          </div>
        </motion.div>

        {/* Right Side - Title & 3D Element Area */}
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: 100 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
            height: '100%',
            minHeight: '600px',
            position: 'relative',
          }}
        >
          {/* 3D Element Placeholder - The bacteria floats here */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '100%',
              height: '70%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* The 3D bacteria component renders here via the parent */}
            <div
              style={{
                width: '300px',
                height: '300px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(255,107,44,0.1) 0%, transparent 70%)',
                filter: 'blur(40px)',
              }}
            />
          </div>

          {/* Product Title */}
          <div style={{ textAlign: 'right', position: 'relative', zIndex: 2 }}>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.4 }}
              style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: 600,
                color: '#ff6b2c',
                textTransform: 'uppercase',
                letterSpacing: '0.3em',
                marginBottom: '16px',
              }}
            >
              Technical Specifications
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ delay: 0.5 }}
              style={{
                fontSize: 'clamp(48px, 8vw, 96px)',
                fontWeight: 900,
                lineHeight: 0.95,
                letterSpacing: '-0.04em',
                color: '#1a1a1a',
                textShadow: '0 0 80px rgba(255,107,44,0.3)',
                margin: 0,
              }}
            >
              Adipotide
              <br />
              <span style={{ color: '#2a2a2a' }}>(FTPP)</span>
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.6 }}
              style={{
                marginTop: '24px',
                display: 'flex',
                gap: '16px',
                justifyContent: 'flex-end',
              }}
            >
              <div
                style={{
                  padding: '12px 20px',
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: '100px',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>Purity</span>
                <span style={{ fontSize: '14px', color: '#fff', fontWeight: 700, marginLeft: '8px' }}>99.2%</span>
              </div>
              <div
                style={{
                  padding: '12px 20px',
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: '100px',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>MW</span>
                <span style={{ fontSize: '14px', color: '#fff', fontWeight: 700, marginLeft: '8px' }}>2557.2</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}