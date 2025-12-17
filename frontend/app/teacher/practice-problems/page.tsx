"use client"

import { useState, useEffect } from "react"
import { useAuthStore } from "@/store/authStore"
import { getAllProblems } from "@/api/problems"
import PageHeader from "@/components/PageHeader"
import LoadingOverlay from "@/components/LoadingOverlay"
import styles from "@/styles/dashboard-wow.module.css"
import problemStyles from "@/styles/teacher-problems-viewer.module.css"
import { FaBrain, FaFilter, FaSearch } from "react-icons/fa"

interface Problem {
  id: number
  title: string
  description: string
  difficulty: 'easy' | 'medium' | 'hard'
  xp: number
  problem_type: string
  problem_number: number
  is_hidden: boolean
}

export default function TeacherPracticeProblemsPage() {
  const { userProfile, appLoading } = useAuthStore()
  const [problems, setProblems] = useState<Problem[]>([])
  const [filteredProblems, setFilteredProblems] = useState<Problem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Filters
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [showHidden, setShowHidden] = useState(false)

  useEffect(() => {
    if (!appLoading && userProfile?.id) {
      fetchProblems()
    }
  }, [appLoading, userProfile])

  useEffect(() => {
    applyFilters()
  }, [problems, searchQuery, selectedDifficulty, selectedType, showHidden])

  const fetchProblems = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await getAllProblems()
      
      if (response.success && response.data) {
        // Sort by problem number
        const sortedProblems = response.data.sort((a: Problem, b: Problem) => 
          a.problem_number - b.problem_number
        )
        setProblems(sortedProblems)
      } else {
        setError("Failed to load practice problems")
      }
    } catch (err: any) {
      console.error("Error fetching problems:", err)
      setError(err.message || "Failed to load practice problems")
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...problems]

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.problem_type.toLowerCase().includes(query)
      )
    }

    // Filter by difficulty
    if (selectedDifficulty !== "all") {
      filtered = filtered.filter(p => p.difficulty === selectedDifficulty)
    }

    // Filter by type
    if (selectedType !== "all") {
      filtered = filtered.filter(p => p.problem_type === selectedType)
    }

    // Filter by hidden status
    if (!showHidden) {
      filtered = filtered.filter(p => !p.is_hidden)
    }

    setFilteredProblems(filtered)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '#22c55e'
      case 'medium': return '#eab308'
      case 'hard': return '#ef4444'
      default: return '#6b7280'
    }
  }

  const getDifficultyBadgeClass = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return problemStyles.badgeEasy
      case 'medium': return problemStyles.badgeMedium
      case 'hard': return problemStyles.badgeHard
      default: return problemStyles.badgeDefault
    }
  }

  // Get unique problem types for filter
  const problemTypes = Array.from(new Set(problems.map(p => p.problem_type)))

  if (appLoading || loading) {
    return <LoadingOverlay isLoading={true} />
  }

  return (
    <div className={styles["dashboard-container"]}>
      <PageHeader
        title="Practice Problems Library"
        subtitle="View all practice problems available to students"
        showAvatar={true}
        avatarText={userProfile?.first_name?.charAt(0).toUpperCase() || 'T'}
      />

      <div className={styles["scrollable-content"]}>
        {/* Filters Section */}
        <div className={problemStyles.filtersSection}>
          <div className={problemStyles.searchBox}>
            <FaSearch className={problemStyles.searchIcon} />
            <input
              type="text"
              placeholder="Search problems by title, description, or type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={problemStyles.searchInput}
            />
          </div>

          <div className={problemStyles.filterGroup}>
            <div className={problemStyles.filterItem}>
              <label>Difficulty:</label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className={problemStyles.filterSelect}
              >
                <option value="all">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div className={problemStyles.filterItem}>
              <label>Type:</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className={problemStyles.filterSelect}
              >
                <option value="all">All Types</option>
                {problemTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className={problemStyles.checkboxItem}>
              <input
                type="checkbox"
                id="showHidden"
                checked={showHidden}
                onChange={(e) => setShowHidden(e.target.checked)}
                className={problemStyles.checkbox}
              />
              <label htmlFor="showHidden">Show Hidden Problems</label>
            </div>
          </div>

          <div className={problemStyles.resultsCount}>
            Showing {filteredProblems.length} of {problems.length} problems
          </div>
        </div>

        {error && (
          <div className={problemStyles.errorMessage}>
            <p>{error}</p>
            <button onClick={fetchProblems} className="btn btn-primary">
              Retry
            </button>
          </div>
        )}

        {!error && filteredProblems.length === 0 && (
          <div className={problemStyles.emptyState}>
            <FaBrain size={64} color="#6b7280" />
            <h3>No Problems Found</h3>
            <p>
              {problems.length === 0 
                ? "No practice problems are available yet."
                : "No problems match your current filters. Try adjusting your search."}
            </p>
          </div>
        )}

        {!error && filteredProblems.length > 0 && (
          <div className={problemStyles.problemsGrid}>
            {filteredProblems.map((problem) => (
              <div 
                key={problem.id} 
                className={`${problemStyles.problemCard} ${problem.is_hidden ? problemStyles.hiddenProblem : ''}`}
              >
                <div className={problemStyles.problemHeader}>
                  <div className={problemStyles.problemMeta}>
                    <span className={problemStyles.problemNumber}>
                      #{problem.problem_number}
                    </span>
                    <span className={getDifficultyBadgeClass(problem.difficulty)}>
                      {problem.difficulty.toUpperCase()}
                    </span>
                    {problem.is_hidden && (
                      <span className={problemStyles.hiddenBadge}>
                        🔒 Hidden
                      </span>
                    )}
                  </div>
                </div>

                <h3 className={problemStyles.problemTitle}>{problem.title}</h3>
                
                <p className={problemStyles.problemDescription}>
                  {problem.description}
                </p>

                <div className={problemStyles.problemFooter}>
                  <div className={problemStyles.problemType}>
                    <strong>Type:</strong> {problem.problem_type}
                  </div>
                  <div className={problemStyles.problemXp}>
                    ⭐ {problem.xp} XP
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className={problemStyles.infoBox}>
          <h4>📝 About Practice Problems</h4>
          <p>
            This library contains all practice problems that students can access 
            through virtual rooms. Problems can be assigned to rooms for students 
            to solve and earn XP.
          </p>
          <p style={{ marginTop: '1rem', fontSize: '0.9rem', opacity: 0.8 }}>
            <strong>Note:</strong> Hidden problems are not visible to students 
            until you explicitly assign them to a room. Use the "Show Hidden Problems" 
            filter to view all problems including hidden ones.
          </p>
        </div>
      </div>
    </div>
  )
}
