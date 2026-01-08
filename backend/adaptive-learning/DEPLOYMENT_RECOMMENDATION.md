# Deployment Strategy — Concrete Recommendation

## Recommended Stack
- **Frontend**: Next.js on Vercel (stable, fast).
- **Backend**: Node/Express on Railway (autoscaling, persistent processes). Fly.io is a strong alternative.
- **Database**: Supabase/Postgres (RLS, migrations already defined).
- **AI APIs**: Groq (primary), Gemini fallback; enforce rate limits and caching.
- **Logging/Research**: Persist to Supabase: `adaptive_state_transitions`, Q-table snapshots, hint usage; add export endpoints.

## Platform Comparison (brief)
- **Vercel**: Ideal for Next.js; serverless APIs possible, but keep adaptive backend on Railway for consistent long-lived state.
- **Railway**: Simple deployments; autoscaling suitable for 30–100 concurrent students; good env management.
- **Fly.io**: Global placement and performance; slightly higher ops overhead.
- **Render**: Easy but slower cold starts; fewer scaling controls.
- **AWS**: Only if institution mandates; highest operational burden.

## Environment and Scaling Considerations
- Configure: `SUPABASE_URL`, `SUPABASE_KEY`, `GROQ_API_KEY`, `HINT_AI_PROVIDER`, `AI_MODEL`.
- Monitor: request rates, DB latency, hint usage, transition volume.
- Scale: Railway service instances and DB connection pool; enable per-topic cache where safe.

## Quick Setup Commands
```bash
# Frontend (Vercel)
npm install
vercel deploy

# Backend (Railway)
npm install
railway up
railway variables set SUPABASE_URL=... SUPABASE_KEY=... GROQ_API_KEY=... HINT_AI_PROVIDER=groq

# Database (Supabase)
supabase db push
```

## Rationale
- Balances stability, cost, and speed; minimizes ops work while supporting research logging and AI usage at modest scale.
