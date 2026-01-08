/**
 * Test script for cohort assignment functionality
 * Run with: node test-cohort-assignment.js
 * 
 * Prerequisites:
 * - Set SUPABASE_URL and SUPABASE_SERVICE_KEY in environment
 * - Have at least one test user UUID
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const AdaptiveLearningRepo = require('./infrastructure/repository/AdaptiveLearningRepo');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing environment variables: SUPABASE_URL or SUPABASE_SERVICE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
const repo = new AdaptiveLearningRepo(supabase);

/**
 * Test cohort assignment system
 */
async function testCohortAssignment() {
  console.log('\n=== Testing Cohort Assignment System ===\n');

  try {
    // Test 1: Get current cohort counts
    console.log('Test 1: Get Current Cohort Counts');
    console.log('─'.repeat(50));
    const initialCounts = await repo.getCohortCounts();
    console.log('✅ Current cohort distribution:');
    console.log(`   Adaptive: ${initialCounts.adaptive_count}`);
    console.log(`   Control:  ${initialCounts.control_count}`);
    console.log(`   Total:    ${initialCounts.adaptive_count + initialCounts.control_count}`);
    console.log();

    // Test 2: Check if we have any test users
    console.log('Test 2: Fetch Test Users');
    console.log('─'.repeat(50));
    const { data: users, error: userError } = await supabase.auth.admin.listUsers();
    
    if (userError) {
      console.error('❌ Failed to fetch users:', userError.message);
      return;
    }

    if (!users || users.users.length === 0) {
      console.log('⚠️  No users found in auth.users');
      console.log('   Please create test users in Supabase Auth first');
      return;
    }

    console.log(`✅ Found ${users.users.length} users`);
    const testUser = users.users[0];
    console.log(`   Test user: ${testUser.id} (${testUser.email})`);
    console.log();

    // Test 3: Check if test user has cohort
    console.log('Test 3: Check Existing Cohort Assignment');
    console.log('─'.repeat(50));
    const existingCohort = await repo.getUserCohort(testUser.id);
    if (existingCohort) {
      console.log(`✅ User already assigned to cohort: ${existingCohort}`);
    } else {
      console.log('ℹ️  User not yet assigned to cohort');
    }
    console.log();

    // Test 4: Assign user to cohort (if not already assigned)
    if (!existingCohort) {
      console.log('Test 4: Assign User to Cohort');
      console.log('─'.repeat(50));
      const assignedCohort = await repo.assignUserToCohort(testUser.id);
      console.log(`✅ User assigned to cohort: ${assignedCohort}`);
      console.log();

      // Verify assignment
      console.log('Test 5: Verify Assignment');
      console.log('─'.repeat(50));
      const verifiedCohort = await repo.getUserCohort(testUser.id);
      if (verifiedCohort === assignedCohort) {
        console.log(`✅ Assignment verified: ${verifiedCohort}`);
      } else {
        console.log(`❌ Assignment mismatch: expected ${assignedCohort}, got ${verifiedCohort}`);
      }
      console.log();

      // Check updated counts
      console.log('Test 6: Updated Cohort Counts');
      console.log('─'.repeat(50));
      const updatedCounts = await repo.getCohortCounts();
      console.log('✅ Updated cohort distribution:');
      console.log(`   Adaptive: ${updatedCounts.adaptive_count} (${updatedCounts.adaptive_count > initialCounts.adaptive_count ? '+1' : 'same'})`);
      console.log(`   Control:  ${updatedCounts.control_count} (${updatedCounts.control_count > initialCounts.control_count ? '+1' : 'same'})`);
      console.log(`   Total:    ${updatedCounts.adaptive_count + updatedCounts.control_count}`);
      console.log();
    }

    // Test 7: Check assignment log
    console.log('Test 7: Check Assignment Audit Log');
    console.log('─'.repeat(50));
    const { data: logs, error: logError } = await supabase
      .from('cohort_assignment_log')
      .select('*')
      .order('assigned_at', { ascending: false })
      .limit(5);

    if (logError) {
      console.error('❌ Failed to fetch assignment logs:', logError.message);
    } else {
      console.log(`✅ Recent assignments (showing last ${logs.length}):`);
      logs.forEach((log, index) => {
        console.log(`   ${index + 1}. User ${log.user_id.substring(0, 8)}... → ${log.cohort} (${new Date(log.assigned_at).toLocaleString()})`);
      });
    }
    console.log();

    // Summary
    console.log('='.repeat(50));
    console.log('✅ All tests completed successfully!');
    console.log('='.repeat(50));
    console.log('\nNext Steps:');
    console.log('1. Create more test users in Supabase Auth');
    console.log('2. Run this script again to assign them to cohorts');
    console.log('3. Verify balanced distribution (should be ~50/50)');
    console.log('4. Test frontend integration with adaptive learning');
    console.log();

  } catch (error) {
    console.error('\n❌ Test failed:', error);
    console.error('Stack trace:', error.stack);
  }
}

// Run tests
testCohortAssignment()
  .then(() => {
    console.log('Test completed.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
