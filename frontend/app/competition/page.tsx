"use client";

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Edit3, Pause, Play, Eye } from 'lucide-react';
import styles from '@/styles/competition.module.css';

const CompetitionDashboard = () => {
  const [sortOrder, setSortOrder] = useState('desc');
  const [isPaused, setIsPaused] = useState(false);
  
  // Sample data
  const participants = [
    { id: 1, name: 'Francis Benedict Y. Chavez', xp: 1000, rank: 1 },
    { id: 2, name: 'Paul Thomas M. Abellana', xp: 600, rank: 2 },
    { id: 3, name: 'Nicole Ejares', xp: 600, rank: 3 },
    { id: 4, name: 'Nina Margarette Catubig', xp: 600, rank: 4 },
  ];

  const sortedParticipants = [...participants].sort((a, b) => {
    return sortOrder === 'desc' ? b.xp - a.xp : a.xp - b.xp;
  });

  const toggleSort = () => {
    setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  return (
    <div className={styles.container}>
      {/* Main Container */}
      <div className={styles.mainContainer}>
        {/* Header Section */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>
              Competition 1 Dashboard
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
                        {participant.name}
                      </h3>
                    </div>
                  </div>
                  
                  <div className={styles.participantRight}>
                    <div className={styles.participantXp}>
                      {participant.xp} XP
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

        {/* Action Buttons */}
        <div className={styles.actionSection}>
          <button className={styles.observeButton}>
            <Eye className="w-5 h-5" />
            <span>Observe</span>
          </button>
        </div>
      </div>

      {/* My Room Section */}
      <div className={styles.myRoomSection}>
        <h2 className={styles.myRoomTitle}>My Room</h2>
        <div className={styles.roomGrid}>
          {/* Room Card */}
          <div className={styles.roomCard}>
            {/* Room Banner */}
            <div className={styles.roomBanner}>
              <div className={styles.roomBannerOverlay}></div>
              <div className={styles.roomBannerContent}>
                <h3 className={styles.roomBannerTitle}>Competition Room 1</h3>
              </div>
            </div>
            
            {/* Room Content */}
            <div className={styles.roomContent}>
              <div className={styles.roomDescription}>
                <h4 className={styles.roomDescriptionTitle}>Description</h4>
                <p className={styles.roomDescriptionText}>
                  A competitive programming challenge for students to test their coding skills.
                </p>
              </div>
              
              <div className={styles.roomMantra}>
                <h4 className={styles.roomMantraTitle}>Room Mantra</h4>
                <p className={styles.roomMantraText}>
                  "Code with passion, compete with honor."
                </p>
              </div>
              
              <div className={styles.roomFooter}>
                <div className={styles.roomStatus}>
                  <span className={styles.roomStatusLabel}>Status:</span> Active
                </div>
                <button className={styles.manageButton}>
                  Manage
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompetitionDashboard;