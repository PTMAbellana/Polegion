import { useState, useEffect } from 'react';
import { getCastlesWithProgress, getChaptersWithProgress } from '@/api/castles';
import type { CastleWithProgress, ChapterWithProgress } from '@/types/castle.types';

export const useWorldMap = (userId: string) => {
  const [castles, setCastles] = useState<CastleWithProgress[]>([]);
  const [selectedCastle, setSelectedCastle] = useState<CastleWithProgress | null>(null);
  const [chapters, setChapters] = useState<ChapterWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [chaptersLoading, setChaptersLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch castles on mount
  useEffect(() => {
    if (userId) {
      fetchCastles();
    }
  }, [userId]);

  const fetchCastles = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);
      const response = await getCastlesWithProgress(userId);
      setCastles(response.data || []);
    } catch (err: any) {
      console.error('[useWorldMap] Error fetching castles:', err);
      setError(err.message || 'Failed to load castles');
    } finally {
      setLoading(false);
    }
  };

  const selectCastle = async (castle: CastleWithProgress) => {
    try {
      setSelectedCastle(castle);
      setChaptersLoading(true);
      
      const response = await getChaptersWithProgress(castle.id, userId);
      setChapters(response.data || []);
    } catch (err: any) {
      console.error('[useWorldMap] Error fetching chapters:', err);
      setError(err.message || 'Failed to load chapters');
      setChapters([]);
    } finally {
      setChaptersLoading(false);
    }
  };

  const refreshCastles = async () => {
    await fetchCastles();
    if (selectedCastle) {
      await selectCastle(selectedCastle);
    }
  };

  return {
    castles,
    selectedCastle,
    chapters,
    loading,
    chaptersLoading,
    error,
    selectCastle,
    refreshCastles
  };
};