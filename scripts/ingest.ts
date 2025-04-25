import 'dotenv/config'

console.log('OpenAI Key:', process.env.OPENAI_API_KEY)
console.log('Supabase URL:', process.env.SUPABASE_URL)
console.log('Supabase Key:', process.env.SUPABASE_SERVICE_KEY)

// const supabase = createClient(
//   process.env.SUPABASE_URL,
//   process.env.SUPABASE_KEY
// )