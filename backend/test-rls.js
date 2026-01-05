// Test if service_role key actually bypasses RLS
const supabase = require('./config/supabase');

async function testRLS() {
  console.log('Testing RLS bypass with service_role key...\n');
  
  // Test 1: Simple select
  console.log('Test 1: Simple select (topic_id only)');
  const { data: test1, error: err1 } = await supabase
    .from('user_topic_progress')
    .select('topic_id')
    .limit(5);
  console.log('Result:', test1?.length || 0, 'rows');
  if (err1) console.log('Error:', err1);
  
  // Test 2: Complex select with join
  console.log('\nTest 2: Complex select with join');
  const { data: test2, error: err2 } = await supabase
    .from('user_topic_progress')
    .select(`
      *,
      adaptive_learning_topics (
        id,
        topic_name
      )
    `)
    .limit(5);
  console.log('Result:', test2?.length || 0, 'rows');
  if (err2) console.log('Error:', err2);
  
  // Test 3: Count all rows (should work with service_role)
  console.log('\nTest 3: Count all rows');
  const { count, error: err3 } = await supabase
    .from('user_topic_progress')
    .select('*', { count: 'exact', head: true });
  console.log('Total rows:', count);
  if (err3) console.log('Error:', err3);
  
  process.exit(0);
}

testRLS().catch(console.error);
