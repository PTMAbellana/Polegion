const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_KEY

const supabase = createClient(supabaseUrl, supabaseKey)
console.log('supabase is called: ', supabase)

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