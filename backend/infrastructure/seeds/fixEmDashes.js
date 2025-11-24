// Fix em dashes in all assessment question files
const fs = require('fs');
const path = require('path');

const files = [
  'knowledgeRecall.js',
  'conceptUnderstanding.js',
  'proceduralSkills.js',
  'analyticalThinking.js',
  'problemSolving.js',
  'higherOrderThinking.js'
];

const dir = path.join(__dirname, 'assessmentQuestions');

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace em dash with regular text
  content = content.replace(/—/g, '');
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Fixed ${file}`);
});

console.log('\n🎉 All files fixed!');
console.log('Run: node infrastructure/seeds/generateAssessmentSQL.js');
