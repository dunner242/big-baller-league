const data:any={
'scores':['Week 12 Scoreboard','Every game, result and future matchup lives here.'],
'standings':['BBL Standings','Conference, division, streaks, point differential and playoff positioning.'],
'stats':['League Statistics','Passing, rushing, receiving, defense, kicking and advanced BBL metrics.'],
'teams':['BBL Teams','All 32 franchises with rosters, schedules, records, transactions and history.'],
'players':['Player Database','Career statistics, ratings, game logs, awards, fantasy output and news.'],
'news':['BBL Newsroom','Data-driven reporting, transactions, game reactions and continuing league storylines.'],
'power-rankings':['Power Rankings','Weekly team strength using results, recent form, scoring margin and schedule strength.'],
'awards':['Awards Race','MVP, OPOY, DPOY, rookies, All-BBL teams and historical winners.'],
'projections':['BBL Projections','Projected records, playoff chances, stat pace and championship model.'],
'fantasy':['BBL Fantasy','Standard, half-PPR and PPR scoring calculated directly from franchise statistics.'],
'history':['League History','A permanent timeline of championships, records, drafts, trades, awards and defining moments.']};
export default async function Section({params}:{params:Promise<{section:string}>}){const {section}=await params;const x=data[section]||['BBL','League intelligence'];return <main className="wrap"><section className="card"><div className="hero" style={{minHeight:220}}><div className="eyebrow">BIG BALLER LEAGUE</div><h1>{x[0]}</h1><p>{x[1]}</p></div><div className="pad"><h2>Connected to the BBL data model</h2><p>This section is wired into the application structure and will populate from your Madden 27 franchise imports once the database and live Companion endpoint are deployed.</p><div className="statgrid"><div className="metric"><span>Season</span><b>2036</b></div><div className="metric"><span>Week</span><b>12</b></div><div className="metric"><span>Data State</span><b>DEMO</b></div><div className="metric"><span>Engine</span><b>BBL</b></div></div></div></section></main>}