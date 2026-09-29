# Big Baller League (BBL)

A persistent sports-media universe for Madden 27 Franchise. BBL is designed to ingest Companion exports, preserve every week, calculate analytics, and turn franchise data into a professional league website.

## Included foundation
- Original BBL sports-network UI and branding
- Scores, standings, stats, teams, players, news, power rankings, awards, projections, fantasy and history routes
- Madden Companion POST receiver at `/api/companion/[token]`
- PostgreSQL/Prisma schema for leagues, seasons, weeks, games, players, stats, snapshots, transactions, articles, awards and team-history events
- Permanent snapshot architecture so advancing the franchise does not erase BBL history
- Fields for power scores, playoff probabilities, championship probabilities and PPR fantasy scoring
- Import Center with export workflow and health states

## Local setup
1. Install Node.js 20+
2. `npm install`
3. Create `.env` with `DATABASE_URL="postgresql://..."`
4. `npx prisma generate`
5. `npx prisma db push`
6. `npm run dev`

## Deployment
Recommended: Vercel for the Next.js app and Neon/Supabase/Vercel Postgres for PostgreSQL. Once deployed, use `https://YOUR-DOMAIN/api/companion/YOUR_SECRET_TOKEN` as the Madden Companion export destination.

## Roadmap
The next implementation pass will normalize real Madden 27 payload samples, calculate week-over-week transactions, generate rankings/projections, add playoff simulation, build team/player history timelines, and generate BBL newsroom events from imported facts.

BBL model probabilities are fictional simulation outputs for the franchise universe, not real-world sportsbook odds.
