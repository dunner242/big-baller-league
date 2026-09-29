import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 3, ssl: { rejectUnauthorized: false } });

function detectType(payload:any){
  const s=JSON.stringify(payload).toLowerCase();
  if(s.includes('roster')||s.includes('playerroster')) return 'rosters';
  if(s.includes('weekly')||s.includes('passing')||s.includes('rushing')||s.includes('receiving')) return 'weekly_stats';
  if(s.includes('league')||s.includes('seasoninfo')) return 'league_info';
  return 'unknown';
}
function findNumber(obj:any, keys:string[]){
  if(!obj||typeof obj!=='object') return null;
  for(const k of keys){const v=obj[k];if(v!==undefined&&v!==null&&!Number.isNaN(Number(v))) return Number(v)}
  for(const v of Object.values(obj)){if(v&&typeof v==='object'){const found=findNumber(v,keys);if(found!==null)return found}}
  return null;
}
function findText(obj:any, keys:string[]){
  if(!obj||typeof obj!=='object') return null;
  for(const k of keys){const v=obj[k];if(typeof v==='string'&&v.length)return v}
  for(const v of Object.values(obj)){if(v&&typeof v==='object'){const found=findText(v,keys);if(found)return found}}
  return null;
}

export async function GET(){
  try{
    const db=await pool.query('select now() as now, count(*)::int as imports from madden_imports');
    return NextResponse.json({service:'BBL Madden Companion Import',status:'ready',database:'connected',imports:db.rows[0].imports,accepts:['POST']});
  }catch(e:any){return NextResponse.json({service:'BBL Madden Companion Import',status:'receiver-online',database:'error',detail:e?.message||'Database unavailable'},{status:503})}
}

export async function POST(req:NextRequest){
  try{
    const contentType=req.headers.get('content-type')||'';
    let payload:any;
    if(contentType.includes('application/json')) payload=await req.json();
    else {const text=await req.text();try{payload=JSON.parse(text)}catch{payload={raw:text}}}
    const importType=detectType(payload);
    const season=findNumber(payload,['season','seasonYear','calendarYear','year']);
    const week=findNumber(payload,['week','weekIndex','currentWeek','stageIndex']);
    const leagueId=findText(payload,['leagueId','leagueID','careerId','franchiseId']);
    const result=await pool.query(
      'insert into madden_imports(import_type,season,week,league_id,payload,processed) values($1,$2,$3,$4,$5::jsonb,false) returning id,received_at',
      [importType,season,week,leagueId,JSON.stringify(payload)]
    );
    await pool.query('update league_state set current_season=coalesce($1,current_season), current_week=coalesce($2,current_week), last_import_at=now() where id=1',[season,week]);
    console.log('BBL_MADDEN_STORED',{id:result.rows[0].id,importType,season,week});
    return NextResponse.json({ok:true,league:'Big Baller League',stored:true,importId:result.rows[0].id,importType,season,week,receivedAt:result.rows[0].received_at,message:'BBL permanently stored this Madden export.'});
  }catch(error:any){console.error('BBL_IMPORT_ERROR',error);return NextResponse.json({ok:false,stored:false,message:'BBL could not store this export.',detail:error?.message||'Unknown error'},{status:500})}
}
