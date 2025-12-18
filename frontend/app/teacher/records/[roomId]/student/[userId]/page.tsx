"use client"

import React, { useEffect, useState, useRef } from 'react'
import { use } from 'react'
import { useRouter } from 'next/navigation'
import { Printer } from 'lucide-react'
import { useReactToPrint } from 'react-to-print';
import LoadingOverlay from '@/components/LoadingOverlay'
import { useAuthStore } from '@/store/authStore'
import styles from '@/styles/records.module.css'
import { getStudentProgress } from '@/api/users'

interface StudentProgress {
  user: {
    first_name: string
    last_name: string
    email: string
    profile_pic: string
  }
  castles: Array<{
    castle_id: number
    castle_name: string
    chapters_completed: number
    total_chapters: number
    total_xp: number
    progress_percentage: number
  }>
  competitions: Array<{
    competition_id: number
    room_id?: number
    title: string
    accumulated_xp: number
    rank: number
    status: string
    date: string
  }>
}

export default function StudentProgressReport({ params }: { params: Promise<{ userId: string; roomId: string }> }) {
  const router = useRouter()
  const { userId, roomId } = use(params)
  const { isLoggedIn, appLoading } = useAuthStore()
  const [progress, setProgress] = useState<StudentProgress | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `${progress?.user.first_name}_${progress?.user.last_name}_Progress_Report`,
  });

  useEffect(() => {
    const fetchStudentProgress = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await getStudentProgress(userId)
        console.log('📊 Student Progress API Response:', response);
        console.log('🏰 Castles data:', response.data?.castles);
        console.log('🏰 Castles length:', response.data?.castles?.length);
        
        if (response.success && response.data) {
          setProgress(response.data)
        } else {
          setError(response.error || 'Failed to load student progress')
        }
      } catch (err) {
        console.error('Error fetching student progress:', err)
        setError('An error occurred while loading student progress')
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      fetchStudentProgress()
    }
  }, [userId])

  const handleBackClick = () => {
    router.push(`/teacher/records/${roomId}`)
  }

  if (appLoading || !isLoggedIn) {
    return <LoadingOverlay isLoading={true} />
  }

  // Filter competitions by roomId
  const filteredCompetitions = progress && roomId 
    ? progress.competitions.filter(comp => comp.room_id === parseInt(roomId))
    : progress?.competitions || []

  console.log('🎨 Render state - progress:', progress);
  console.log('🎨 Render state - progress.castles:', progress?.castles);
  console.log('🎨 Render state - castles length:', progress?.castles?.length);

  return (
    <LoadingOverlay isLoading={loading}>
      {error ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#e74c3c' }}>
          <p>{error}</p>
        </div>
      ) : progress ? (
        <div className={styles.leaderboard_container}>
          {/* Back Button */}
          <div className={styles.back_button_container}>
            <button onClick={handleBackClick} className={styles.back_button}>
              <span>Back to Records</span>
            </button>
          </div>

          {/* Scrollable Container */}
          <div className={styles.leaderboard_scrollable}>
            {/* Header Section */}
            <div className={styles.hero_section}>
              <div className={styles.hero_background}></div>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', marginBottom: '1rem' }}>
                  {progress.user.profile_pic && (
                    <img 
                      src={progress.user.profile_pic} 
                      alt={`${progress.user.first_name} ${progress.user.last_name}`}
                      style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        border: '3px solid #FABC60',
                        objectFit: 'cover',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
                      }}
                    />
                  )}
                  <div style={{ textAlign: 'left' }}>
                    <h1 style={{ 
                      fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                      fontWeight: 'bold',
                      color: '#FABC60',
                      margin: 0,
                      textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                    }}>
                      {progress.user.first_name} {progress.user.last_name}
                    </h1>
                    <p style={{ 
                      fontSize: '1rem', 
                      color: 'rgba(255, 255, 255, 0.8)',
                      margin: '0.25rem 0 0 0'
                    }}>
                      {progress.user.email}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    if (progress) {
                      handlePrint();
                    } else {
                      alert('Please wait for the report to load before printing.');
                    }
                  }}
                  style={{
                    background: 'linear-gradient(135deg, #FABC60 0%, #E8A83B 100%)',
                    color: '#122932',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    margin: '1rem auto 0',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.4)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.3)'
                  }}
                >
                  <Printer size={20} />
                  Print Report
                </button>
              </div>
            </div>

            {/* Printable Area */}
            <div ref={printRef} className="printable-area">
              {/* Castle Progress Section */}
              <div style={{ 
                padding: '2rem clamp(1rem, 3vw, 3rem)',
                maxWidth: '1400px',
                margin: '0 auto'
              }}>
                <section style={{ marginBottom: '3rem' }}>
                  <h2 style={{
                    fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                    fontWeight: 'bold',
                    color: '#FABC60',
                    marginBottom: '1.5rem',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                  }}>
                    Castle Progress
                  </h2>
                  {progress.castles && progress.castles.length > 0 ? (
                  <div style={{
                    background: 'rgba(250, 188, 96, 0.05)',
                    borderRadius: '1rem',
                    padding: '1.5rem',
                    border: '1px solid rgba(250, 188, 96, 0.2)',
                    backdropFilter: 'blur(10px)',
                    overflow: 'auto',
                    maxHeight: '400px'
                  }}>
                    <table style={{
                      width: '100%',
                      borderCollapse: 'collapse',
                      color: '#fff'
                    }}>
                      <thead style={{ position: 'sticky', top: 0, background: 'rgba(18, 41, 50, 0.9)', backdropFilter: 'blur(5px)' }}>
                        <tr style={{ borderBottom: '2px solid rgba(250, 188, 96, 0.3)' }}>
                          <th style={{ padding: '1rem', textAlign: 'left', color: '#FABC60', fontWeight: '600' }}>Castle Name</th>
                          <th style={{ padding: '1rem', textAlign: 'center', color: '#FABC60', fontWeight: '600' }}>Progress</th>
                          <th style={{ padding: '1rem', textAlign: 'center', color: '#FABC60', fontWeight: '600' }}>Chapters</th>
                          <th style={{ padding: '1rem', textAlign: 'center', color: '#FABC60', fontWeight: '600' }}>Total XP</th>
                        </tr>
                      </thead>
                      <tbody>
                        {progress.castles.map((castle) => (
                          <tr key={castle.castle_id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                            <td style={{ padding: '1rem', fontWeight: '500' }}>{castle.castle_name}</td>
                            <td style={{ padding: '1rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{
                                  flex: 1,
                                  height: '8px',
                                  background: 'rgba(255, 255, 255, 0.1)',
                                  borderRadius: '4px',
                                  overflow: 'hidden'
                                }}>
                                  <div style={{
                                    width: `${castle.progress_percentage}%`,
                                    height: '100%',
                                    background: 'linear-gradient(90deg, #FABC60 0%, #E8A83B 100%)',
                                    transition: 'width 0.3s ease'
                                  }} />
                                </div>
                                <span style={{ minWidth: '50px', textAlign: 'right', fontWeight: '600', color: '#FABC60' }}>
                                  {castle.progress_percentage}%
                                </span>
                              </div>
                            </td>
                            <td style={{ padding: '1rem', textAlign: 'center' }}>
                              {castle.chapters_completed} / {castle.total_chapters}
                            </td>
                            <td style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', color: '#FABC60' }}>
                              {castle.total_xp} XP
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  ) : (
                    <div style={{
                      background: 'rgba(250, 188, 96, 0.05)',
                      borderRadius: '1rem',
                      padding: '2rem',
                      border: '1px solid rgba(250, 188, 96, 0.2)',
                      textAlign: 'center',
                      color: 'rgba(255, 255, 255, 0.6)'
                    }}>
                      <p>This student hasn't started the worldmap journey yet.</p>
                    </div>
                  )}
                </section>

                {/* Competition History Section */}
                <section style={{ marginBottom: '3rem' }}>
                  <h2 style={{
                    fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                    fontWeight: 'bold',
                    color: '#FABC60',
                    marginBottom: '1.5rem',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                  }}>
                    Competition History
                    {roomId && <span style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.7)', marginLeft: '0.5rem' }}>(Room #{roomId})</span>}
                  </h2>
                  {filteredCompetitions.length > 0 ? (
                    <div style={{
                      background: 'rgba(250, 188, 96, 0.05)',
                      borderRadius: '1rem',
                      padding: '1.5rem',
                      border: '1px solid rgba(250, 188, 96, 0.2)',
                      backdropFilter: 'blur(10px)',
                      overflow: 'auto',
                      maxHeight: '400px'
                    }}>
                      <table style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        color: '#fff'
                      }}>
                        <thead style={{ position: 'sticky', top: 0, background: 'rgba(18, 41, 50, 0.9)', backdropFilter: 'blur(5px)' }}>
                          <tr style={{ borderBottom: '2px solid rgba(250, 188, 96, 0.3)' }}>
                            <th style={{ padding: '1rem', textAlign: 'left', color: '#FABC60', fontWeight: '600' }}>Competition</th>
                            <th style={{ padding: '1rem', textAlign: 'center', color: '#FABC60', fontWeight: '600' }}>Date</th>
                            <th style={{ padding: '1rem', textAlign: 'center', color: '#FABC60', fontWeight: '600' }}>XP Earned</th>
                            <th style={{ padding: '1rem', textAlign: 'center', color: '#FABC60', fontWeight: '600' }}>Rank</th>
                            <th style={{ padding: '1rem', textAlign: 'center', color: '#FABC60', fontWeight: '600' }}>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredCompetitions.map((comp) => (
                            <tr key={comp.competition_id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                              <td style={{ padding: '1rem' }}>{comp.title}</td>
                              <td style={{ padding: '1rem', textAlign: 'center' }}>{new Date(comp.date).toLocaleDateString()}</td>
                              <td style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', color: '#FABC60' }}>
                                {comp.accumulated_xp} XP
                              </td>
                              <td style={{ padding: '1rem', textAlign: 'center', fontWeight: '600' }}>#{comp.rank}</td>
                              <td style={{ padding: '1rem', textAlign: 'center' }}>
                                <span style={{
                                  padding: '0.25rem 0.75rem',
                                  borderRadius: '1rem',
                                  fontSize: '0.875rem',
                                  fontWeight: '600',
                                  background: comp.status === 'completed' ? 'rgba(46, 204, 113, 0.2)' : 'rgba(255, 193, 7, 0.2)',
                                  color: comp.status === 'completed' ? '#2ecc71' : '#ffc107',
                                  border: `1px solid ${comp.status === 'completed' ? '#2ecc71' : '#ffc107'}`
                                }}>
                                  {comp.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div style={{
                      background: 'rgba(250, 188, 96, 0.05)',
                      borderRadius: '1rem',
                      padding: '2rem',
                      border: '1px solid rgba(250, 188, 96, 0.2)',
                      textAlign: 'center',
                      color: 'rgba(255, 255, 255, 0.6)'
                    }}>
                      <p>No competition data available for this room.</p>
                    </div>
                  )}
                </section>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      <style jsx global>{`
        .printable-area {
          background: #122932;
          color: #fff;
        }
        @media print {
          body {
            background: #122932 !important;
            color: #fff !important;
          }
          .printable-area {
            padding: 2rem;
          }
          div[style*="overflow: auto"] {
            overflow: visible !important;
            max-height: none !important;
          }
          .back_button_container, .hero_section button {
            display: none !important;
          }
          .hero_section {
            background: none !important;
          }
        }
      `}</style>
    </LoadingOverlay>
  )
}
