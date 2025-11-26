// ============================================================================
// CASTLE 3 - AQUATIC CITADEL
// ============================================================================

"use client"

import CastlePageBase from '@/components/world/CastlePageBase'
import type { CastleConfig } from '@/components/world/CastlePageBase'
import styles from '@/styles/castle3-adventure.module.css'

const config: CastleConfig = {
  castleRoute: 'castle3',
  styleModule: styles,
}

export default function Castle3Page() {
  return <CastlePageBase config={config} />
}
