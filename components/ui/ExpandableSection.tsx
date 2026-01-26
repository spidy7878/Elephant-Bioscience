'use client'

import { useState } from 'react'
import { ChevronDown, FileText, CheckCircle } from 'lucide-react'
import cn from '@/lib/utils'
import  ExpandableSectionData  from '@/types'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  FileText,
  CheckCircle,
}

interface ExpandableSectionProps {
  data: ExpandableSectionData
}

export default function ExpandableSection({ data }: ExpandableSectionProps) {
  const [isOpen, setIsOpen] = useState(false)
  const IconComponent = iconMap[data.icon as string]

  return (
    <div className="border-t border-border">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center py-5 group interactive"
      >
        <span className="flex items-center gap-3 text-sm font-semibold group-hover:text-accent-orange transition-colors">
          {IconComponent && <IconComponent className="w-4.5 h-4.5 text-accent-orange" />}
          {data.title}
        </span>
        <span
          className={cn(
            'w-6 h-6 flex items-center justify-center rounded-md bg-white/[0.03] transition-all',
            isOpen && 'bg-accent-orange/10'
          )}
        >
          <ChevronDown
            className={cn(
              'w-3.5 h-3.5 transition-transform duration-300',
              isOpen && 'rotate-180 text-accent-orange'
            )}
          />
        </span>
      </button>

      <div
        className={cn(
          'overflow-hidden transition-all duration-400',
          isOpen ? 'max-h-80' : 'max-h-0'
        )}
      >
        <div className="pb-5">
          <table className="w-full font-mono text-sm">
            <tbody>
              {data.content.map((item, index) => (
                <tr key={index} className="border-b border-white/[0.03] last:border-0">
                  <td className="py-3 text-text-muted">{item.label}</td>
                  <td className="py-3 text-right font-medium">{item.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}