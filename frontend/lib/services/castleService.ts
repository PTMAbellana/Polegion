import { supabase } from '@/lib/supabaseClient';
import {
  Castle,
  CastleProgress,
  CastleWithProgress,
  Chapter,
  ChapterProgress,
  ChapterWithProgress,
  Minigame,
  MinigameAttempt,
  ChapterQuiz,
  QuizAttempt,
} from '@/types/castle.types';

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
    console.log('[Frontend] Initializing castle progress for user:', userId);
    
    const response = await fetch(`${API_URL}/castles/initialize`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ userId }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to initialize castle progress');
    }

    console.log('[Frontend] Castle progress initialized:', result);
    return result;
  } catch (error: any) {
    console.error('[Frontend] Error initializing castle progress:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get all castles with user's progress
 */
export async function getUserCastlesWithProgress(userId: string) {
  try {
    console.log('[Frontend] Fetching castles for user:', userId);
    
    const response = await fetch(`${API_URL}/castles?userId=${userId}`, {
      headers: getHeaders()
    });
    
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to fetch castles');
    }

    console.log('[Frontend] Castles fetched:', result.data?.length || 0);
    return { data: result.data, error: null };
  } catch (error: any) {
    console.error('[Frontend] Error fetching castles:', error);
    return { data: null, error: error.message };
  }
}

/**
 * Get specific castle with user's progress
 */
export async function getCastleWithProgress(userId: string, castleId: string) {
  try {
    console.log('[Frontend] Fetching castle details:', castleId);
    
    const response = await fetch(`${API_URL}/castles/${castleId}?userId=${userId}`, {
      headers: getHeaders()
    });
    
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to fetch castle');
    }

    console.log('[Frontend] Castle details fetched:', result.data?.name);
    return { data: result.data, error: null };
  } catch (error: any) {
    console.error('[Frontend] Error fetching castle:', error);
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
    console.log('[Frontend] Updating castle progress:', { castleId, updates });
    
    const response = await fetch(`${API_URL}/castles/${castleId}/progress`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ userId, ...updates }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to update castle progress');
    }

    console.log('[Frontend] Castle progress updated:', result.data);
    return { data: result.data, error: null };
  } catch (error: any) {
    console.error('[Frontend] Error updating castle progress:', error);
    return { data: null, error: error.message };
  }
}

/**
 * Complete a castle
 */
export async function completeCastle(userId: string, castleId: string) {
  try {
    console.log('[Frontend] Completing castle:', castleId);
    
    const response = await fetch(`${API_URL}/castles/${castleId}/complete`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ userId }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to complete castle');
    }

    console.log('[Frontend] Castle completed:', result);
    return result;
  } catch (error: any) {
    console.error('[Frontend] Error completing castle:', error);
    return { success: false, error: error.message };
  }
}

// ==================== CHAPTER FUNCTIONS ====================

/**
 * Get chapters for a castle with user's progress
 */
export async function getChaptersWithProgress(userId: string, castleId: string) {
  try {
    console.log('[Frontend] Fetching chapters for castle:', castleId);
    
    const response = await fetch(`${API_URL}/castles/${castleId}/chapters?userId=${userId}`, {
      headers: getHeaders()
    });
    
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to fetch chapters');
    }

    console.log('[Frontend] Chapters fetched:', result.data?.length || 0);
    return { data: result.data, error: null };
  } catch (error: any) {
    console.error('[Frontend] Error fetching chapters:', error);
    return { data: null, error: error.message };
  }
}

/**
 * Initialize chapter progress for a castle
 */
export async function initializeChapterProgress(userId: string, castleId: string) {
  try {
    console.log('[Frontend] Initializing chapter progress for castle:', castleId);
    
    const response = await fetch(`${API_URL}/castles/${castleId}/chapters/initialize`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ userId }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to initialize chapters');
    }

    console.log('[Frontend] Chapter progress initialized:', result);
    return result;
  } catch (error: any) {
    console.error('[Frontend] Error initializing chapters:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get specific chapter details with progress
 */
export async function getChapterDetails(userId: string, chapterId: string) {
  try {
    console.log('[Frontend] Fetching chapter details:', chapterId);
    
    const response = await fetch(`${API_URL}/chapters/${chapterId}?userId=${userId}`, {
      headers: getHeaders()
    });
    
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to fetch chapter');
    }

    console.log('[Frontend] Chapter details fetched:', result.data?.title);
    return { data: result.data, error: null };
  } catch (error: any) {
    console.error('[Frontend] Error fetching chapter:', error);
    return { data: null, error: error.message };
  }
}

/**
 * Complete a chapter
 */
export async function completeChapter(userId: string, chapterId: string) {
  try {
    console.log('[Frontend] Completing chapter:', chapterId);
    
    const response = await fetch(`${API_URL}/chapters/${chapterId}/complete`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ userId }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to complete chapter');
    }

    console.log('[Frontend] Chapter completed:', result);
    return result;
  } catch (error: any) {
    console.error('[Frontend] Error completing chapter:', error);
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
    console.log('[Frontend] Updating quiz status:', { chapterId, passed });
    
    const response = await fetch(`${API_URL}/chapters/${chapterId}/quiz`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ userId, passed, xpEarned }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to update quiz status');
    }

    console.log('[Frontend] Quiz status updated:', result);
    return result;
  } catch (error: any) {
    console.error('[Frontend] Error updating quiz status:', error);
    return { success: false, error: error.message };
  }
}