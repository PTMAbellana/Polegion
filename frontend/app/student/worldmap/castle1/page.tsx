// ============================================================================
// CASTLE 1 - EUCLIDEAN SPIRE
// ============================================================================

"use client"

import CastlePageBase from '@/components/world/CastlePageBase'
import type { CastleConfig } from '@/components/world/CastlePageBase'
import styles from '@/styles/castle1-adventure.module.css'

const config: CastleConfig = {
  castleRoute: 'castle1',
  styleModule: styles,
}

export default function Castle1Page() {
  return <CastlePageBase config={config} />
}

