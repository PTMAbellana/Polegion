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
        icon: string;
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
    const [userAnswers, setUserAnswers] = useState<any[]>([]);
    const [results, setResults] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Reset component state when navigating back to assessment page
    useEffect(() => {
        return () => {
            // Cleanup when component unmounts
            setStage('intro');
            setDialogueIndex(0);
            setAssessmentQuestions([]);
            setCurrentQuestion(0);
            setUserAnswers([]);
            setResults(null);
        };
    }, []);

    // ============================================================================
    // INTRO STAGE
    // ============================================================================
    const handleStartAssessment = () => {
        console.log(`[${config.type}] Starting assessment dialogue...`);
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
            
            // Get user ID from localStorage or auth context
            const userId = localStorage.getItem('user_id');
            if (!userId) {
                toast.error('Please log in to take the assessment');
                router.push('/auth/login');
                return;
            }
            
            // Call backend API to get random questions
            const response = await generateAssessment(userId, config.type) as GenerateAssessmentResponse;
            
            if (response.questions && response.questions.length > 0) {
                setAssessmentQuestions(response.questions);
                console.log(`[${config.type}] Loaded ${response.questions.length} questions`);
                setStage('assessment');
            } else {
                toast.error('Failed to load assessment questions');
                console.error('Invalid response:', response);
            }
            
        } catch (error) {
            console.error(`[${config.type}] Error loading assessment:`, error);
            toast.error('Failed to load assessment. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // ============================================================================
    // HANDLE ANSWER SUBMISSION
    // ============================================================================
    const handleAnswerSubmit = (answer: any) => {
        console.log(`[${config.type}] Question ${currentQuestion + 1} answered:`, answer);
        
        // Store answer
        setUserAnswers([...userAnswers, answer]);
        
        // Move to next question or finish
        if (currentQuestion < assessmentQuestions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            // All questions answered, calculate results
            calculateResults([...userAnswers, answer]);
        }
    };

    // ============================================================================
    // CALCULATE RESULTS
    // ============================================================================
    const calculateResults = async (allAnswers: any[]) => {
        setIsLoading(true);
        try {
            console.log(`[${config.type}] Calculating results...`);
            
            // Get user ID
            const userId = localStorage.getItem('user_id');
            if (!userId) {
                toast.error('User session expired. Please log in again.');
                router.push('/auth/login');
                return;
            }
            
            // Format answers for backend
            const formattedAnswers = allAnswers.map((answer, index) => ({
                questionId: assessmentQuestions[index].id,
                selectedAnswer: answer
            }));
            
            // Submit to backend and get results
            const response = await submitAssessment(userId, config.type, formattedAnswers) as SubmitAssessmentResponse;
            
            if (response.results) {
                console.log(`[${config.type}] Results:`, response.results);
                
                // Transform backend results for display
                const transformedResults: any = {
                    totalScore: response.results.correctAnswers,
                    totalQuestions: response.results.totalQuestions,
                    percentage: response.results.percentage,
                    categoryScores: Object.entries(response.results.categoryScores).map(([category, scores]: [string, any]) => ({
                        category,
                        score: scores.correct,
                        total: scores.total,
                        percentage: scores.percentage,
                        icon: getCategoryIcon(category)
                    })),
                    completedAt: response.results.completedAt
                };
                
                // For posttest, get comparison data
                if (config.type === 'posttest' && config.showComparison) {
                    try {
                        const comparisonResponse = await getAssessmentComparison(userId) as ComparisonResponse;
                        if (comparisonResponse.comparison) {
                            transformedResults.comparison = comparisonResponse.comparison;
                        }
                    } catch (error) {
                        console.warn('Could not load comparison data:', error);
                    }
                }
                
                setResults(transformedResults);
                setStage('results');
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
        return category?.icon || '📚';
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
        return (
            <div className={styles['assessment-container']}>
                <AssessmentIntro
                    title={config.title}
                    description={config.description}
                    totalQuestions={config.totalQuestions}
                    categories={config.categories}
                    onStart={handleStartAssessment}
                />
            </div>
        );
    }

    // DIALOGUE STAGE
    if (stage === 'dialogue') {
        const currentDialogue = config.dialogue[dialogueIndex];
        
        return (
            <div className={styles['assessment-container']}>
                <div className={styles['dialogue-box']}>
                    <div className={styles['dialogue-header']}>
                        <h2>{config.castleName}</h2>
                    </div>
                    
                    <div className={styles['dialogue-content']}>
                        <p>{currentDialogue}</p>
                    </div>
                    
                    <div className={styles['dialogue-footer']}>
                        <button 
                            onClick={handleNextDialogue}
                            className={styles['dialogue-button']}
                        >
                            {dialogueIndex < config.scenes.opening.end ? 'Continue' : 'Begin Assessment'}
                        </button>
                    </div>
                    
                    {config.type === 'pretest' && dialogueIndex === 2 && (
                        <div className={styles['reassurance-message']}>
                            <p className={styles['reassurance-text']}>
                                💡 <strong>Remember:</strong> This is just to help us understand what you know. 
                                There are no wrong answers, and your score won't affect your progress!
                            </p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // ASSESSMENT STAGE
    if (stage === 'assessment') {
        if (isLoading) {
            return (
                <div className={styles['assessment-container']}>
                    <div className={styles['loading']}>
                        <p>Loading assessment...</p>
                    </div>
                </div>
            );
        }

        if (assessmentQuestions.length === 0) {
            return (
                <div className={styles['assessment-container']}>
                    <div className={styles['placeholder']}>
                        <h2>Assessment Questions</h2>
                        <p>Backend integration pending. Questions will be loaded here.</p>
                        <button onClick={() => setStage('results')} className={styles['continue-button']}>
                            Skip to Results (Testing)
                        </button>
                    </div>
                </div>
            );
        }

        return (
            <div className={styles['assessment-container']}>
                <AssessmentProgress
                    currentQuestion={currentQuestion + 1}
                    totalQuestions={assessmentQuestions.length}
                    currentCategory={config.categories[Math.floor(currentQuestion / config.questionsPerCategory)]?.name || ''}
                    categoryIcon={config.categories[Math.floor(currentQuestion / config.questionsPerCategory)]?.icon || ''}
                />
                
                <AssessmentQuiz
                    questions={assessmentQuestions}
                    currentQuestionIndex={currentQuestion}
                    onAnswerSubmit={handleAnswerSubmit}
                />
            </div>
        );
    }

    // RESULTS STAGE
    if (stage === 'results') {
        return (
            <div className={styles['assessment-container']}>
                <AssessmentResults
                    results={results || {
                        totalScore: 0,
                        totalQuestions: config.totalQuestions,
                        percentage: 0,
                        categoryScores: [],
                        completedAt: new Date().toISOString()
                    }}
                    assessmentType={config.type}
                    onContinue={handleComplete}
                />
            </div>
        );
    }

    return null;
}
