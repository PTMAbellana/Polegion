"use client";

import React, { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import styles from '@/styles/competition.module.css';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { myAppHook } from '@/context/AppUtils';
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
  const [isPaused, setIsPaused] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [ isLoading, setIsLoading ] = useState(true)
  const [ competition, setCompetition ] = useState<Competition[]>([])
  
  const [ participants, setParticipants ] = useState<Participant[]>([])
  const [ problems, setProblems ] = useState<Problems[]>([])

  const [newCompetitionTitle, setNewCompetitionTitle] = useState("");
  const [creating, setCreating] = useState(false);

  const { isLoggedIn } = myAppHook()
  const { isLoading: authLoading } = AuthProtection()
  // const router = useRouter();

  useEffect(() => {
      if (isLoggedIn && !authLoading && !fetched) {
          callMe()
          setFetched(true)
      } else {
          if (authLoading || !isLoggedIn) {
              setIsLoading(true)
          }
      }
  }, [isLoggedIn, authLoading, fetched])

    const callMe = async () => {
        try {
            setIsLoading(true)
            // kani without xp ni sha huehue
            const parts = await getAllParticipants(roomId, 'creator', true)
            console.log('Attempting to get all participants: ', parts.data)

            setParticipants( parts.data.participants || [] )
            console.log('Attempting to get all participants: ', parts.data)
            
            const probs = await getRoomProblems(roomId)
            console.log('Fetching all problems: ', probs)
            setProblems(probs)

            const comp = await getAllCompe(roomId)
            console.log('Fetching all competitions: ', comp)
            setCompetition(comp)
        } catch (error) {
            console.error('Error fetching room details:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleCreateCompetition = async () => {
      if (!newCompetitionTitle.trim()) return;
      setCreating(true);
      try {
        // Call your API and pass the required data
        const result = await createCompe(roomId, newCompetitionTitle.trim());
        // Optionally update your local state with the new competition
        callMe(); // Refresh the competition list
        // setCompetition(result.data.competitions || []);
        setNewCompetitionTitle("");
      } catch (error) {
        // Handle error (show message, etc.)
      } finally {
        setCreating(false);
      }
    };

    if (isLoading || authLoading) {
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

  const redirectToManage = (compe_id : string) => {
    router.push(`${ROUTES.COMPETITION}/${compe_id}?room=${roomId}`)  
  };

  const toggleSort = () => {
    setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  console.log('competion: ', competition)

  return (
    <div className={styles.container}>
      <div className={styles.mainContainer}>
        {/* Header Section */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
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
                          <button className={styles.manageButton} onClick={() => redirectToManage(comp.id)}>
                            Manage
                          </button>
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
                {problems.map((problem, index) => (
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