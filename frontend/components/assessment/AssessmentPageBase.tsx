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

type AssessmentStage = 'intro' | 'dialogue' | 'assessment' | 'results';

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
            
            // TODO: Call backend API to get random questions
            // const response = await axios.get(`/api/assessments/generate/${config.type}`);
            // setAssessmentQuestions(response.data.questions);
            
            // For now, set empty array (will be populated when backend is ready)
            setAssessmentQuestions([]);
            
            setStage('assessment');
        } catch (error) {
            console.error(`[${config.type}] Error loading assessment:`, error);
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
            
            // TODO: Submit to backend and get results
            // const response = await axios.post('/api/assessments/submit', {
            //     type: config.type,
            //     answers: allAnswers,
            //     chapterId: config.chapterId
            // });
            
            // For now, create mock results
            const mockResults = {
                totalScore: 0,
                totalQuestions: config.totalQuestions,
                categoryScores: config.categories.map(cat => ({
                    category: cat.name,
                    score: 0,
                    total: config.questionsPerCategory,
                    icon: cat.icon
                })),
                timeTaken: 0
            };
            
            setResults(mockResults);
            setStage('results');
        } catch (error) {
            console.error(`[${config.type}] Error calculating results:`, error);
        } finally {
            setIsLoading(false);
        }
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
                    assessmentConfig={config}
                    onComplete={(results) => {
                        setResults(results);
                        setStage('results');
                    }}
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
                        categoryScores: [],
                        timeTaken: 0
                    }}
                    assessmentType={config.type}
                    comparison={config.showComparison ? { pretestScore: 0, improvement: 0 } : undefined}
                    onContinue={handleComplete}
                />
            </div>
        );
    }

    return null;
}
