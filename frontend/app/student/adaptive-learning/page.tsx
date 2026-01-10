'use client';

import { useEffect, useState } from 'react';
import AdaptiveLearning from '@/components/adaptive/AdaptiveLearning';
import TopicSelector from '@/components/adaptive/TopicSelector';
import Loader from '@/components/Loader';
import axios from '@/api/axios';

interface Topic {
  id: string;
  topic_code: string;
  topic_name: string;
  description: string;
  cognitive_domain: string;
  unlocked: boolean;
  mastered: boolean;
  mastery_level: number;
  mastery_percentage: number;
}

export default function AdaptiveLearningPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopicId, setSelectedTopicId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [showTopicSwitcher, setShowTopicSwitcher] = useState(false);
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    fetchTopicsWithProgress();
  }, []);

  const fetchTopicsWithProgress = async () => {
    try {
      // Check if user is logged in before making request
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        console.error('❌ No access token found - user not logged in');
        // Redirect to login
        window.location.href = '/auth/login';
        return;
      }

      console.log('📤 Fetching topics with progress...');
      const response = await axios.get('/adaptive/topics-with-progress', {
        timeout: 30000 // 30 second timeout instead of default 60s
      });
      
      if (response.data.success) {
        console.log('✅ Topics fetched successfully:', response.data.data?.length || 0);
        const topicsData = response.data.data || [];
        setTopics(topicsData);
        
        // Extract userId from response (all topics have same user_id)
        if (topicsData.length > 0 && topicsData[0].user_id) {
          setUserId(topicsData[0].user_id);
        }
        
        // Try to restore last selected topic from localStorage
        const savedTopicId = localStorage.getItem('selectedTopicId');
        if (savedTopicId) {
          // Check if saved topic is still valid and unlocked
          const savedTopic = topicsData.find((t: Topic) => t.id === savedTopicId && t.unlocked);
          if (savedTopic) {
            setSelectedTopicId(savedTopicId);
            return;
          }
        }
        
        // Fallback: Auto-select first unlocked topic, or first topic if none unlocked (new user)
        const firstUnlocked = topicsData.find((t: Topic) => t.unlocked);
        if (firstUnlocked) {
          setSelectedTopicId(firstUnlocked.id);
          localStorage.setItem('selectedTopicId', firstUnlocked.id);
        } else if (topicsData.length > 0) {
          // New user case: select first topic (backend will auto-unlock on first access)
          setSelectedTopicId(topicsData[0].id);
          localStorage.setItem('selectedTopicId', topicsData[0].id);
        }
      }
    } catch (error: any) {
      console.error('❌ Error fetching topics:', error);
      
      // Handle 401 - token expired or invalid
      if (error.response?.status === 401) {
        console.error('🔒 Authentication failed - redirecting to login');
        localStorage.clear(); // Clear all auth data
        window.location.href = '/auth/login';
        return;
      }
      
      // Show user-friendly error message
      alert(`Failed to load topics: ${error.response?.data?.error || error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleTopicSelect = (topicId: string) => {
    setSelectedTopicId(topicId);
    localStorage.setItem('selectedTopicId', topicId);
    setShowTopicSwitcher(false);
  };

  const handleOpenTopicSwitcher = () => {
    // Refresh topics to show newly unlocked ones
    fetchTopicsWithProgress();
    setShowTopicSwitcher(true);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', position: 'relative' }}>
      {/* Topic Selector - initial view if nothing selected */}
      {topics.length > 0 && !selectedTopicId && (
        <div style={{
          backgroundColor: '#F9FAFB',
          padding: '20px 16px',
          overflowY: 'auto'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: 700,
              color: '#1F2937',
              marginBottom: '8px',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
            }}>
              Adaptive Geometry Learning
            </h2>
            <p style={{
              fontSize: '14px',
              color: '#6B7280',
              marginBottom: '20px',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
            }}>
              Complete topics to unlock new ones. Reach mastery level 3 to unlock the next topic!
            </p>
            <TopicSelector 
              topics={topics}
              selectedTopicId={selectedTopicId}
              onTopicSelect={handleTopicSelect}
            />
          </div>
        </div>
      )}

      {/* Adaptive Learning Component - stays on screen */}
      {selectedTopicId && (
        <AdaptiveLearning 
          topicId={selectedTopicId}
          topicName={topics.find(t => t.id === selectedTopicId)?.topic_name || 'Geometry Topic'}
          onChangeTopic={handleOpenTopicSwitcher}
          userId={userId}
        />
      )}

      {/* Overlay topic switcher */}
      {showTopicSwitcher && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.35)',
          zIndex: 70,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px'
        }}>
          <div style={{
            backgroundColor: '#f4e9d9',
            borderRadius: '16px',
            width: '95%',
            maxWidth: '1100px',
            maxHeight: '85vh',
            overflow: 'hidden',
            boxShadow: '0 24px 48px rgba(139, 100, 60, 0.4), inset 0 2px 8px rgba(218, 165, 32, 0.1)',
            border: '4px solid #b8860b',
            display: 'flex',
            flexDirection: 'column',
            background: 'linear-gradient(135deg, #f4e9d9 0%, #ecdcc4 30%, #e8d5ba 50%, #f0e3cf 70%, #f4e9d9 100%)',
            position: 'relative'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 18px',
              borderBottom: '3px solid #b8860b',
              background: 'linear-gradient(180deg, rgba(218, 165, 32, 0.1) 0%, transparent 100%)'
            }}>
              <div style={{
                fontSize: '18px',
                fontWeight: 700,
                color: '#654321',
                fontFamily: 'Cinzel, serif',
                textShadow: '0 1px 2px rgba(139, 100, 60, 0.2)',
                letterSpacing: '0.5px'
              }}>
                📜 Choose a topic
              </div>
              <button
                onClick={() => setShowTopicSwitcher(false)}
                style={{
                  background: 'linear-gradient(135deg, #8b7355, #654321)',
                  border: '2px solid #3d2817',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  color: '#fef5e7',
                  fontFamily: 'Cinzel, serif',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #6d5940, #4d3520)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #8b7355, #654321)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.2)';
                }}
              >
                Close
              </button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '18px' }}>
              <TopicSelector 
                topics={topics}
                selectedTopicId={selectedTopicId}
                onTopicSelect={handleTopicSelect}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
