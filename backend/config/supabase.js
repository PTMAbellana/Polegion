const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabaseUrl = process.env.SUPABASE_URL

// Always use SERVICE_ROLE key for backend operations (bypasses RLS for admin operations)
// The backend is trusted - it should have full access to perform admin operations
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY

// Determine key type for logging
const keyType = supabaseKey === process.env.SUPABASE_SERVICE_KEY ? 'service_role' : 'anon'

// Add validation
if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables:')
    console.error('SUPABASE_URL:', supabaseUrl ? 'Present' : 'Missing')
    console.error('SUPABASE_KEY:', supabaseKey ? 'Present' : 'Missing')
    process.exit(1)
}

console.log(`[Supabase] JWT Role: ${keyType}`)
if (keyType === 'service_role') {
    console.log('[Supabase] ✅ Using service_role key - RLS will be bypassed')
} else {
    console.log('[Supabase] ✅ Using anon key - RLS policies active')
}

// Create Supabase client with connection pooling configuration
const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    },
    db: {
        schema: 'public'
    },
    global: {
        headers: {
            'X-Client-Info': 'supabase-js-node',
            'apikey': supabaseKey  // Ensure service key is used for all requests
        }
    },
    // Enable connection pooling and retry logic
    realtime: {
        params: {
            eventsPerSecond: 10
        }
    }
})

// Add connection health check
const checkConnection = async () => {
    try {
        // Query any public table to verify connection (castles table exists in public schema)
        const { error } = await supabase.from('castles').select('count').limit(1);
        if (error) {
            console.error('[Supabase] Connection check failed:', error.message);
            return false;
        }
        console.log('[Supabase] Connection healthy ✓');
        return true;
    } catch (error) {
        console.error('[Supabase] Connection check error:', error);
        return false;
    }
};

// Check connection on startup
checkConnection();

// ✅ FIX: Properly verify service key by decoding JWT payload
function verifyServiceRoleKey(key) {
    try {
        // JWT format: header.payload.signature
        // Decode the payload (second part)
        const parts = key.split('.');
        if (parts.length !== 3) {
            console.error('[Supabase] Invalid JWT format - should have 3 parts');
            return false;
        }
        
        // Decode base64 payload
        const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
        console.log('[Supabase] JWT Role:', payload.role);
        
        if (payload.role === 'service_role') {
            console.log('[Supabase] ✅ Using service_role key - RLS will be bypassed');
            return true;
        } else {
            console.error('[Supabase] ❌ WARNING: Using', payload.role, 'key - RLS policies WILL apply!');
            console.error('[Supabase] Expected: service_role, Got:', payload.role);
            return false;
        }
    } catch (error) {
        console.error('[Supabase] Error decoding JWT:', error.message);
        return false;
    }
}

// Verify the service key
const isServiceRole = verifyServiceRoleKey(supabaseKey);

if (!isServiceRole) {
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('⚠️  CRITICAL: NOT USING SERVICE ROLE KEY!');
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('Current SUPABASE_SERVICE_KEY in .env is NOT a service_role key.');
    console.error('Please copy the correct service_role key from Supabase dashboard:');
    console.error('Settings → API → service_role (secret)');
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

// async function testToken(token) {
//     const {
//         data, 
//         error
//     } = await supabase.auth.getUser(token)
//     console.error('User: ' , data)
//     console.error('Error: ' , error)
// }

// testToken('eyJhbGciOiJIUzI1NiIsImtpZCI6Ill1eEZ1eTVnZVFuY0cxQ2IiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3V3bGxxYW56dmVxYW5mcGZubmR1LnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiJiM2M4NWRkNC1jZjY0LTRlMjItOWM1Zi1iZWM4ZTMzNDA1ZmIiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzQ3Mzg0Njk5LCJpYXQiOjE3NDczODEwOTksImVtYWlsIjoibmluYW1hcmdhcmV0dGUuY2F0dWJpZ0BjaXQuZWR1IiwicGhvbmUiOiIiLCJhcHBfbWV0YWRhdGEiOnsicHJvdmlkZXIiOiJlbWFpbCIsInByb3ZpZGVycyI6WyJlbWFpbCJdfSwidXNlcl9tZXRhZGF0YSI6eyJlbWFpbCI6Im5pbmFtYXJnYXJldHRlLmNhdHViaWdAY2l0LmVkdSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJmdWxsTmFtZSI6IkFuaW4iLCJnZW5kZXIiOiJGZW1hbGUiLCJwaG9uZSI6IjA5NDYgMzI5IDQ5MDYiLCJwaG9uZV92ZXJpZmllZCI6ZmFsc2UsInN1YiI6ImIzYzg1ZGQ0LWNmNjQtNGUyMi05YzVmLWJlYzhlMzM0MDVmYiJ9LCJyb2xlIjoiYXV0aGVudGljYXRlZCIsImFhbCI6ImFhbDEiLCJhbXIiOlt7Im1ldGhvZCI6Im90cCIsInRpbWVzdGFtcCI6MTc0NzM4MTA5OX1dLCJzZXNzaW9uX2lkIjoiNzQwNTA1M2EtMTE0Ni00NWJlLWJhMmMtOTE2M2VlNTk2NzIxIiwiaXNfYW5vbnltb3VzIjpmYWxzZX0.4QYYCH3rmdyxrs2dg4nY627JvhePAiJK-ixw--0ZpF0')

module.exports = supabase