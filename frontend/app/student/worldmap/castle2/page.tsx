// ============================================================================
// CASTLE 2 - VERDANT FORTRESS
// ============================================================================

"use client"

import CastlePageBase from '@/components/world/CastlePageBase'
import type { CastleConfig } from '@/components/world/CastlePageBase'
import styles from '@/styles/castle2-adventure.module.css'

const config: CastleConfig = {
  castleRoute: 'castle2',
  styleModule: styles,
}

export default function Castle2Page() {
  return <CastlePageBase config={config} />
}
