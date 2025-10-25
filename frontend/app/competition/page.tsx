"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react';
import styles from '@/styles/competition.module.css';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { AuthProtection } from '@/context/AuthProtection';
import Loader from '@/components/Loader';
import { getRoomProblems } from '@/api/problems';
import { getAllParticipants } from '@/api/participants';
import { getAllCompe } from '@/api/competitions';
import { createCompe } from "@/api/competitions";
import { ROUTES } from '@/constants/routes';

interface Participant {
  id: number;
  fullName?: string;
  accumulated_xp: number | 0;
}


interface Problems {
    id: string
    title?: string | 'No Title'
    description: string
    difficulty: string
    max_attempts: number
    expected_xp: number
    timer: number | null
    visibility: 'show' | 'hide'
}

interface Competition {
  id: number 
  title: string;
  status: string;
}

const CompetitionDashboard = () => {
  const searchParams = useSearchParams();
  const roomId = searchParams.get("room");
  const router = useRouter();

  // const [participants, setParticipants] = useState<Participant[]>([]);
  const [sortOrder, setSortOrder] = useState('desc');
  // const [isPaused, setIsPaused] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [ isLoading, setIsLoading ] = useState(true)
  const [ competition, setCompetition ] = useState<Competition[]>([])
  
  const [ participants, setParticipants ] = useState<Participant[]>([])
  const [ problems, setProblems ] = useState<Problems[]>([])

  const [newCompetitionTitle, setNewCompetitionTitle] = useState("");
  const [creating, setCreating] = useState(false);

  const { isLoggedIn } = useAuthStore()
  // const router = useRouter();


  // Fetch participants
  const fetchParticipants = useCallback(async () => {
    try {
      const parts = await getAllParticipants(roomId, 'creator', true);
      setParticipants(parts.data.participants || []);
    } catch (error) {
      console.error('Error fetching participants:', error);
    }
  }, [roomId]);

  // Fetch problems
  const fetchProblems = useCallback(async () => {
    try {
      const probs = await getRoomProblems(roomId);
      setProblems(probs);
    } catch (error) {
      console.error('Error fetching problems:', error);
    }
  }, [roomId]);

  // Fetch competitions
  const fetchCompetitions = useCallback(async () => {
    try {
      const comp = await getAllCompe(roomId);
      setCompetition(comp);
    } catch (error) {
      console.error('Error fetching competitions:', error);
    }
  }, [roomId]);

  // Fetch all data (for initial load)
  const fetchAll = useCallback(async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        fetchParticipants(),
        fetchProblems(),
        fetchCompetitions(),
      ]);
    } catch (error) {
      console.error('Error fetching room details:', error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchParticipants, fetchProblems, fetchCompetitions]);

  useEffect(() => {
    if (isLoggedIn && !fetched) {
      fetchAll();
      setFetched(true);
    } else {
      if (!isLoggedIn) {
        setIsLoading(true);
      }
    }
  }, [isLoggedIn, fetched, fetchAll]);

    // callMe is now replaced by fetchAll, fetchCompetitions, etc.

    const handleCreateCompetition = async () => {
      if (!newCompetitionTitle.trim()) return;
      setCreating(true);
      try {
        const result = await createCompe(roomId, newCompetitionTitle.trim());
        // Optimistically update the competitions list if API returns the new competition
        if (result && result.data && result.data.competition) {
          setCompetition(prev => [result.data.competition, ...prev]);
        } else {
          // Fallback: refetch competitions
          await fetchCompetitions();
        }
        setNewCompetitionTitle("");
      } catch (error) {
        // Handle error (show message, etc.)
        console.error('Error creating competition:', error);
      } finally {
        setCreating(false);
      }
    };

    if (isLoading) {
        return (
            <div className={styles["dashboard-container"]}>
                <div className={styles["loading-container"]}>
                    <Loader/>
                </div>
            </div>
        )
    }

  const sortedParticipants = [...participants].sort((a, b) => {
    return sortOrder === 'desc' ? b.accumulated_xp - a.accumulated_xp : a.accumulated_xp - b.accumulated_xp;
  });

  const redirectToManage = (compe_id : number) => {
    router.push(`${ROUTES.COMPETITION}/${compe_id}?room=${roomId}`)  
  };

  const toggleSort = () => {
    setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
  };

  // const togglePause = () => {
  //   setIsPaused(!isPaused);
  // };

  console.log('competion: ', competition)

  return (
    <div className={styles.container}>
      <div className={styles.mainContainer}>
        {/* Header Section */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            {/* Add Back Button */}
            <div className={styles.headerTop}>
              <button 
                onClick={() => router.back()}
                className={styles.backButton}
                title="Go back to previous page"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            </div>
            
            <h1 className={styles.title}>
              Competition Dashboard
            </h1>
            <p className={styles.description}>
              You can see the progress of the students and how much XP they have garnered already.
            </p>
          </div>
        </div>

        {/* NEW: Two Column Layout */}
        <div className={styles.roomContent}>
          {/* Left Column - Main Content */}
          <div className={styles.leftColumn}>
            {/* Create Competition Form */}
            <div className={styles.participantsSection}>
              <div className={styles.participantsHeader}>
                <h2 className={styles.participantsTitle}>Create Competition</h2>
              </div>
              <form
                onSubmit={e => {
                  e.preventDefault();
                  handleCreateCompetition();
                }}
                style={{ marginBottom: "2rem" }}
              >
                <div className={styles.formGroup}>
                  <textarea
                    className={styles.textarea}
                    placeholder="Enter competition title..."
                    value={newCompetitionTitle}
                    onChange={e => setNewCompetitionTitle(e.target.value)}
                    rows={2}
                    style={{ width: "100%", padding: "12px", borderRadius: "8px", fontSize: "16px" }}
                  />
                </div>
                <button
                  type="submit"
                  className={styles.manageButton}
                  disabled={creating}
                  style={{ marginTop: "1rem", minWidth: 120 }}
                >
                  {creating ? "Creating..." : "Create Competition"}
                </button>
              </form>
            </div>

            {/* Room Competitions */}
            <div className={styles.participantsSection}>
              <h2 className={styles.participantsTitle}>Room Competitions</h2>
              <br />
              <div className={styles.roomGrid}>
                {competition.length > 0 ? (
                  competition.map((comp) => (
                    <div key={comp.id} className={styles.roomCard}>
                      <div className={styles.roomBanner}>
                        <div className={styles.roomBannerOverlay}></div>
                        <div className={styles.roomBannerContent}>
                          <h3 className={styles.roomBannerTitle}>{comp.title}</h3>
                        </div>
                      </div>
                      <div className={styles.roomContent}>
                        <div className={styles.roomFooter}>
                          <div className={styles.roomStatus}>
                            <span className={styles.roomStatusLabel}>Status:</span> {comp.status}
                          </div>
                          {comp.status !== 'DONE' && (
                            <button className={styles.manageButton} onClick={() => redirectToManage(comp.id)}>
                              Manage
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: '2rem', textAlign: 'center', width: '100%' }}>No competitions found.</div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className={styles.rightColumn}>
            {/* Problems Section */}
            <div className={styles.participantsSection}>
              <div className={styles.participantsHeader}>
                <h2 className={styles.participantsTitle}>Problems</h2>
              </div>
              {/* Problems List */}
              <div className={styles.participantsList}>
                {problems.filter(problem => problem.visibility === 'show').map((problem, index) => (
                  <div key={problem.id} className={styles.participantCard}>
                    <div className={styles.participantContent}>
                      <div className={styles.participantLeft}>
                        <div className={styles.participantRank}>{index + 1}</div>
                        <div className={styles.problemInfo}>
                          <h4 className={styles.problemTitle}>{problem.title || 'No Title'}</h4>
                          <div className={styles.problemMeta}>
                            <span 
                              className={styles.problemDifficulty}
                              data-difficulty={problem.difficulty}
                            >
                              {problem.difficulty}
                            </span>
                            <span className={styles.problemXp}>{problem.expected_xp} XP</span>
                          </div>
                        </div>
                      </div>
                      <div className={styles.participantRight}>
                        <div className={styles.problemTimer}>
                          {problem.timer != null && problem.timer > 0 ? 
                            `${problem.timer}s` : 
                            <span style={{ color: 'red' }}>No timer</span>
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {/* Add scroll indicator when there are many problems */}
                {problems.filter(problem => problem.visibility === 'show').length > 5 && (
                  <div className={styles.scrollIndicator}>
                    <small>Scroll to see all {problems.filter(problem => problem.visibility === 'show').length} problems</small>
                  </div>
                )}
              </div>
            </div>

            {/* Participants Section */}
            <div className={styles.participantsSection}>
              <div className={styles.participantsHeader}>
                <h2 className={styles.participantsTitle}>
                  Participants
                </h2>
                {/* Sort Control - moved beside the title */}
                <div className={styles.sortControls}>
                  <button
                    onClick={toggleSort}
                    className={styles.sortButton}
                  >
                    <div className={styles.sortIcons}>
                      <ChevronUp className={`w-3 h-3 ${sortOrder === 'asc' ? 'text-blue-600' : 'text-gray-400'}`} />
                      <ChevronDown className={`w-3 h-3 ${sortOrder === 'desc' ? 'text-blue-600' : 'text-gray-400'}`} />
                    </div>
                    <span className={styles.sortText}>
                      {sortOrder === 'desc' ? 'Desc' : 'Asc'}
                    </span>
                  </button>
                </div>
              </div>
              {/* Participants List */}
              <div className={styles.participantsList}>
                {sortedParticipants.map((participant, index) => (
                  <div
                    key={participant.id}
                    className={styles.participantCard}
                  >
                    <div className={styles.participantContent}>
                      <div className={styles.participantLeft}>
                        <div className={styles.participantRank}>
                          {index + 1}
                        </div>
                        <div>
                          <h3 className={styles.participantName}>
                            {participant.fullName}
                          </h3>
                        </div>
                      </div>
                      <div className={styles.participantRight}>
                        <div className={styles.participantXp}>
                          {participant.accumulated_xp} XP
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompetitionDashboard;
