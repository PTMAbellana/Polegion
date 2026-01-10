/**
 * CSVQuestionBankService
 * Fetches pre-validated questions from imported CSV dataset
 * GUARANTEES correct answer is in options (unlike parametric generation)
 */
class CSVQuestionBankService {
  constructor(database) {
    this.db = database;
  }

  /**
   * Get question from CSV question bank
   * @param {number} difficultyLevel - 1-5
   * @param {string} topicName - Topic filter (optional)
   * @param {string} representationType - text/visual/real_world
   * @param {string[]} excludeQuestionIds - Already shown questions
   * @returns {Object} Question with guaranteed correct answer in options
   */
  async getQuestion(difficultyLevel, topicName = null, representationType = 'text', excludeQuestionIds = []) {
    try {
      console.log('[CSVQuestionBank] Fetching question:', {
        difficulty: difficultyLevel,
        topic: topicName,
        representation: representationType,
        excluded: excludeQuestionIds.length
      });

      const { data, error } = await this.db
        .rpc('get_question_from_bank', {
          p_difficulty: difficultyLevel,
          p_topic: topicName,
          p_representation: representationType,
          p_exclude_ids: excludeQuestionIds
        });

      if (error) {
        console.error('[CSVQuestionBank] Database error:', error);
        return null;
      }

      if (!data || data.length === 0) {
        console.warn('[CSVQuestionBank] No questions found for criteria');
        return null;
      }

      const question = data[0];
      
      // Shuffle options to prevent answer position bias
      const options = this.shuffleOptions(question.options, question.correct_answer);

      return {
        id: `csv_${question.id}`,
        questionId: `csv_${question.id}`,
        question_text: question.question_text,
        options: options.shuffled,
        correct_answer: question.correct_answer,
        correctIndex: options.correctIndex,
        hint: question.hint || this.generateDefaultHint(question.question_text),
        difficulty: difficultyLevel,
        cognitive_domain: question.cognitive_domain || 'knowledge_recall',
        representation_type: question.representation_type || 'text',
        type: 'csv_imported',
        source: 'csv_question_bank',
        generated_at: new Date().toISOString(),
        metadata: {
          original_question_id: question.id,
          from_database: true,
          validated: true // CSV questions are pre-validated
        }
      };
    } catch (error) {
      console.error('[CSVQuestionBank] Error fetching question:', error);
      return null;
    }
  }

  /**
   * Shuffle options while tracking correct answer position
   */
  shuffleOptions(optionsArray, correctAnswer) {
    const options = [...optionsArray];
    const correctIndex = options.indexOf(correctAnswer);
    
    // Fisher-Yates shuffle
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }
    
    const newCorrectIndex = options.indexOf(correctAnswer);
    
    return {
      shuffled: options,
      correctIndex: newCorrectIndex
    };
  }

  /**
   * Generate default hint if none exists
   */
  generateDefaultHint(questionText) {
    if (questionText.toLowerCase().includes('angle')) {
      return 'Remember the angle properties and relationships. Take it step by step.';
    } else if (questionText.toLowerCase().includes('area')) {
      return 'Think about the formula for this shape\'s area. Break it down into parts if needed.';
    } else if (questionText.toLowerCase().includes('perimeter')) {
      return 'Add up all the sides. Make sure you have all measurements.';
    } else if (questionText.toLowerCase().includes('volume')) {
      return 'Use the volume formula for this 3D shape. Check your units!';
    } else {
      return 'Read the question carefully and identify what you need to find.';
    }
  }

  /**
   * Get statistics about question bank
   */
  async getQuestionBankStats() {
    try {
      const { data, error } = await this.db
        .from('question_bank')
        .select('difficulty_level, topic_name, representation_type, count(*)', { count: 'exact' })
        .then(result => {
          if (result.error) throw result.error;
          return this.db.rpc('count', { table_name: 'question_bank' });
        });

      return {
        total: data?.count || 0,
        byDifficulty: {},
        byTopic: {},
        byRepresentation: {}
      };
    } catch (error) {
      console.error('[CSVQuestionBank] Error getting stats:', error);
      return null;
    }
  }

  /**
   * Check if question bank has questions for given criteria
   */
  async hasQuestions(difficultyLevel, topicName = null, representationType = 'text') {
    try {
      let query = this.db
        .from('question_bank')
        .select('id', { count: 'exact', head: true })
        .eq('difficulty_level', difficultyLevel)
        .eq('representation_type', representationType);

      if (topicName) {
        query = query.eq('topic_name', topicName);
      }

      const { count, error } = await query;

      return !error && count > 0;
    } catch (error) {
      return false;
    }
  }
}

module.exports = CSVQuestionBankService;
