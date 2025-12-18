import { useState, useEffect, useMemo } from 'react';
import { getSubmissionsByProblem } from '@/api/attempt';
import { CompetitionProblem } from '@/types/common/competition';

interface Problem {
  id: string;
  title: string;
  difficulty: string;
  expected_xp: number;
}

interface ViewerProblem extends Problem {
  competitionProblemId?: string;
}

interface Participant {
  id: string;
  user_id: string;
  fullName?: string;
  accumulated_xp: number;
}

export function useSubmissionViewer(competitionProblems: CompetitionProblem[], participants: Participant[]) {
  const viewerProblems = useMemo(() => {
    return competitionProblems
      .map((cp) => {
        if (!cp?.problem) return null;
        return {
          ...cp.problem,
          competitionProblemId: cp.id
        } as ViewerProblem;
      })
      .filter((problem): problem is ViewerProblem => problem !== null);
  }, [competitionProblems]);

  const problemLookup = useMemo(() => {
    const lookup = new Map<string, string>();
    competitionProblems.forEach((cp) => {
      const baseProblemId = cp?.problem?.id || cp.problem_id;
      if (baseProblemId && cp.id) {
        lookup.set(baseProblemId, cp.id);
      }
    });
    return lookup;
  }, [competitionProblems]);

  const [selectedProblem, setSelectedProblem] = useState<ViewerProblem | null>(null);
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [submission, setSubmission] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedProblem && !viewerProblems.some(problem => problem.id === selectedProblem.id)) {
      setSelectedProblem(null);
      setSelectedParticipant(null);
    }
  }, [viewerProblems, selectedProblem]);

  // Load submission when both problem and participant are selected
  useEffect(() => {
    if (!selectedProblem || !selectedParticipant) {
      setSubmission(null);
      return;
    }

    const competitionProblemId = selectedProblem.competitionProblemId || problemLookup.get(selectedProblem.id);

    if (!competitionProblemId) {
      setSubmission(null);
      return;
    }

    const loadSubmission = async () => {
      console.log('🔍 [useSubmissionViewer] Loading submission for:', {
        problemId: selectedProblem?.id,
        competitionProblemId,
        participantId: selectedParticipant?.id,
        participantUserId: selectedParticipant?.user_id
      });
      
      setLoading(true);
      try {
        const response = await getSubmissionsByProblem(competitionProblemId);
        console.log('📊 [useSubmissionViewer] API response:', {
          success: response.success,
          data: response.data,
          dataType: typeof response.data,
          isArray: Array.isArray(response.data),
          submissionCount: Array.isArray(response.data) ? response.data.length : 0
        });
        
        if (response.success && response.data && Array.isArray(response.data)) {
          console.log('📊 [useSubmissionViewer] Submissions:', response.data.map((s: any) => ({
            id: s.id,
            user_id: s.user_id,
            full_name: s.full_name
          })));
          
          // Find submission for the selected participant
          const userSubmission = response.data.find(
            (sub: any) => {
              const matches = sub.user_id === selectedParticipant.user_id || sub.user_id === selectedParticipant.id;
              console.log('🔍 [useSubmissionViewer] Checking submission:', {
                submission_user_id: sub.user_id,
                participant_user_id: selectedParticipant.user_id,
                participant_id: selectedParticipant.id,
                matches
              });
              return matches;
            }
          );
          
          console.log(userSubmission ? '✅ [useSubmissionViewer] Found submission!' : '⚠️ [useSubmissionViewer] No matching submission found');
          setSubmission(userSubmission || null);
        } else {
          console.log('⚠️ [useSubmissionViewer] API request failed, no data, or data is not an array');
          setSubmission(null);
        }
      } catch (error) {
        console.error('❌ [useSubmissionViewer] Error loading submission:', error);
        setSubmission(null);
      } finally {
        setLoading(false);
      }
    };

    loadSubmission();
  }, [selectedProblem, selectedParticipant, problemLookup]);

  return {
    selectedProblem,
    setSelectedProblem,
    selectedParticipant,
    setSelectedParticipant,
    submission,
    loading,
    problems: viewerProblems,
    participants
  };
}
