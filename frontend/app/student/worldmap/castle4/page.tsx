// ============================================================================
// CASTLE 4 - DESERT STRONGHOLD
// ============================================================================

"use client"

import CastlePageBase from '@/components/world/CastlePageBase'
import type { CastleConfig } from '@/components/world/CastlePageBase'
import styles from '@/styles/castle4-adventure.module.css'

const config: CastleConfig = {
  castleRoute: 'castle4',
  styleModule: styles,
}

export default function Castle4Page() {
  return <CastlePageBase config={config} />
}
