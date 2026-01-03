'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdaptiveLearning from '@/components/adaptive/AdaptiveLearning';
import Loader from '@/components/Loader';
import axios from '@/api/axios';

interface Topic {
  id: string;
  topic_code: string;
  topic_name: string;
  description: string;
  cognitive_domain: string;
}

const DOMAIN_LABELS: { [key: string]: string } = {
  'knowledge_recall': '📚 Knowledge Recall',
  'concept_understanding': '💡 Concept Understanding',
  'procedural_skills': '🔧 Procedural Skills',
  'analytical_thinking': '🧠 Analytical Thinking',
  'problem_solving': '🎯 Problem Solving',
  'higher_order_thinking': '🚀 Higher Order Thinking'
};

export default function AdaptiveLearningPage() {
  const router = useRouter();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopicId, setSelectedTopicId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      const response = await axios.get('/adaptive/topics');
      
      if (response.data.success) {
        const topicsData = response.data.data || [];
        setTopics(topicsData);
        
        // Auto-select first topic if available
        if (topicsData.length > 0) {
          setSelectedTopicId(topicsData[0].id);
        }
      }
    } catch (error) {
      console.error('Error fetching topics:', error);
    } finally {
      setLoading(false);
    }
  };

  // Group topics by cognitive domain
  const topicsByDomain = topics.reduce((acc, topic) => {
    const domain = topic.cognitive_domain;
    if (!acc[domain]) {
      acc[domain] = [];
    }
    acc[domain].push(topic);
    return acc;
  }, {} as { [key: string]: Topic[] });

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      {/* Topic Selector Header */}
      {topics.length > 0 && (
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
              Select a Geometry Topic
            </label>
            <select
              value={selectedTopicId}
              onChange={(e) => setSelectedTopicId(e.target.value)}
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
              <option value="">Choose a topic to begin</option>
              {Object.entries(topicsByDomain).map(([domain, domainTopics]) => (
                <optgroup key={domain} label={DOMAIN_LABELS[domain] || domain}>
                  {domainTopics.map((topic) => (
                    <option key={topic.id} value={topic.id}>
                      {topic.topic_name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            {selectedTopicId && (
              <p style={{
                marginTop: '8px',
                fontSize: '13px',
                color: '#6B7280',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
              }}>
                {topics.find(t => t.id === selectedTopicId)?.description}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Adaptive Learning Component */}
      {selectedTopicId ? (
        <AdaptiveLearning topicId={selectedTopicId} />
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
              📐
            </div>
            <h2 style={{ 
              fontSize: '20px', 
              fontWeight: 600, 
              color: '#1F2937',
              marginBottom: '8px',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
            }}>
              Ready to Learn Geometry
            </h2>
            <p style={{ 
              fontSize: '15px', 
              color: '#6B7280',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
            }}>
              Select a geometry topic from the menu above to start your adaptive learning session.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
