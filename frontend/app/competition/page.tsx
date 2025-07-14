"use client";

import React, { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, Edit3, Pause, Play } from 'lucide-react';
import styles from '@/styles/competition.module.css';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { myAppHook } from '@/context/AppUtils';
import { AuthProtection } from '@/context/AuthProtection';
import Loader from '@/components/Loader';
import { getRoomProblems } from '@/api/problems';
import { getAllParticipants } from '@/api/participants';
import { getAllCompe } from '@/api/competitions';
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
      {/* Main Container */}
      <div className={styles.mainContainer}>
        {/* Header Section */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>
              Competition Dashboard
            </h1>
            <p className={styles.status}>
              Status: <span className={styles.statusValue}>Ongoing</span>
            </p>
            <p className={styles.description}>
              You can see the progress of the students and how much XP they have garnered already.
            </p>
          </div>
        </div>

        {/* Timer Section */}
        <div className={styles.timerSection}>
          <div className={styles.timerContent}>
            <div className={styles.timer}>
              00:14
            </div>
            <div className={styles.timerControls}>
              <button
                onClick={togglePause}
                className={styles.timerButton}
              >
                {isPaused ? (
                  <Play className="w-8 h-8 text-gray-700" />
                ) : (
                  <Pause className="w-8 h-8 text-gray-700" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Problems Section */}
        <div className={styles.participantsSection}>
          <div className={styles.participantsHeader}>
            <h2 className={styles.participantsTitle}>
              Problems:
            </h2>
          </div>

          {/* Problems List */}
          <div className={styles.participantsList}>
            {problems.map((problem, index) => (
              <div key={problem.id} className={styles.participantCard}>
                <div className={styles.participantContent}>
                  <div className={styles.participantLeft}>
                    <div className={styles.participantRank}>{index + 1}</div>
                    <div>
                      <h3 className={styles.participantName}>{problem.title || 'No Title'}</h3>
                    </div>
                  </div>
                  <div className={styles.participantRight}>
                    <div className={styles.participantXp}>
                      {problem.timer != null ? `${problem.timer} seconds` : 'No timer'}
                    </div>
                    <button className={styles.editButton}>
                      <Edit3 className="w-5 h-5 text-gray-600" />
                    </button>
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
              Participants:
            </h2>
            
            {/* Sort Control */}
            <div className={styles.sortControls}>
              <button
                onClick={toggleSort}
                className={styles.sortButton}
              >
                <div className={styles.sortIcons}>
                  <ChevronUp className={`w-4 h-4 ${sortOrder === 'asc' ? 'text-blue-600' : 'text-gray-400'}`} />
                  <ChevronDown className={`w-4 h-4 ${sortOrder === 'desc' ? 'text-blue-600' : 'text-gray-400'}`} />
                </div>
                <span className={styles.sortText}>
                  {sortOrder === 'desc' ? 'Descending' : 'Ascending'}
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
                    {/* <button className={styles.editButton}>
                      <Edit3 className="w-5 h-5 text-gray-600" />
                    </button> */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        {/* <div className={styles.actionSection}>
          <button className={styles.observeButton}>
            <Eye className="w-5 h-5" />
            <span>Observe</span>
          </button>
        </div> */}
      </div>

      {/* My Room Section */}
      <div className={styles.myRoomSection}>
        <h2 className={styles.myRoomTitle}>Room Competitions</h2>
        <div className={styles.roomGrid}>
          {competition.length > 0 ? (
            competition.map((comp) => (
              <div key={comp.id} className={styles.roomCard}>
                {/* Room Banner */}
                <div className={styles.roomBanner}>
                  <div className={styles.roomBannerOverlay}></div>
                  <div className={styles.roomBannerContent}>
                    <h3 className={styles.roomBannerTitle}>{comp.title}</h3>
                  </div>
                </div>
                {/* Room Content (no description/mantra) */}
                <div className={styles.roomContent}>
                  <div className={styles.roomFooter}>
                    <div className={styles.roomStatus}>
                      <span className={styles.roomStatusLabel}>Status:</span> {comp.status}
                    </div>
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
  );
};

export default CompetitionDashboard;