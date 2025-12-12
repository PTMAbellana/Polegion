// ============================================================================
// REUSABLE ASSESSMENT PAGE BASE COMPONENT
// Shared logic for Castle 0 (Pretest) and Castle 6 (Posttest)
// ============================================================================
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    AssessmentIntro,
    AssessmentQuiz,
    AssessmentProgress,
    AssessmentResults
} from '@/components/assessment';
import styles from '@/styles/assessment.module.css';
import { 
    generateAssessment, 
    submitAssessment, 
    getAssessmentResults, 
    getAssessmentComparison 
} from '@/api/assessments';
import { authUtils } from '@/api/axios';
import toast from 'react-hot-toast';

type AssessmentStage = 'intro' | 'dialogue' | 'assessment' | 'results';

// API Response Types
interface GenerateAssessmentResponse {
    success?: boolean;
    questions: any[];
    metadata: Record<string, any>;
}

interface AssessmentResults {
    correctAnswers: number;
    totalScore?: number;
    totalQuestions: number;
    percentage: number;
    categoryScores: Record<string, { correct: number; total: number; percentage: number }>;
    completedAt: string;
}

interface SubmitAssessmentResponse {
    success?: boolean;
    results: AssessmentResults;
}

interface ComparisonResponse {
    success?: boolean;
    comparison: {
        pretest: {
            percentage: number;
            categoryScores: Record<string, { correct: number; total: number; percentage: number }>;
            completedAt: string;
        };
        posttest: {
            percentage: number;
            categoryScores: Record<string, { correct: number; total: number; percentage: number }>;
            completedAt: string;
        };
        improvements: {
            overallImprovement: number;
            categoryImprovements: Record<string, number>;
        };
    };
}

// ============================================================================
// Configuration Interface
// ============================================================================
export interface AssessmentConfig {
    // Assessment identity
    type: 'pretest' | 'posttest';
    castleId: string;
    chapterId: string;
    
    // Display info
    title: string;
    description: string;
    castleName: string;
    
    // Dialogue and narration
    dialogue: string[];
    scenes: {
        opening: { start: number; end: number };
    };
    narration?: {
        opening: string[];
    };
    
    // Assessment configuration
    totalQuestions: number;
    questionsPerCategory: number;
    categories: Array<{
        id: string;
        name: string;
        icon?: string;
        description: string;
    }>;
    
    // Styling
    theme: {
        primaryColor: string;
        accentColor: string;
        style: 'kahoot' | 'quizlet';
    };
    
    // Posttest specific
    showComparison?: boolean;
    
    // Routing
    nextRoute?: string;
}

