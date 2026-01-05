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

  useEffect(() => {
    fetchTopicsWithProgress();
  }, []);

  const fetchTopicsWithProgress = async () => {
    try {
      const response = await axios.get('/adaptive/topics-with-progress');
      
      if (response.data.success) {
        const topicsData = response.data.data || [];
        setTopics(topicsData);
        
        // Auto-select first unlocked topic, or first topic if none unlocked (new user)
        const firstUnlocked = topicsData.find((t: Topic) => t.unlocked);
        if (firstUnlocked) {
          setSelectedTopicId(firstUnlocked.id);
        } else if (topicsData.length > 0) {
          // New user case: select first topic (backend will auto-unlock on first access)
          setSelectedTopicId(topicsData[0].id);
        }
      }
    } catch (error) {
      console.error('Error fetching topics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTopicSelect = (topicId: string) => {
    setSelectedTopicId(topicId);
    setShowTopicSwitcher(false);
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
          onChangeTopic={() => setShowTopicSwitcher(true)}
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
            backgroundColor: 'white',
            borderRadius: '16px',
            width: '95%',
            maxWidth: '1100px',
            maxHeight: '85vh',
            overflow: 'hidden',
            boxShadow: '0 24px 48px rgba(0,0,0,0.2)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 18px',
              borderBottom: '1px solid #E5E7EB'
            }}>
              <div style={{
                fontSize: '15px',
                fontWeight: 700,
                color: '#1F2937',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
              }}>
                Choose a topic
              </div>
              <button
                onClick={() => setShowTopicSwitcher(false)}
                style={{
                  background: '#F3F4F6',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  color: '#4B5563',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
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
