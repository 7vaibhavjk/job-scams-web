// src/components/TrendsPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import * as echarts from "echarts";
import ReactECharts from "echarts-for-react";
import { loadRecords, groupBy, sum, currency } from "../services/data";

/* ---------- theme ---------- */
const COLORS = { primary: "#012169", red: "#E4002B", gold: "#FFCD00" };
const GENDER_COLORS = { Female: "#2F55D4", Male: "#5FBF66", X: "#FFCD00", Unspecified: "#C9D3E2" };

/* ---------- utils ---------- */
const nfmt = (n) => Number(n || 0).toLocaleString();
const prettyMonth = (m) => {
  const [y, mm] = String(m).split("-");
  const names = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const mon = names[(+mm || 1) - 1] || m;
  return `${mon} ${String(y).slice(2)}`;
};

/* AU canonical names <-> codes */
const CANON = {
  "New South Wales": "NSW", Victoria: "VIC", Queensland: "QLD", "Western Australia": "WA",
  "South Australia": "SA", Tasmania: "TAS", "Northern Territory": "NT", "Australian Capital Territory": "ACT",
};
const CODE_TO_NAME = Object.fromEntries(Object.entries(CANON).map(([n,c]) => [c,n]));
function normalizeGeo(features){
  const KEYS = ["name","STATE_NAME","STATE_NAME_2016","st_name16","STATE","STATE_NM","STE_NAME16","STE_NAME21","STATE_NAME_2011"];
  features.forEach(f=>{
    const p=f.properties||{};
    let raw = KEYS.map(k=>p[k]).find(Boolean) ||
      (typeof p==="object"?Object.values(p).find(v=>typeof v==="string" && !v.toLowerCase().includes("australia") && v.length<=30):null);
    if(!raw) return;
    const cleaned=String(raw).replace(/\s*\(.*?\)/g,"").replace(/&/g,"and").trim();
    const alias={ "A.C.T.":"Australian Capital Territory", ACT:"Australian Capital Territory",
      WA:"Western Australia", SA:"South Australia", NSW:"New South Wales", VIC:"Victoria", QLD:"Queensland", NT:"Northern Territory", TAS:"Tasmania" };
    f.properties.name = alias[cleaned] || cleaned;
  });
}

/* ========================================================= */

