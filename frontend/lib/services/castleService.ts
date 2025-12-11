import { supabase } from '@/lib/supabaseClient';
import type { Castle, CastleWithProgress } from '@/types/common/castle';
import type { Chapter, ChapterWithProgress } from '@/types/common/chapter';
import type { Minigame, MinigameAttempt, ChapterQuiz, QuizAttempt } from '@/types/common/quiz';
import logger from '@/utils/logger';

// Type aliases for compatibility
type CastleProgress = {
  unlocked: boolean;
  completed: boolean;
  total_xp_earned: number;
  completion_percentage: number;
};

type ChapterProgress = {
  unlocked: boolean;
  completed: boolean;
  xp_earned: number;
  quiz_passed: boolean;
};

/**
 * Frontend Castle Service - Calls Backend API Routes
 * All database logic is handled in the backend
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * Get auth token from localStorage
 */
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

/**
 * Create fetch headers with auth token
 */
function getHeaders(): HeadersInit {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
}

// ==================== CASTLE FUNCTIONS ====================

/**
 * Initialize castle progress for a new user
 */
export async function initializeUserCastleProgress(userId: string) {
  try {
    logger.log('[Frontend] Initializing castle progress for user:', userId);
    
    const response = await fetch(`${API_URL}/castles/initialize`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ userId }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to initialize castle progress');
    }

    logger.log('[Frontend] Castle progress initialized:', result);
    return result;
  } catch (error: any) {
    logger.error('[Frontend] Error initializing castle progress:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get all castles with user's progress
 */
export async function getUserCastlesWithProgress(userId: string) {
  try {
    logger.log('[Frontend] Fetching castles for user:', userId);
    
    const response = await fetch(`${API_URL}/castles?userId=${userId}`, {
      headers: getHeaders()
    });
    
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to fetch castles');
    }

    logger.log('[Frontend] Castles fetched:', result.data?.length || 0);
    return { data: result.data, error: null };
  } catch (error: any) {
    logger.error('[Frontend] Error fetching castles:', error);
    return { data: null, error: error.message };
  }
}

/**
 * Get specific castle with user's progress
 */
export async function getCastleWithProgress(userId: string, castleId: string) {
  try {
    logger.log('[Frontend] Fetching castle details:', castleId);
    
    const response = await fetch(`${API_URL}/castles/${castleId}?userId=${userId}`, {
      headers: getHeaders()
    });
    
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to fetch castle');
    }

    logger.log('[Frontend] Castle details fetched:', result.data?.name);
    return { data: result.data, error: null };
  } catch (error: any) {
    logger.error('[Frontend] Error fetching castle:', error);
    return { data: null, error: error.message };
  }
}

/**
 * Update castle progress
 */
export async function updateCastleProgress(
  userId: string, 
  castleId: string, 
  updates: {
    totalXpEarned?: number;
    completionPercentage?: number;
    completed?: boolean;
  }
) {
  try {
    logger.log('[Frontend] Updating castle progress:', { castleId, updates });
    
    const response = await fetch(`${API_URL}/castles/${castleId}/progress`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ userId, ...updates }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to update castle progress');
    }

    logger.log('[Frontend] Castle progress updated:', result.data);
    return { data: result.data, error: null };
  } catch (error: any) {
    logger.error('[Frontend] Error updating castle progress:', error);
    return { data: null, error: error.message };
  }
}

/**
 * Complete a castle
 */
export async function completeCastle(userId: string, castleId: string) {
  try {
    logger.log('[Frontend] Completing castle:', castleId);
    
    const response = await fetch(`${API_URL}/castles/${castleId}/complete`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ userId }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to complete castle');
    }

    logger.log('[Frontend] Castle completed:', result);
    return result;
  } catch (error: any) {
    logger.error('[Frontend] Error completing castle:', error);
    return { success: false, error: error.message };
  }
}

// ==================== CHAPTER FUNCTIONS ====================

/**
 * Get chapters for a castle with user's progress
 */
export async function getChaptersWithProgress(userId: string, castleId: string) {
  try {
    logger.log('[Frontend] Fetching chapters for castle:', castleId);
    
    const response = await fetch(`${API_URL}/castles/${castleId}/chapters?userId=${userId}`, {
      headers: getHeaders()
    });
    
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to fetch chapters');
    }

    logger.log('[Frontend] Chapters fetched:', result.data?.length || 0);
    return { data: result.data, error: null };
  } catch (error: any) {
    logger.error('[Frontend] Error fetching chapters:', error);
    return { data: null, error: error.message };
  }
}

/**
 * Initialize chapter progress for a castle
 */
export async function initializeChapterProgress(userId: string, castleId: string) {
  try {
    logger.log('[Frontend] Initializing chapter progress for castle:', castleId);
    
    const response = await fetch(`${API_URL}/castles/${castleId}/chapters/initialize`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ userId }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to initialize chapters');
    }

    logger.log('[Frontend] Chapter progress initialized:', result);
    return result;
  } catch (error: any) {
    logger.error('[Frontend] Error initializing chapters:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get specific chapter details with progress
 */
export async function getChapterDetails(userId: string, chapterId: string) {
  try {
    logger.log('[Frontend] Fetching chapter details:', chapterId);
    
    const response = await fetch(`${API_URL}/chapters/${chapterId}?userId=${userId}`, {
      headers: getHeaders()
    });
    
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to fetch chapter');
    }

    logger.log('[Frontend] Chapter details fetched:', result.data?.title);
    return { data: result.data, error: null };
  } catch (error: any) {
    logger.error('[Frontend] Error fetching chapter:', error);
    return { data: null, error: error.message };
  }
}

/**
 * Complete a chapter
 */
export async function completeChapter(userId: string, chapterId: string) {
  try {
    logger.log('[Frontend] Completing chapter:', chapterId);
    
    const response = await fetch(`${API_URL}/chapters/${chapterId}/complete`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ userId }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to complete chapter');
    }

    logger.log('[Frontend] Chapter completed:', result);
    return result;
  } catch (error: any) {
    logger.error('[Frontend] Error completing chapter:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Update chapter quiz status
 */
export async function updateChapterQuizStatus(
  userId: string, 
  chapterId: string, 
  passed: boolean, 
  xpEarned: number
) {
  try {
    logger.log('[Frontend] Updating quiz status:', { chapterId, passed });
    
    const response = await fetch(`${API_URL}/chapters/${chapterId}/quiz`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ userId, passed, xpEarned }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to update quiz status');
    }

    logger.log('[Frontend] Quiz status updated:', result);
    return result;
  } catch (error: any) {
    logger.error('[Frontend] Error updating quiz status:', error);
    return { success: false, error: error.message };
  }
}