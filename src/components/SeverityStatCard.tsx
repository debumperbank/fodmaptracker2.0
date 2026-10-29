"use client";

import { useState } from "react";

type Period = "today" | "7d" | "30d";
type Stat = { average: number | null; count: number };

const labels: Record<Period, string> = { today: "Vandaag", "7d": "Laatste 7 dagen", "30d": "Laatste 30 dagen" };

export function SeverityStatCard({ stats }: { stats: Record<Period, Stat> }) {
 const [period,setPeriod]=useState<Period>("today");
 const [expanded,setExpanded]=useState(false);
 const current=stats[period];
 return <div className={`card stat severity-stat${expanded?" is-expanded":""}`}>
  <button className="severity-stat-summary" type="button" aria-expanded={expanded} aria-controls="severity-periods" onClick={()=>setExpanded(value=>!value)}>
   <span><span className="subtle severity-stat-label">Gem. ernst</span><span className="stat-number severity-stat-number">{current.average===null?"—":current.average}{current.average!==null&&<span> / 10</span>}</span><span className="subtle severity-stat-detail">{labels[period]} · {current.count} {current.count===1?"registratie":"registraties"}</span></span>
   <span className="severity-stat-chevron" aria-hidden="true">{expanded?"×":"⌄"}</span>
  </button>
  {expanded&&<div id="severity-periods" className="severity-periods" aria-label="Periode voor gemiddelde ernst">{(Object.keys(labels) as Period[]).map(value=><button key={value} type="button" className={period===value?"active":""} aria-pressed={period===value} onClick={()=>setPeriod(value)}>{labels[value]}</button>)}</div>}
 </div>;
}