export default function TrendsPage(){
  /* state */
  const [raw, setRaw] = useState([]);
  const [mode, setMode] = useState("guided");            // keep Guided first
  const [splashOpen, setSplashOpen] = useState(true);    // NEW: intro splash first
  const [wizardOpen, setWizardOpen] = useState(false);   // then wizard
  const [filters, setFilters] = useState({ year:"All", state:"All", contact:"All", gender:"All" });
  const [step, setStep] = useState(0);
  const [guidedStage, setGuidedStage] = useState(0);     // staged reveal
  const [auMapReady, setAuMapReady] = useState(false);
  const [genderMetric, setGenderMetric] = useState("loss");

  const ITEMS = 20;
  const [page, setPage] = useState(1);



  // closes splash/wizard and drops the user back into Explore
  const closeGuided = () => {
    setSplashOpen(false);
    setWizardOpen(false);
    setGuidedStage(0);
    setMode("explore");
  };


  useEffect(() => {
    if (!(splashOpen || wizardOpen)) return;
    const onKey = (e) => { if (e.key === "Escape") closeGuided(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [splashOpen, wizardOpen]);


  /* load data */
  useEffect(()=>{
    (async ()=>{
      try{
        const all = await loadRecords();
        setRaw(all.filter(r=>r.scam_type==="Jobs and employment scams"));
      }catch(e){ console.error(e); setRaw([]); }
    })();
  },[]);

  /* load map */
  useEffect(()=>{
    fetch("/maps/australia-states.geo.json")
      .then(r=>r.json())
      .then(geo=>{
        try{
          if(geo?.features) normalizeGeo(geo.features);
          echarts.registerMap("australia", geo);
          setAuMapReady(true);
        }catch(e){ console.error(e); setAuMapReady(false); }
      })
      .catch(e=>{ console.error(e); setAuMapReady(false); });
  },[]);

  /* options for steps */
  const yearsOpt    = useMemo(()=>["All", ...new Set(raw.map(r=>String(r.year)))].sort(), [raw]);
  const statesOpt   = useMemo(()=>["All", ...new Set(raw.map(r=>r.state_code))].sort(), [raw]);
  const contactsOpt = useMemo(()=>["All", ...new Set(raw.map(r=>r.contact_method))].sort(), [raw]);
  const gendersOpt  = useMemo(()=>["All", ...new Set(raw.map(r=>r.gender))].sort(), [raw]);

  const steps = [
    { key:"year",    emoji:"📆", title:"Which year do you want to explore?", options: yearsOpt,
      tip:"We’ll line up months so spikes are obvious." },
    { key:"state",   emoji:"🗺️", title:"Any state you want to focus on?", options: statesOpt,
      tip:"Useful if you’re job-hunting locally." },
    { key:"contact", emoji:"☎️", title:"How did scammers contact people?", options: contactsOpt,
      tip:"Fake job portals & DMs are common bait." },
    { key:"gender",  emoji:"🧑‍🤝‍🧑", title:"Want to filter by gender?", options: gendersOpt,
      tip:"Shows exposure patterns — not vulnerability." },
  ];


  // must be declared AFTER `steps`
  const chooseOption = React.useCallback(
    (val) => {
      const k = steps[step]?.key;
      if (!k) return;
      setFilters((f) => ({ ...f, [k]: val }));
      setStep((s) => Math.min(s + 1, steps.length - 1));
    },
    [step, steps]
  );


  /* finish wizard => staged reveal */
  useEffect(()=>{
    if(!wizardOpen && !splashOpen && mode==="guided"){
      setGuidedStage(1);
      const t1=setTimeout(()=>setGuidedStage(2), 900);
      const t2=setTimeout(()=>setGuidedStage(3), 1800);
      return ()=>{ clearTimeout(t1); clearTimeout(t2); };
    }
  },[wizardOpen, splashOpen, mode]);

  /* filter data */
  const data = useMemo(()=>raw.filter(r =>
    (filters.year==="All"    || String(r.year)===filters.year) &&
    (filters.state==="All"   || r.state_code===filters.state) &&
    (filters.contact==="All" || r.contact_method===filters.contact) &&
    (filters.gender==="All"  || r.gender===filters.gender)
  ),[raw, filters]);

  /* series */
  const monthly = useMemo(()=>{
    const g = groupBy(data, r=>r.month);
    return g.map(([month, rows])=>({
      month,
      loss:  sum(rows,r=>r.amount_lost_aud),
      count: sum(rows,r=>r.report_count)
    })).sort((a,b)=>a.month.localeCompare(b.month));
  },[data]);

  const byState = useMemo(()=>{
    const g = groupBy(data, r=>r.state_code);
    return g.map(([code, rows])=>({
      code, reports: sum(rows,r=>r.report_count), loss: sum(rows,r=>r.amount_lost_aud)
    })).sort((a,b)=>b.reports-a.reports).slice(0,8);
  },[data]);

  /* charts */
  const monthlyOpt = {
    tooltip: { trigger:"axis" },
    legend: { data:["Reports","Loss (AUD)"] },
    grid: { left:70, right:60, bottom:80, top:36 },
    xAxis: { type:"category", data: monthly.map(x=>x.month), axisLabel:{ formatter:v=>prettyMonth(v), rotate:20 } },
    yAxis: [
      { type:"value", name:"Loss (AUD)", axisLabel:{ formatter:v=>currency(v).replace(".00","") } },
      { type:"value", name:"Reports", position:"right" },
    ],
    dataZoom:[{type:"slider",height:22,bottom:12,brushSelect:false},{type:"inside"}],
    series:[
      { name:"Reports", type:"bar", yAxisIndex:1, itemStyle:{ color:COLORS.primary }, data: monthly.map(x=>x.count) },
      { name:"Loss (AUD)", type:"line", smooth:true, itemStyle:{ color:COLORS.red }, data: monthly.map(x=>x.loss) },
    ]
  };

  const mapAgg = useMemo(()=>{
    const m=new Map();
    data.forEach(r=>{
      const code=r.state_code||"Unspecified";
      const prev=m.get(code)||{reports:0,loss:0};
      prev.reports += r.report_count||0;
      prev.loss    += r.amount_lost_aud||0;
      m.set(code, prev);
    });
    const arr=[];
    for(const [code,v] of m){
      const name=CODE_TO_NAME[code];
      if(!name) continue;
      arr.push({name, value:v.reports, loss:v.loss, code});
    }
    return arr;
  },[data]);

  const auMapOption = {
    tooltip:{ trigger:"item",
      formatter:(p)=>{
        const name=p?.name??"Unknown";
        const v=Number(p?.data?.value??0);
        const loss=Number(p?.data?.loss??0);
        return [`<b>${name}</b>`,`Reports: ${Number.isFinite(v)?v.toLocaleString():"0"}`,`Loss: ${currency(Number.isFinite(loss)?loss:0)}`].join("<br/>");
      }
    },
    visualMap:{ left:10,bottom:10,text:["High","Low"], inRange:{ color:["#E6F0FF","#012169"] }, calculable:true },
    series:[{ name:"Reports", type:"map", map:"australia", nameProperty:"name", roam:true, emphasis:{label:{show:false}}, data:mapAgg }]
  };

  const genderAgg = useMemo(()=>{
    const g = groupBy(data, r=>r.gender || "Unspecified")
      .map(([k,rows])=>({ key:k, reports:sum(rows,r=>r.report_count), loss:sum(rows,r=>r.amount_lost_aud) }));
    const tR = g.reduce((a,b)=>a+b.reports,0)||1;
    const tL = g.reduce((a,b)=>a+b.loss,0)||1;
    return {
      loss:    g.map(x=>({ name:x.key, value:+((100*x.loss)/tL).toFixed(2) })),
      reports: g.map(x=>({ name:x.key, value:+((100*x.reports)/tR).toFixed(2) })),
      raw: g
    };
  },[data]);

  const genderOpt = {
    tooltip:{ trigger:"item", formatter:p=>`${p.name}: ${p.value}%` },
    legend:{ top:0,left:"center",icon:"circle", textStyle:{fontSize:12} },
    series:[{
      type:"pie", radius:["55%","76%"], center:["50%","62%"],
      label:{ formatter:"{b} {d}%" }, labelLine:{ length:14, length2:10 },
      itemStyle:{ borderColor:"#fff", borderWidth:2 },
      data: ["Female","Male","X","Unspecified"].map(n=>{
        const src=(genderMetric==="loss"?genderAgg.loss:genderAgg.reports).find(d=>d.name===n);
        return src ? {...src, itemStyle:{ color:GENDER_COLORS[n]||"#888" }} : null;
      }).filter(Boolean)
    }]
  };

  /* table bits */
  const totalPages = Math.ceil(data.length/ITEMS);
  const slice = data.slice((page-1)*ITEMS, (page-1)*ITEMS + ITEMS);

  /* richer insights */
  const insights = useMemo(()=>makeRicherInsights(data, monthly, byState),[data,monthly,byState]);
  const genderInsight = useMemo(()=>genderInsightFrom(genderAgg, genderMetric),[genderAgg, genderMetric]);

  /* map click -> set state filter safely */
  const onMapClick = (p)=>{
    const code=p?.data?.code;
    if(code) return setFilters(f=>({...f,state:code}));
    const nm=p?.name;
    if(!nm) return;
    const f=Object.entries(CANON).find(([n])=>n===nm);
    if(f) setFilters(x=>({...x,state:f[1]}));
  };

  /* hide KPIs while splash or wizard open */
  const showKPIs = !(mode==="guided" && (splashOpen || wizardOpen));

  return (
    <div id="trends-page" className="page active">
      <style>{baseCSS}</style>
      <div className="page-content-wrapper">
        <div style={{ padding: 24 }}>
          {/* Header */}
          <div style={{ marginBottom: 12 }}>
            <h2 style={{ margin:"0 0 8px 0", fontSize: 28, fontWeight: 800, color: "#012169" }}>Job Scam Analytics</h2>
            <p style={{ margin: 0, color: "#666", fontSize: 14 }}>Choose <b>Guided</b> for a quick tour, or <b>Explore</b> to jump straight in.</p>
          </div>

          {/* Mode toggle */}
          <div style={{ display:"flex", gap:10, marginBottom:16 }}>
            <Pill active={mode==="guided"} onClick={()=>{ setMode("guided"); setSplashOpen(true); setWizardOpen(false); setGuidedStage(0); }}>🧭 Guided</Pill>
            <Pill active={mode==="explore"} onClick={()=>{ setMode("explore"); setSplashOpen(false); setWizardOpen(false); }}>📊 Explore</Pill>
            <Pill active={mode==="table"}   onClick={()=>{ setMode("table"); setSplashOpen(false); setWizardOpen(false); }}>📋 Data Table</Pill>
          </div>

          {/* KPIs (hidden while splash/wizard) */}
          {showKPIs && (
            <div className="kpis">
              <KPI title="Total Loss" value={currency(sum(data,r=>r.amount_lost_aud))}/>
              <KPI title="Total Reports" value={nfmt(sum(data,r=>r.report_count))}/>
              <KPI title="Avg Loss/Report" value={
                data.length?currency(sum(data,r=>r.amount_lost_aud)/Math.max(1,sum(data,r=>r.report_count))):"$0"
              }/>
              <KPI title="Records" value={nfmt(data.length)}/>
            </div>
          )}

          {/* -------- GUIDED FLOW -------- */}
          {mode==="guided" && (
            <>
              {/* 0) INTRO SPLASH */}
              {splashOpen && <Splash onStart={() => { setSplashOpen(false); setWizardOpen(true); }} onClose={closeGuided} />}

              {wizardOpen && (
                <Wizard
                  step={step}
                  steps={steps}
                  filters={filters}
                  onChoose={chooseOption}
                  onBack={()=>setStep(s=>Math.max(0,s-1))}
                  onSkip={()=>setStep(s=>Math.min(s+1, steps.length-1))}
                  onReset={()=>{ setFilters({ year:"All", state:"All", contact:"All", gender:"All" }); setStep(0); }}
                  onFinish={()=>{ setWizardOpen(false); }}
                  onClose={closeGuided}          
                  
                />
              )}


              {/* 2) AFTER WIZARD: Reveal charts + narration */}
              {!splashOpen && !wizardOpen && (
                <>
                  {guidedStage>=1 && (
                    <RevealCard title="Monthly Job Scam Trends" note="Blue bars = reports. Red line = money lost." stage={1}>
                      <ReactECharts style={{ height: 520 }} option={monthlyOpt}/>
                      <Narration icon="🔎">
                        When the red line spikes but the bars stay low, that’s a handful of expensive scams rather than a flood.
                      </Narration>
                    </RevealCard>
                  )}

                  {guidedStage>=2 && (
                    <div className="grid2">
                      <RevealCard title="Gender Breakdown" stage={2}>
                        <div className="switcher">
                          <button className={`chip ${genderMetric==="loss"?"primary":""}`} onClick={()=>setGenderMetric("loss")}>Amount Lost</button>
                          <button className={`chip ${genderMetric==="reports"?"primary":""}`} onClick={()=>setGenderMetric("reports")}>Reports</button>
                        </div>
                        <ReactECharts style={{ height: 360 }} option={genderOpt}/>
                        <Narration icon="🧑‍🤝‍🧑">{genderInsight.text}</Narration>
                      </RevealCard>
                      <RevealCard title="Quick Insights" stage={2}>
                        <InsightsPanel insights={insights}/>
                      </RevealCard>
                    </div>
                  )}

                  {guidedStage>=3 && (
                    <RevealCard title="State Distribution (click a state to filter)" stage={3}>
                      {auMapReady ? (
                        <ReactECharts style={{ height: 560 }} option={auMapOption} onEvents={{ click:onMapClick }} notMerge/>
                      ) : (
                        <div style={{padding:16,color:"#666"}}>Loading map…</div>
                      )}
                      <Narration icon="🗺️">
                        Darker regions report more cases — that can mean population, busy job markets or simply better reporting.
                      </Narration>
                    </RevealCard>
                  )}
                </>
              )}
            </>
          )}

          {/* -------- EXPLORE -------- */}
          {mode==="explore" && (
            <>
              <div className="filters">
                <Select label="Year" value={filters.year} onChange={v=>setFilters(f=>({...f,year:v}))} options={yearsOpt}/>
                <Select label="State" value={filters.state} onChange={v=>setFilters(f=>({...f,state:v}))} options={statesOpt}/>
                <Select label="Contact" value={filters.contact} onChange={v=>setFilters(f=>({...f,contact:v}))} options={contactsOpt}/>
                <Select label="Gender" value={filters.gender} onChange={v=>setFilters(f=>({...f,gender:v}))} options={gendersOpt}/>
                <button className="chip" onClick={()=>setFilters({ year:"All", state:"All", contact:"All", gender:"All" })}>Clear</button>
              </div>

              <div className="grid2">
                <Card title="Monthly Job Scam Trends"><ReactECharts style={{ height:520 }} option={monthlyOpt}/></Card>
                <Card title="Quick Insights"><InsightsPanel insights={insights}/></Card>
              </div>

              <div className="grid2">
                <Card title="Gender Breakdown">
                  <div className="switcher">
                    <button className={`chip ${genderMetric==="loss"?"primary":""}`} onClick={()=>setGenderMetric("loss")}>Amount Lost</button>
                    <button className={`chip ${genderMetric==="reports"?"primary":""}`} onClick={()=>setGenderMetric("reports")}>Reports</button>
                  </div>
                  <ReactECharts style={{ height:360 }} option={genderOpt}/>
                </Card>
                <Card title="Map">
                  {auMapReady
                    ? <ReactECharts style={{ height:420 }} option={auMapOption} onEvents={{ click:onMapClick }} notMerge/>
                    : <div style={{padding:16,color:"#666"}}>Loading map…</div>}
                </Card>
              </div>
            </>
          )}

          {/* -------- TABLE -------- */}
          {mode==="table" && (
            <Card title={`Job Scam Data (${nfmt(data.length)} records)`}>
              <div style={{ overflowX:"auto", maxHeight:440, overflowY:"auto" }}>
                <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
                  <thead style={{ background:"#f8f9fa", position:"sticky", top:0 }}>
                    <tr>
                      <th style={th}>Month</th><th style={th}>State</th><th style={th}>Contact</th><th style={th}>Gender</th>
                      <th style={{...th,textAlign:"right"}}>Loss</th><th style={{...th,textAlign:"right"}}>Reports</th>
                    </tr>
                  </thead>
                  <tbody>
                    {slice.map((r,i)=>(
                      <tr key={i} style={{ borderBottom:"1px solid #eee" }}>
                        <td style={td}>{r.month?prettyMonth(r.month):"N/A"}</td>
                        <td style={td}>{r.state_code||"N/A"}</td>
                        <td style={td}>{r.contact_method||"N/A"}</td>
                        <td style={td}>{r.gender||"N/A"}</td>
                        <td style={{...td,textAlign:"right"}}>{currency(r.amount_lost_aud)}</td>
                        <td style={{...td,textAlign:"right"}}>{nfmt(r.report_count)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {data.length>ITEMS && (
                <div className="pager">
                  <span>Page {page} of {totalPages}</span>
                  <div>
                    <button disabled={page===1} onClick={()=>setPage(p=>Math.max(1,p-1))}>Prev</button>
                    <button disabled={page===totalPages} onClick={()=>setPage(p=>Math.min(totalPages,p+1))}>Next</button>
                  </div>
                </div>
              )}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- UI bits ---------- */

function KPI({ title, value }){
  return (
    <div className="kpi">
      <div className="kpi-title">{title}</div>
      <div className="kpi-value">{value}</div>
    </div>
  );
}

function Pill({ active, children, onClick }){
  return (
    <button className={`pill ${active?"active":""}`} onClick={onClick}>{children}</button>
  );
}

function Card({ title, children }){
  return (
    <div className="card">
      {title && <div className="card-title">{title}</div>}
      {children}
    </div>
  );
}

function Select({ label, value, onChange, options }){
  return (
    <label className="select">
      <span>{label}</span>
      <select value={value} onChange={(e)=>onChange(e.target.value)}>
        {options.map(o=> <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}

/* Insights (list) */
function InsightsPanel({ insights }){
  return (
    <div style={{ display:"grid", gap:12 }}>
      {insights.map(({icon, text},i)=>(
        <div key={i} className="insight">
          <div className="insight-emoji">{icon}</div>
          <div className="insight-text">{text}</div>
        </div>
      ))}
    </div>
  );
}

/* Splash overlay (NEW) */
function Splash({ onStart, onClose }) {
  return (
    <div className="splash-overlay">
      <div className="splash-card">
        <button className="closebtn" aria-label="Close" onClick={onClose}>×</button>
        <div className="splash-emoji">🛡️</div>
        <div className="splash-title">Let’s explore job-scam trends together</div>
        <ul className="splash-bullets">
          <li>Simple visuals. No jargon — just what matters.</li>
          <li>Learn common tricks before scammers try them on you.</li>
          <li>Tap through quick questions, then see the story unfold.</li>
        </ul>
        <button className="primary lg" onClick={onStart}>Let’s go</button>
      </div>
    </div>
  );
}

function Wizard({ step, steps, filters, onChoose, onBack, onSkip, onReset, onFinish, onClose }) {
  const s = steps[step];
  const isLast = step === steps.length - 1;

  return (
    <div className="wizard-overlay">
      <div className="wizard-card">
        <button className="closebtn" aria-label="Close" onClick={onClose}>×</button>
        <div className="wizard-top">
          <div className="wizard-emoji">{s.emoji}</div>
          <div>
            <div className="wizard-title">{s.title}</div>
            <div className="wizard-sub">{s.tip}</div>
          </div>
        </div>

        <div className="wizard-choices">
          {s.options.map(opt => {
            const active = filters[s.key] === opt;
            return (
              <button
                key={opt}
                type="button"
                className={`chip lift ${active ? "primary" : ""}`}
                onClick={() => onChoose(opt)}
                title={String(opt)}
              >
                {opt}
              </button>
            );
          })}
        </div>

        <div className="wizard-ctrls">
          <button className="ghost" onClick={onBack} disabled={step === 0}>← Back</button>
          <div style={{ flex: 1 }} />
          <button className="ghost" onClick={onReset}>Reset</button>
          <button className="ghost" onClick={onSkip} disabled={isLast}>Skip →</button>
          {isLast && <button className="primary" onClick={onFinish}>Show insights</button>}
        </div>

        <div className="dots">{steps.map((_, i) => <span key={i} className={`dot ${i <= step ? "on" : ""}`} />)}</div>
      </div>
    </div>
  );
}


/* Narration under charts */
function Narration({ icon, children }){
  return (
    <div className="narration"><span className="narr-emoji">{icon}</span><span>{children}</span></div>
  );
}

/* Reveal container with staged animation */
function RevealCard({ title, note, children, stage }){
  return (
    <div className={`card reveal reveal-${stage}`}>
      <div className="card-title">{title}</div>
      {note && <div className="note">{note}</div>}
      {children}
    </div>
  );
}

/* ---------- richer insight helpers ---------- */
function slope(arr){
  // simple last-3 slope on count
  if(arr.length<3) return 0;
  const a=arr.slice(-3).map(x=>x.count);
  return (a[2]-a[0])/Math.max(1,(a[0]+a[1]+a[2])/3);
}

function makeRicherInsights(data, monthly, byState){
  if(!data.length) return [{ icon:"🪄", text:"No records match your filters yet. Try widening them." }];

  // peak loss & count
  let peakLoss=null, peakCnt=null;
  monthly.forEach(m=>{ if(!peakLoss||m.loss>peakLoss.loss) peakLoss=m; if(!peakCnt||m.count>peakCnt.count) peakCnt=m; });

  // top state by LOSS (not just reports)
  const topLossState = [...byState].sort((a,b)=>b.loss-a.loss)[0];

  // top contact
  const byContact = groupBy(data, r=>r.contact_method)
    .map(([k, rows])=>({ k, n:sum(rows,r=>r.report_count), money:sum(rows,r=>r.amount_lost_aud) }))
    .sort((a,b)=>b.n-a.n);

  // direction and volatility
  const dir = slope(monthly);
  const rising = dir>0.12, falling = dir<-0.12;

  // loss per report
  const totalReports = sum(data, r=>r.report_count) || 1;
  const lpr = sum(data, r=>r.amount_lost_aud)/totalReports;

  const uniq = [];

  if(peakLoss) uniq.push({ icon:"💸", text:`Biggest money hit in ${prettyMonth(peakLoss.month)} (~${currency(peakLoss.loss)}). Beware “pay a fee first” or reimbursement traps.`});
  if(peakCnt)  uniq.push({ icon:"📈", text:`Most reports in ${prettyMonth(peakCnt.month)} (~${nfmt(peakCnt.count)}). Scammers copy real listings during busy hiring waves.`});
  if(topLossState) uniq.push({ icon:"🗺️", text:`Highest total loss in ${topLossState.code} (~${currency(topLossState.loss)}). Big markets attract sophisticated scams.`});
  if(byContact[0]) uniq.push({ icon:"☎️", text:`Top contact channel: ${byContact[0].k} (~${nfmt(byContact[0].n)} reports). Treat links asking for IDs or fees as red flags.`});
  if(rising)  uniq.push({ icon:"⚠️", text:`Recent reports are trending up. Double-check employers and avoid off-platform chats.`});
  if(falling) uniq.push({ icon:"✅", text:`Reports are easing in the last few months — still stay alert for copy-paste job ads.`});
  uniq.push({ icon:"🧮", text:`Average loss per report is around ${currency(lpr)}. Small “admin fees” add up — never pay to apply.`});

  // return 3–4 best
  return uniq.slice(0,4);
}

function genderInsightFrom(gAgg, metric){
  const src = metric==="loss" ? gAgg.loss : gAgg.reports;
  if(!src?.length) return { icon:"🧑‍🤝‍🧑", text:"No gender breakdown available for the current selection." };
  const sorted=[...src].sort((a,b)=>b.value-a.value);
  const top=sorted[0]; const pct=top?.value??0;
  const label = metric==="loss" ? "total loss" : "reported cases";
  return { icon:"🧑‍🤝‍🧑", text:`${top.name} accounts for ~${pct}% of ${label}. Often reflects exposure (industry mix & application volume), not vulnerability.` };
}

/* ---------- styles ---------- */
const th = { padding:"8px", textAlign:"left", borderBottom:"1px solid #dee2e6" };
const td = { padding:"8px" };

const baseCSS = `
.kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:16px}
.kpi{padding:16px;border-radius:12px;background:#fff;box-shadow:0 2px 8px rgba(0,0,0,.08)}
.kpi-title{font-size:12px;opacity:.7}
.kpi-value{font-size:24px;font-weight:700}
.pill{padding:8px 14px;border:2px solid #012169;background:transparent;color:#012169;border-radius:20px;font-weight:700}
.pill.active{background:#012169;color:#fff}
.card{padding:16px;border-radius:14px;background:#fff;box-shadow:0 8px 28px rgba(1,33,105,.08);margin-bottom:16px}
.card-title{font-weight:800;margin-bottom:8px}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.filters{display:flex;flex-wrap:wrap;gap:12px;margin-bottom:16px}
.select{display:flex;gap:8px;align-items:center}
.select span{font-size:12px}
.chip{padding:10px 14px;border-radius:999px;border:1px solid #cfd7ea;background:#fff;color:#012169;font-weight:700;cursor:pointer;transition:transform .12s ease, box-shadow .12s ease, background .12s ease}
.chip.primary{background:#012169;color:#fff;border-color:#012169;box-shadow:0 6px 18px rgba(1,33,105,.25)}
.chip.lift:hover{transform:translateY(-2px) scale(1.03);box-shadow:0 10px 28px rgba(1,33,105,.20);background:#f7faff}
.switcher{display:flex;gap:8px;margin-bottom:8px}
.insight{display:flex;gap:10px;align-items:flex-start;padding:10px;border-radius:12px;background:#f9fbff;border:1px solid #e7eef9}
.insight-emoji{font-size:20px}
.note{color:#5b6b86;margin:-6px 0 8px 0;font-size:12px}

/* Splash (intro) */
.splash-overlay{position:fixed;inset:0;background:rgba(2,20,56,.56);backdrop-filter:blur(2px);display:flex;align-items:center;justify-content:center;z-index:999}
@keyframes pop{0%{opacity:0;transform:translateY(10px) scale(.98)}100%{opacity:1;transform:translateY(0) scale(1)}}
.splash-card{width:min(760px,92vw);background:#fff;border-radius:18px;box-shadow:0 26px 90px rgba(0,0,0,.25);padding:22px 22px 18px;animation:pop .25s ease;text-align:center}
.splash-emoji{font-size:40px;margin-bottom:6px}
.splash-title{font-weight:900;font-size:22px;color:#0B2A6B;margin-bottom:10px}
.splash-bullets{list-style:none;padding:0;margin:0 0 16px 0;color:#3A516F}
.splash-bullets li{margin:6px 0}
.primary.lg{padding:10px 18px;border-radius:12px;font-weight:800}

/* Wizard */
.wizard-overlay{position:fixed;inset:0;background:rgba(2,20,56,.56);backdrop-filter:blur(2px);display:flex;align-items:center;justify-content:center;z-index:999}
.wizard-card{width:min(860px,92vw);background:#fff;border-radius:16px;box-shadow:0 24px 80px rgba(0,0,0,.25);padding:18px;animation:pop .25s ease}
.wizard-top{display:flex;gap:12px;align-items:center;margin-bottom:10px}
.wizard-emoji{font-size:32px}
.wizard-title{font-weight:900;font-size:20px;color:#0B2A6B}
.wizard-sub{color:#3A516F}
.wizard-choices{display:flex;flex-wrap:wrap;gap:10px;margin:14px 0}
.wizard-ctrls{display:flex;gap:10px;align-items:center;margin-top:4px}
.ghost{background:#fff;border:1px solid #cfd7ea;border-radius:10px;padding:8px 12px}
.primary{background:#012169;border:1px solid #012169;color:#fff;border-radius:10px;padding:8px 12px}
.dots{display:flex;gap:6px;justify-content:center;margin-top:10px}
.dot{width:8px;height:8px;border-radius:50%;background:#cfd7ea}
.dot.on{background:#012169}

/* reveal stages */
@keyframes floatIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
.reveal{animation:floatIn .35s ease both}
.reveal-1{animation-delay:.05s}.reveal-2{animation-delay:.15s}.reveal-3{animation-delay:.25s}

.narration{margin-top:10px;padding:10px 12px;border-radius:12px;background:#f6f9ff;border:1px solid #e6eefb;color:#2e415f;display:flex;gap:8px;align-items:flex-start}
.narr-emoji{font-size:18px}

.pager{display:flex;justify-content:space-between;align-items:center;margin-top:12px}
.pager button{padding:6px 10px}

.closebtn{
  position:absolute; top:10px; right:10px;
  width:32px; height:32px; border-radius:8px;
  border:1px solid #e2e8f4; background:#fff; color:#0b2a6b;
  font-size:20px; line-height:28px; text-align:center; cursor:pointer;
  transition:all .12s ease;
}
.closebtn:hover{ transform:translateY(-1px); box-shadow:0 6px 18px rgba(1,33,105,.18); }
.splash-card, .wizard-card{ position:relative; }


`;


