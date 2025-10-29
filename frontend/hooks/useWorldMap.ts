import { useState, useEffect, useCallback } from 'react';
import { getAllCastles } from '@/api/castles';
import { getUserProgress } from '@/api/progress';
import type { CastleWithProgress, ChapterWithProgress } from '@/types/castle.types';
import { ApiError } from '@/types';

export const useWorldMap = (userId: string | undefined) => {
  const [castles, setCastles] = useState<CastleWithProgress[]>([]);
  const [selectedCastle, setSelectedCastle] = useState<CastleWithProgress | null>(null);
  const [chapters, setChapters] = useState<ChapterWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all castles with progress
  const fetchCastles = useCallback(async () => {
    if (!userId) {
      console.log('[useWorldMap] No userId provided');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await getCastlesWithProgress(userId);
      setCastles(response.data || []);
    } catch (err: any) {
      console.error('[useWorldMap] Error fetching castles:', err);
      setError((err as ApiError).message || 'Failed to load castles');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Select a castle and fetch its chapters with progress
  const selectCastle = useCallback(async (castle: CastleWithProgress) => {
    if (!userId) {
      console.error('[useWorldMap] No userId provided');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('[useWorldMap] Selecting castle:', castle.name, castle.id);
      
      setSelectedCastle(castle);
      setChaptersLoading(true);
      
      const response = await getChaptersWithProgress(castle.id, userId);
      setChapters(response.data || []);
    } catch (err: any) {
      console.error('[useWorldMap] Error fetching chapters:', err);
      setError(err.message || 'Failed to load chapters');
      setChapters([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Clear selection
  const clearSelection = useCallback(() => {
    setSelectedCastle(null);
    setChapters([]);
  }, []);

  // Initial fetch
  useEffect(() => {
    if (userId) {
      fetchCastles();
    }
  }, [userId, fetchCastles]);

  return {
    castles,
    loading,
    error,
    selectedCastle,
    setSelectedCastle,
    chapters,
    refreshCastles: fetchCastles,
  };
};