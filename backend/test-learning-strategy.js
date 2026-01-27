/**
 * Test Script: Learning Strategy Random Assignment
 * 
 * This script tests if the User model correctly assigns random learning strategies
 * to students with a 50/50 split between 'rulebased' and 'qlearning'
 */

const User = require('./domain/models/auth/User');

console.log('🧪 Testing Learning Strategy Random Assignment\n');
console.log('=' .repeat(70));

// Test 1: Teacher should NOT get a learning strategy
console.log('\n📋 Test 1: Teacher Account (should get NULL)');
const teacherInput = {
    firstName: 'Jane',
    lastName: 'Teacher',
    gender: 'female',
    phone: '09123456789',
    role: 'teacher'
};
const teacher = User.fromInputUser(teacherInput, 'teacher-id-123', 'jane@teacher.com');
console.log(`✓ Teacher learning_strategy: ${teacher.learning_strategy}`);
console.log(`  Expected: null, Got: ${teacher.learning_strategy === null ? 'null ✅' : teacher.learning_strategy + ' ❌'}`);

// Test 2: Create 100 student accounts and check distribution
console.log('\n📋 Test 2: Student Accounts (100 samples for 50/50 distribution)');
let rulebasedCount = 0;
let qlearningCount = 0;

for (let i = 1; i <= 100; i++) {
    const studentInput = {
        firstName: `Student${i}`,
        lastName: 'Test',
        gender: 'others',
        phone: '09123456789',
        role: 'student'
    };
    
    const student = User.fromInputUser(studentInput, `student-id-${i}`, `student${i}@test.com`);
    
    if (student.learning_strategy === 'rulebased') {
        rulebasedCount++;
    } else if (student.learning_strategy === 'qlearning') {
        qlearningCount++;
    }
    
    // Show first 10 assignments
    if (i <= 10) {
        console.log(`  Student ${i}: ${student.learning_strategy}`);
    }
}

console.log('\n📊 Distribution Results:');
console.log(`  Rule-Based: ${rulebasedCount} (${rulebasedCount}%)`);
console.log(`  Q-Learning: ${qlearningCount} (${qlearningCount}%)`);
console.log(`  Total: ${rulebasedCount + qlearningCount}`);

// Check if distribution is reasonable (40-60% for each)
const rulebasedPercent = rulebasedCount;
const qlearningPercent = qlearningCount;
const isBalanced = rulebasedPercent >= 40 && rulebasedPercent <= 60 && 
                   qlearningPercent >= 40 && qlearningPercent <= 60;

if (isBalanced) {
    console.log(`\n✅ Distribution is balanced (within 40-60% range)`);
} else {
    console.log(`\n⚠️  Distribution seems unbalanced (expected 40-60% each)`);
}

// Test 3: Verify User model structure includes all fields
console.log('\n📋 Test 3: User Model Structure');
const sampleStudent = User.fromInputUser({
    firstName: 'Sample',
    lastName: 'Student',
    gender: 'male',
    phone: '09123456789',
    role: 'student',
    middle_initial: 'A.'
}, 'sample-id', 'sample@test.com');

console.log('  User Object Properties:');
console.log(`    ✓ id: ${sampleStudent.id}`);
console.log(`    ✓ firstName: ${sampleStudent.firstName}`);
console.log(`    ✓ lastName: ${sampleStudent.lastName}`);
console.log(`    ✓ middle_initial: ${sampleStudent.middle_initial}`);
console.log(`    ✓ gender: ${sampleStudent.gender}`);
console.log(`    ✓ phone: ${sampleStudent.phone}`);
console.log(`    ✓ role: ${sampleStudent.role}`);
console.log(`    ✓ email: ${sampleStudent.email}`);
console.log(`    ✓ learning_strategy: ${sampleStudent.learning_strategy}`);
console.log(`    ✓ profile_pic: ${sampleStudent.profile_pic ? 'Set' : 'Not Set'}`);

// Test 4: Test toDTO and toJSON methods
console.log('\n📋 Test 4: DTO/JSON Serialization');
const dto = sampleStudent.toDTO();
const json = sampleStudent.toJSON();
const userJSON = sampleStudent.addUsertoJSON();

console.log('  DTO includes learning_strategy:', 'learning_strategy' in dto ? '✅' : '❌');
console.log('  toJSON includes learning_strategy:', 'learning_strategy' in json ? '✅' : '❌');
console.log('  addUsertoJSON includes learning_strategy:', 'learning_strategy' in userJSON ? '✅' : '❌');
console.log('  DTO includes middle_initial:', 'middle_initial' in dto ? '✅' : '❌');
console.log('  toJSON includes middle_initial:', 'middle_initial' in json ? '✅' : '❌');
console.log('  addUsertoJSON includes middle_initial:', 'middle_initial' in userJSON ? '✅' : '❌');

console.log('\n' + '='.repeat(70));
console.log('🎉 All Tests Complete!\n');
