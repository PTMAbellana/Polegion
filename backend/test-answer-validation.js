/**
 * Test Answer Validation
 * Validates that all question templates have correct answer keys
 */

const QuestionGeneratorService = require('./application/services/QuestionGeneratorService');

async function testAllQuestions() {
  const generator = new QuestionGeneratorService();
  
  console.log('🔍 Testing all question templates for answer correctness...\n');
  
  let totalQuestions = 0;
  let failedQuestions = [];
  
  for (let difficulty = 1; difficulty <= 5; difficulty++) {
    console.log(`\n📊 Testing Difficulty ${difficulty}:`);
    console.log('='.repeat(50));
    
    const templates = generator.templates[difficulty] || [];
    console.log(`Found ${templates.length} templates\n`);
    
    for (const template of templates) {
      totalQuestions++;
      
      try {
        // Generate parameters
        const params = generator.generateParameters(template.params || {});
        
        // Calculate solution
        const solution = template.solution(params);
        
        // Generate options
        let options = [];
        if (template.multipleChoice) {
          options = template.multipleChoice.map((label, idx) => ({
            label: label.toString(),
            correct: typeof solution === 'number' ? idx === solution : label.toString() === solution.toString()
          }));
        } else {
          const correctAnswer = generator.roundSolution(solution);
          const distractors = generator.generateDistractors(correctAnswer, template.type, params);
          options = [correctAnswer, ...distractors].map(val => ({
            label: `${val}`,
            correct: val === correctAnswer
          }));
        }
        
        // Validate
        const correctOptions = options.filter(opt => opt.correct);
        
        if (correctOptions.length !== 1) {
          failedQuestions.push({
            difficulty,
            type: template.type,
            template: template.template,
            error: `Found ${correctOptions.length} correct options (expected 1)`,
            options
          });
          console.log(`❌ ${template.type}: ${correctOptions.length} correct options`);
        } else {
          // For multipleChoice, verify the marked answer makes sense
          if (template.multipleChoice) {
            const solutionIndex = typeof solution === 'number' ? solution : template.multipleChoice.indexOf(solution);
            const expectedValue = template.multipleChoice[solutionIndex];
            const markedCorrect = correctOptions[0].label;
            
            if (expectedValue.toString() !== markedCorrect) {
              failedQuestions.push({
                difficulty,
                type: template.type,
                template: template.template,
                error: `Answer mismatch: expected "${expectedValue}" but "${markedCorrect}" is marked correct`,
                solution,
                solutionIndex,
                multipleChoice: template.multipleChoice,
                options
              });
              console.log(`❌ ${template.type}: Answer key mismatch`);
            } else {
              console.log(`✅ ${template.type}`);
            }
          } else {
            console.log(`✅ ${template.type}`);
          }
        }
        
      } catch (error) {
        failedQuestions.push({
          difficulty,
          type: template.type,
          template: template.template,
          error: error.message
        });
        console.log(`❌ ${template.type}: ${error.message}`);
      }
    }
  }
  
  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📈 TEST SUMMARY');
  console.log('='.repeat(50));
  console.log(`Total questions tested: ${totalQuestions}`);
  console.log(`Failed questions: ${failedQuestions.length}`);
  console.log(`Success rate: ${((totalQuestions - failedQuestions.length) / totalQuestions * 100).toFixed(1)}%`);
  
  if (failedQuestions.length > 0) {
    console.log('\n❌ FAILED QUESTIONS:');
    console.log('='.repeat(50));
    failedQuestions.forEach((fail, idx) => {
      console.log(`\n${idx + 1}. [Difficulty ${fail.difficulty}] ${fail.type}`);
      console.log(`   Template: ${fail.template}`);
      console.log(`   Error: ${fail.error}`);
      if (fail.options) {
        console.log(`   Options:`, fail.options.map(o => `${o.label} (${o.correct ? 'CORRECT' : 'wrong'})`));
      }
    });
  }
}

// Run test
testAllQuestions().catch(console.error);
