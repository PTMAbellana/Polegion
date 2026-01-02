'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdaptiveLearning from '@/components/adaptive/AdaptiveLearning';
import Loader from '@/components/Loader';
import { getCastles } from '@/api/castles';
import { getChaptersByCastle } from '@/api/chapters';

interface Castle {
  id: string;
  title: string;
  chapters: Chapter[];
}

interface Chapter {
  id: string;
  title: string;
  castle_id: string;
}

export default function AdaptiveLearningPage() {
  const router = useRouter();
  const [castles, setCastles] = useState<Castle[]>([]);
  const [selectedChapterId, setSelectedChapterId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCastlesAndChapters();
  }, []);

  const fetchCastlesAndChapters = async () => {
    try {
      const response = await getCastles();
      
      if (!response.success) {
        console.error('Error fetching castles:', response.message);
        setLoading(false);
        return;
      }
      
      const castlesData = response.data || [];
      
      // Fetch chapters for each castle
      const castlesWithChapters = await Promise.all(
        castlesData.map(async (castle: Castle) => {
          try {
            const chaptersResponse = await getChaptersByCastle(castle.id);
            return {
              ...castle,
              chapters: chaptersResponse.data || chaptersResponse || []
            };
          } catch (error) {
            console.error(`Error fetching chapters for castle ${castle.id}:`, error);
            return { ...castle, chapters: [] };
          }
        })
      );

      setCastles(castlesWithChapters);
      
      // Auto-select first chapter if available
      if (castlesWithChapters.length > 0 && castlesWithChapters[0].chapters.length > 0) {
        setSelectedChapterId(castlesWithChapters[0].chapters[0].id);
      }
    } catch (error) {
      console.error('Error fetching castles:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      {/* Chapter Selector Header */}
      {castles.length > 0 && (
        <div style={{
          backgroundColor: 'white',
          borderBottom: '1px solid #E5E7EB',
          padding: '20px 16px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: 500,
              color: '#374151',
              marginBottom: '8px',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
            }}>
              Select a Chapter
            </label>
            <select
              value={selectedChapterId}
              onChange={(e) => setSelectedChapterId(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                fontSize: '15px',
                border: '2px solid #E5E7EB',
                borderRadius: '8px',
                backgroundColor: 'white',
                color: '#1F2937',
                cursor: 'pointer',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                outline: 'none'
              }}
            >
              <option value="">Choose a chapter to begin</option>
              {castles.map((castle) => (
                <optgroup key={castle.id} label={castle.title}>
                  {castle.chapters.map((chapter) => (
                    <option key={chapter.id} value={chapter.id}>
                      {chapter.title}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Adaptive Learning Component */}
      {selectedChapterId ? (
        <AdaptiveLearning chapterId={selectedChapterId} />
      ) : (
        <div style={{
          minHeight: '80vh',
          background: '#F9FAFB',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{ textAlign: 'center', maxWidth: '400px' }}>
            <div style={{
              width: '80px',
              height: '80px',
              margin: '0 auto 20px',
              backgroundColor: '#EFF6FF',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '36px'
            }}>
              📚
            </div>
            <h2 style={{ 
              fontSize: '20px', 
              fontWeight: 600, 
              color: '#1F2937',
              marginBottom: '8px',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
            }}>
              Ready to Learn
            </h2>
            <p style={{ 
              fontSize: '15px', 
              color: '#6B7280',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
            }}>
              Select a chapter from the menu above to start your adaptive learning session.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
