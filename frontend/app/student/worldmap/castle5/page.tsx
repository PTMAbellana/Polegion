// ============================================================================
// CASTLE 5 - MYSTICAL TOWER
// ============================================================================

"use client"

import CastlePageBase from '@/components/world/CastlePageBase'
import type { CastleConfig } from '@/components/world/CastlePageBase'
import styles from '@/styles/castle5-adventure.module.css'

const config: CastleConfig = {
  castleRoute: 'castle5',
  styleModule: styles,
}

export default function Castle5Page() {
  return <CastlePageBase config={config} />
}