// ============================================================================
// Assessment Page Base Component
// ============================================================================
export default function AssessmentPageBase({ config }: { config: AssessmentConfig }) {
    const router = useRouter();
    const [stage, setStage] = useState<AssessmentStage>('intro');
    const [dialogueIndex, setDialogueIndex] = useState(0);
    const [assessmentQuestions, setAssessmentQuestions] = useState<any[]>([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
    const [startTime, setStartTime] = useState<string | null>(null);
    const [results, setResults] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const [restoredProgress, setRestoredProgress] = useState(false);

    const castleNumber = config.type === 'pretest' ? 0 : config.type === 'posttest' ? 6 : null;
    const castleBackgroundColors = (() => {
        if (castleNumber === 0) {
            return { primary: '#37353E', accent: '#44444E' };
        }
        if (castleNumber === 6) {
            return { primary: '#000080', accent: '#00044A' };
        }
        return { primary: config.theme.primaryColor, accent: config.theme.accentColor };
    })();

    const renderStage = (content: React.ReactNode, extraStyles: React.CSSProperties = {}) => {
        const themeStyles = {
            ['--primary-color' as any]: castleBackgroundColors.primary,
            ['--accent-color' as any]: castleBackgroundColors.accent,
        };

        return (
            <div 
                className={styles['assessment-container']}
                style={themeStyles}
            >
                <div className={styles['assessment-backdrop']} />
                <div 
                    className={styles['assessment-main']}
                    style={extraStyles}
                >
                    {content}
                </div>
            </div>
        );
    };

    // Get user ID for storage key
    const authData = authUtils.getAuthData();
    const userId = authData.user?.id || 'guest';
    const STORAGE_KEY = `assessment_${config.type}_${config.castleId}_${userId}`;

    // Check if assessment is already completed on mount
    useEffect(() => {
        const checkCompletedAssessment = async () => {
            const authData = authUtils.getAuthData();
            const userId = authData.user?.id;
            
            if (!userId) return;
            
            try {
                console.log(`[${config.type}] Checking if assessment is already completed...`);
                const response: any = await getAssessmentResults(userId, config.type);
                const existingResults = response?.results || response;
                
                if (existingResults && existingResults.percentage !== undefined) {
                    console.log(`[${config.type}] Assessment already completed, loading results...`);
                    
                    // Keep results in the format returned by backend
                    const formattedResults: any = {
                        totalScore: existingResults.totalScore || Math.round((existingResults.percentage / 100) * (existingResults.totalQuestions || config.totalQuestions)),
                        totalQuestions: existingResults.totalQuestions || config.totalQuestions,
                        percentage: existingResults.percentage,
                        categoryScores: existingResults.categoryScores || {}, // Keep as object
                        completedAt: existingResults.completedAt
                    };
                    
                    // If posttest, fetch comparison
                    if (config.type === 'posttest' && config.showComparison) {
                        try {
                            const comparison = await getAssessmentComparison(userId);
                            if (comparison) {
                                formattedResults.comparison = comparison;
                            }
                        } catch (err: any) {
                            // 404 means no pretest completed yet - this is expected
                            if (err?.response?.status === 404) {
                                console.log('[posttest] No pretest results found for comparison');
                            } else {
                                console.warn('Could not load comparison:', err);
                            }
                        }
                    }
                    
                    setResults(formattedResults);
                    setStage('results');
                    localStorage.removeItem(STORAGE_KEY); // Clear any saved progress
                    return;
                }
            } catch (error) {
                console.log(`[${config.type}] No completed assessment found, showing intro`);
            }
        };
        
        checkCompletedAssessment();
    }, [config.type, config.castleId, config.showComparison, STORAGE_KEY]);

    // Load saved progress on mount
    useEffect(() => {
        const savedProgress = localStorage.getItem(STORAGE_KEY);
        if (savedProgress) {
            try {
                const { stage: savedStage, questions, currentQ, answers, startTime: savedStart } = JSON.parse(savedProgress);
                console.log(`[${config.type}] Restoring saved progress...`);
                setStage(savedStage);
                setAssessmentQuestions(questions || []);
                setCurrentQuestion(currentQ || 0);
                setUserAnswers(answers || {});
                setStartTime(savedStart);
                if (savedStart) {
                    setElapsedSeconds(Math.max(0, Math.floor((Date.now() - new Date(savedStart).getTime()) / 1000)));
                }
                setRestoredProgress(true);
                return;
            } catch (error) {
                console.error('Failed to restore progress:', error);
                localStorage.removeItem(STORAGE_KEY);
            }
        }
        setRestoredProgress(false);
    }, [STORAGE_KEY, config.type]);

    // Timer tracking
    useEffect(() => {
        if (stage === 'assessment' && startTime) {
            const updateElapsed = () => {
                setElapsedSeconds(Math.max(0, Math.floor((Date.now() - new Date(startTime).getTime()) / 1000)));
            };
            updateElapsed();
            const intervalId = window.setInterval(updateElapsed, 1000);
            return () => clearInterval(intervalId);
        }
    }, [stage, startTime]);

    // Save progress whenever state changes
    useEffect(() => {
        if (stage === 'assessment' && assessmentQuestions.length > 0) {
            const progress = {
                stage,
                questions: assessmentQuestions,
                currentQ: currentQuestion,
                answers: userAnswers,
                startTime
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
            setRestoredProgress(true);
        }
    }, [stage, assessmentQuestions, currentQuestion, userAnswers, startTime, STORAGE_KEY]);

    // Clear progress on unmount or when assessment completes
    useEffect(() => {
        return () => {
            // Don't clear if still in progress
            if (stage === 'results') {
                localStorage.removeItem(STORAGE_KEY);
                setRestoredProgress(false);
            }
        };
    }, [stage, STORAGE_KEY]);

    // ============================================================================
    // INTRO STAGE
    // ============================================================================
    const handleStartAssessment = () => {
        console.log(`[${config.type}] Starting assessment dialogue...`);
        // Reset any previous state if starting a fresh attempt
        setAssessmentQuestions([]);
        setCurrentQuestion(0);
        setUserAnswers({});
        setStartTime(null);
        setElapsedSeconds(0);
        localStorage.removeItem(STORAGE_KEY);
        setRestoredProgress(false);
        setStage('dialogue');
    };

    // ============================================================================
    // DIALOGUE STAGE
    // ============================================================================
    const handleNextDialogue = () => {
        const { start, end } = config.scenes.opening;
        
        if (dialogueIndex < end) {
            setDialogueIndex(dialogueIndex + 1);
        } else {
            // Dialogue complete, load assessment
            loadAssessment();
        }
    };

    // ============================================================================
    // LOAD ASSESSMENT QUESTIONS
    // ============================================================================
    const loadAssessment = async () => {
        setIsLoading(true);
        try {
            console.log(`[${config.type}] Loading assessment questions...`);
            
            // Get user ID from auth data
            const authData = authUtils.getAuthData();
            const userId = authData.user?.id;
            
            if (!userId) {
                toast.error('Please log in to take the assessment');
                router.push('/auth/login');
                return;
            }
            
            // Call backend API to get random questions
            const response = await generateAssessment(userId, config.type) as GenerateAssessmentResponse;
            
            if (response.questions && response.questions.length > 0) {
                const startedAt = startTime || new Date().toISOString();
                if (!startTime) {
                    setStartTime(startedAt);
                    setElapsedSeconds(0);
                }
                setAssessmentQuestions(response.questions);
                setCurrentQuestion(0);
                setUserAnswers({});
                console.log(`[${config.type}] Loaded ${response.questions.length} questions`);
                setStage('assessment');
                localStorage.setItem(STORAGE_KEY, JSON.stringify({
                    stage: 'assessment',
                    questions: response.questions,
                    currentQ: 0,
                    answers: {},
                    startTime: startedAt
                }));
                setRestoredProgress(true);
            } else {
                toast.error('Failed to load assessment questions');
                console.error('Invalid response:', response);
            }
            
        } catch (error: any) {
            console.error(`[${config.type}] Error loading assessment:`, error);
            
            // Check if error is 400 (assessment already completed)
            if (error?.response?.status === 400) {
                console.log(`[${config.type}] Assessment already completed, loading results...`);
                
                try {
                    const authData = authUtils.getAuthData();
                    const userId = authData.user?.id;
                    
                    if (userId) {
                        const response: any = await getAssessmentResults(userId, config.type);
                        const existingResults = response?.results || response;
                        
                        if (existingResults) {
                            // Keep results in the format returned by backend
                            const formattedResults: any = {
                                totalScore: existingResults.totalScore || Math.round((existingResults.percentage / 100) * (existingResults.totalQuestions || 60)),
                                totalQuestions: existingResults.totalQuestions || 60,
                                percentage: existingResults.percentage,
                                categoryScores: existingResults.categoryScores || {}, // Keep as object
                                completedAt: existingResults.completedAt
                            };
                            
                            // If posttest, fetch comparison
                            if (config.type === 'posttest' && config.showComparison) {
                                try {
                                    const comparison = await getAssessmentComparison(userId);
                                    if (comparison) {
                                        formattedResults.comparison = comparison;
                                    }
                                } catch (err: any) {
                                    // 404 means no pretest completed yet - this is expected
                                    if (err?.response?.status === 404) {
                                        console.log('[posttest] No pretest results found for comparison');
                                    } else {
                                        console.warn('Could not load comparison:', err);
                                    }
                                }
                            }
                            
                            setResults(formattedResults);
                            setStage('results');
                            localStorage.removeItem(STORAGE_KEY); // Clear any saved progress
                            toast.success('Showing your completed assessment results');
                        }
                    }
                } catch (resultError) {
                    console.error('Failed to load existing results:', resultError);
                    toast.error('You have already completed this assessment');
                    setTimeout(() => router.push('/student/world'), 2000);
                }
            } else {
                toast.error('Failed to load assessment. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    // ============================================================================
    // HANDLE ANSWER SUBMISSION
    // ============================================================================
    const handleAnswerSubmit = (answer: string) => {
        console.log(`[${config.type}] Question ${currentQuestion + 1} answered:`, answer);
        
        // Store answer for current question
        setUserAnswers(prev => ({
            ...prev,
            [currentQuestion]: answer
        }));
    };

    // Navigate to specific question
    const handleQuestionNavigate = (questionIndex: number) => {
        if (questionIndex >= 0 && questionIndex < assessmentQuestions.length) {
            setCurrentQuestion(questionIndex);
        }
    };

    // Check if all questions are answered
    const allQuestionsAnswered = () => {
        return Object.keys(userAnswers).length === assessmentQuestions.length;
    };

    // Submit assessment when all questions answered
    const handleSubmitAssessment = () => {
        if (!allQuestionsAnswered()) {
            toast.error(`Please answer all ${assessmentQuestions.length} questions before submitting`);
            return;
        }
        
        // Convert answers object to array format for backend
        const answersArray = assessmentQuestions.map((q, index) => ({
            questionId: q.questionId,
            answer: userAnswers[index]
        }));
        
        calculateResults(answersArray);
    };

    // ============================================================================
    // CALCULATE RESULTS
    // ============================================================================
    const calculateResults = async (allAnswers: any[]) => {
        setIsLoading(true);
        try {
            console.log(`[${config.type}] Calculating results...`);
            
            // Get user ID from auth data
            const authData = authUtils.getAuthData();
            const userId = authData.user?.id;
            
            if (!userId) {
                toast.error('User session expired. Please log in again.');
                router.push('/auth/login');
                return;
            }

            // Calculate duration
            const endTime = new Date().toISOString();
            const duration = startTime ? Math.floor((new Date(endTime).getTime() - new Date(startTime).getTime()) / 1000) : 0;
            
            console.log(`[${config.type}] Test duration: ${duration} seconds`);
            
            // Submit to backend and get results
            const response = await submitAssessment(
                userId, 
                config.type, 
                allAnswers, 
                startTime || undefined, 
                endTime, 
                duration
            ) as SubmitAssessmentResponse;
            
            console.log(`[${config.type}] Raw response:`, response);
            console.log(`[${config.type}] Response type:`, typeof response);
            console.log(`[${config.type}] Response keys:`, Object.keys(response || {}));
            
            if (response.results || response) {
                const results = response.results || response;
                console.log(`[${config.type}] Results data:`, results);
                console.log(`[${config.type}] Results keys:`, Object.keys(results || {}));
                console.log(`[${config.type}] Category scores:`, results.categoryScores);
                console.log(`[${config.type}] Category scores type:`, typeof results.categoryScores);
                console.log(`[${config.type}] Category scores keys:`, Object.keys(results.categoryScores || {}));
                
                // Keep results in the format returned by backend
                const transformedResults: any = {
                    totalScore: results.correctAnswers || results.totalScore || 0,
                    totalQuestions: results.totalQuestions || 0,
                    percentage: results.percentage || 0,
                    categoryScores: results.categoryScores || {}, // Keep as object
                    completedAt: results.completedAt || new Date().toISOString()
                };
                
                console.log(`[${config.type}] Transformed results:`, transformedResults);
                console.log(`[${config.type}] Transformed categoryScores:`, transformedResults.categoryScores);
                console.log(`[${config.type}] Setting stage to results...`);
                
                // For posttest, get comparison data
                if (config.type === 'posttest' && config.showComparison) {
                    try {
                        const comparisonResponse = await getAssessmentComparison(userId) as ComparisonResponse;
                        if (comparisonResponse && comparisonResponse.comparison) {
                            transformedResults.comparison = comparisonResponse.comparison;
                            console.log('[posttest] Comparison data loaded');
                        }
                    } catch (error: any) {
                        // It's okay if comparison fails (e.g., user hasn't done pretest)
                        if (error?.response?.status === 404) {
                            console.log('[posttest] No pretest found for comparison - this is okay');
                        } else {
                            console.warn('Could not load comparison data:', error);
                        }
                    }
                }
                
                console.log(`[${config.type}] About to update state - results and stage`);
                
                // Update results first
                setResults(transformedResults);
                
                // Use setTimeout to ensure state is updated before changing stage
                setTimeout(() => {
                    setStage('results');
                    console.log(`[${config.type}] State updated to results - rendering now`);
                }, 100);
                
                localStorage.removeItem(STORAGE_KEY); // Clear progress after completion
                setRestoredProgress(false);
                setStartTime(null);
                setElapsedSeconds(0);
                setAssessmentQuestions([]);
                setCurrentQuestion(0);
                setUserAnswers({});
                toast.success('Assessment completed!');
            } else {
                toast.error('Failed to save results');
            }
            
        } catch (error) {
            console.error(`[${config.type}] Error calculating results:`, error);
            toast.error('Failed to submit assessment. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };
    
    // Helper to get category icon
    const getCategoryIcon = (categoryName: string): string => {
        const category = config.categories.find(cat => cat.name === categoryName);
        return category?.icon || '';
    };

    // ============================================================================
    // HANDLE COMPLETION
    // ============================================================================
    const handleComplete = () => {
        console.log(`[${config.type}] Assessment complete, navigating...`);
        
        if (config.nextRoute) {
            router.push(config.nextRoute);
        } else {
            // Default: return to world map
            router.push('/student/worldmap');
        }
    };

    // ============================================================================
    // RENDER STAGES
    // ============================================================================
    
    // INTRO STAGE
    if (stage === 'intro') {
        const introCastleNumber = castleNumber ?? 1;
        return renderStage(
            <AssessmentIntro
                title={config.title}
                description={config.description}
                totalQuestions={config.totalQuestions}
                castleNumber={introCastleNumber}
                categories={config.categories}
                onStart={handleStartAssessment}
            />
        );
    }

    // DIALOGUE STAGE
    if (stage === 'dialogue') {
        const currentDialogue = config.dialogue[dialogueIndex];
        const totalDialogueLines = config.dialogue.length;
        const progressPercent = Math.round(((dialogueIndex + 1) / Math.max(totalDialogueLines, 1)) * 100);
        const dialogueTheme = (() => {
            if (castleNumber === 0) {
                return {
                    panel: '#F2F2F4',
                    accent: '#715A5A',
                    muted: '#4A454F'
                };
            }
            if (castleNumber === 6) {
                return {
                    panel: '#FFF7D6',
                    accent: '#FFBF1C',
                    muted: '#4C3A00'
                };
            }
            return {
                panel: '#f4f6ff',
                accent: '#8b5cf6',
                muted: '#4a5568'
            };
        })();
        
        return renderStage(
            <div className={styles['dialogue-box']}>
                <div className={styles['dialogue-progress']}>
                    <div>
                        <span className={styles['progress-label']}>Guide Briefing</span>
                        <div className={styles['progress-bar']}>
                            <div
                                className={styles['progress-fill']}
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                    </div>
                    <span className={styles['progress-count']}>
                        {dialogueIndex + 1} / {totalDialogueLines}
                    </span>
                </div>

                <div className={styles['dialogue-hero']}>
                    <div>
                        <p className={styles['dialogue-subtitle']}>Welcome to {config.castleName}</p>
                        <h2>{config.title}</h2>
                        <p className={styles['dialogue-description']}>
                            {config.description}
                        </p>
                    </div>
                    <div className={styles['dialogue-meta']}>
                        <span>{config.totalQuestions} Questions</span>
                        <span>{config.categories.length} Categories</span>
                    </div>
                </div>

                <div className={styles['dialogue-content']}>
                    <p>{currentDialogue}</p>
                </div>
                
                {config.type === 'pretest' && dialogueIndex === 2 && (
                    <div className={styles['reassurance-message']}>
                        <p className={styles['reassurance-text']}>
                            <strong>Reminder:</strong> This checkpoint only measures what you already know. 
                            Use it to see how much you grow later on.
                        </p>
                    </div>
                )}

                <div className={styles['dialogue-footer']}>
                    <div className={styles['dialogue-hint']}>
                        Press Enter or tap Continue
                    </div>
                    <button 
                        onClick={handleNextDialogue}
                        className={styles['dialogue-button']}
                    >
                        {dialogueIndex < config.scenes.opening.end ? 'Continue' : 'Begin Assessment'}
                    </button>
                </div>
            </div>,
            {
                ['--dialogue-panel' as any]: dialogueTheme.panel,
                ['--dialogue-accent' as any]: dialogueTheme.accent,
                ['--dialogue-muted' as any]: dialogueTheme.muted
            }
        );
    }

    // ASSESSMENT STAGE
    if (stage === 'assessment') {
        if (isLoading) {
            return renderStage(
                <div className={styles['loading']}>
                    <p>Loading assessment...</p>
                </div>
            );
        }

        if (assessmentQuestions.length === 0) {
            return renderStage(
                <div className={styles['placeholder']}>
                    <h2>Assessment Questions</h2>
                    <p>Backend integration pending. Questions will be loaded here.</p>
                    <button onClick={() => setStage('results')} className={styles['continue-button']}>
                        Skip to Results (Testing)
                    </button>
                </div>
            );
        }

        const currentQuestionData = assessmentQuestions[currentQuestion] || assessmentQuestions[0];
        const currentCategoryName = currentQuestionData?.category || config.categories[0]?.name || 'Current category';
        const currentCategoryIcon = getCategoryIcon(currentCategoryName);

        return renderStage(
            <AssessmentQuiz
                questions={assessmentQuestions}
                currentQuestionIndex={currentQuestion}
                userAnswers={userAnswers}
                onAnswerSubmit={handleAnswerSubmit}
                onNavigate={handleQuestionNavigate}
                onSubmitAssessment={handleSubmitAssessment}
                currentCategory={currentCategoryName}
                categoryIcon={currentCategoryIcon}
                elapsedSeconds={elapsedSeconds}
            />
        );
    }

    // RESULTS STAGE
    if (stage === 'results') {
        console.log(`[${config.type}] Rendering results stage with:`, results);
        
        return renderStage(
            <AssessmentResults
                key={`results-${results?.completedAt || Date.now()}`}
                results={results || {
                    totalScore: 0,
                    totalQuestions: config.totalQuestions,
                    percentage: 0,
                    categoryScores: {},
                    completedAt: new Date().toISOString()
                }}
                assessmentType={config.type}
                onContinue={handleComplete}
            />
        );
    }

    return null;
}
