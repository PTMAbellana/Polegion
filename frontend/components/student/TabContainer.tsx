import React, { useState } from 'react'
import { FaTrophy } from 'react-icons/fa'
import styles from '@/styles/room-details.module.css'
import ProblemsTab from './ProblemsTab'
import CompetitionsTab from './CompetitionsTab'
import { TabContainerProps } from '@/types'
import { TabType } from '@/constants/ui'

export default function TabContainer({ problems, competitions, roomCode }: TabContainerProps) {
    const [activeTab, setActiveTab] = useState<TabType>('competitions')

    return (
        <div className={styles.tabsContainer}>
            {/* Tab Buttons */}
            <div className={styles.tabButtons}>
                {/* <button
                    className={`${styles.tabButton} ${activeTab === 'problems' ? styles.tabButtonActive : ''}`}
                    onClick={() => setActiveTab('problems')}
                >
                    <FaBook />
                    Problems
                    <span className={styles.tabCount}>{problems.length}</span>
                </button> */}
                <button
                    className={`${styles.tabButton} ${activeTab === 'competitions' ? styles.tabButtonActive : ''}`}
                    onClick={() => setActiveTab('competitions')}
                >
                    <FaTrophy />
                    Competitions
                    <span className={styles.tabCount}>{competitions.length}</span>
                </button>
            </div>

            {/* Tab Content */}
            <div className={styles.tabContent}>
                {activeTab === 'problems' ? (
                    <ProblemsTab problems={problems} roomCode={roomCode} />
                ) : (
                    <CompetitionsTab competitions={competitions} />
                )}
            </div>
        </div>
    )
}
