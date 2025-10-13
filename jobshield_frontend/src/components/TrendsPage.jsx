// src/components/TrendsPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import * as echarts from "echarts";
import ReactECharts from "echarts-for-react";
import { loadRecords, groupBy, sum, currency } from "../services/data";

const COLORS = { primary: "#012169", red: "#E4002B", gold: "#FFCD00" };
const GENDER_COLORS = {
  Female: "#2F55D4",
  Male: "#5FBF66",
  X: "#FFCD00",
  Unspecified: "#C9D3E2",
};

function prettyMonth(m) {
  const [y, mm] = String(m).split("-");
  const names = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const mon = names[(+mm || 1) - 1] || m;
  return `${mon} ${String(y).slice(2)}`;
}

// Canonical AU names <-> codes
const CANON = {
  "New South Wales": "NSW",
  "Victoria": "VIC",
  "Queensland": "QLD",
  "Western Australia": "WA",
  "South Australia": "SA",
  "Tasmania": "TAS",
  "Northern Territory": "NT",
  "Australian Capital Territory": "ACT",
};
const CODE_TO_NAME = Object.fromEntries(Object.entries(CANON).map(([n,c]) => [c,n]));

// Normalize feature names for the map
function normalizeGeo(features) {
  const NAME_KEYS = [
    "name","STATE_NAME","STATE_NAME_2016","st_name16","STATE","STATE_NM",
    "STE_NAME16","STE_NAME21","STATE_NAME_2011"
  ];
  features.forEach(f => {
    const p = f.properties || {};
    let raw =
      NAME_KEYS.map(k => p[k]).find(Boolean) ||
      (typeof p === "object"
        ? Object.values(p).find(v => typeof v === "string" && !v.toLowerCase().includes("australia") && v.length <= 30)
        : null);
    if (!raw) return;
    const cleaned = String(raw).replace(/\s*\(.*?\)/g,"").replace(/&/g,"and").trim();
    const alias = {
      "A.C.T.": "Australian Capital Territory",
      ACT: "Australian Capital Territory",
      WA: "Western Australia", SA: "South Australia", NSW: "New South Wales",
      VIC: "Victoria", QLD: "Queensland", NT: "Northern Territory", TAS: "Tasmania",
    };
    f.properties.name = alias[cleaned] || cleaned; // ECharts reads "name"
  });
}

export default function TrendsPage() {
  const [raw, setRaw] = useState([]);
  const [mode, setMode] = useState("explore"); // guided | explore | table
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [genderMetric, setGenderMetric] = useState("loss"); // 'loss' | 'reports'
  const [filters, setFilters] = useState({ year:"All", state:"All", contact:"All", gender:"All" });
  const [stepIdx, setStepIdx] = useState(0);
  const [auMapReady, setAuMapReady] = useState(false);

  const ITEMS_PER_PAGE = 20;

  // Load data
  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const allRecords = await loadRecords();
        const jobScams = allRecords.filter(r => r.scam_type === "Jobs and employment scams");
        setRaw(jobScams);
      } catch (e) {
        console.error("Error loading data:", e);
        setRaw([]);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // Load AU map
  useEffect(() => {
    fetch("/maps/australia-states.geo.json")
      .then(r => r.json())
      .then(geo => {
        try {
          if (geo && geo.features) normalizeGeo(geo.features);
          echarts.registerMap("australia", geo);
          setAuMapReady(true);
        } catch (e) {
          console.error("AU map parse/register failed:", e);
          setAuMapReady(false);
        }
      })
      .catch(e => { console.error("AU map load failed:", e); setAuMapReady(false); });
  }, []);

  // Filtered data
  const data = useMemo(
    () => raw.filter(r =>
      (filters.year === "All" || String(r.year) === filters.year) &&
      (filters.state === "All" || r.state_code === filters.state) &&
      (filters.contact === "All" || r.contact_method === filters.contact) &&
      (filters.gender === "All" || r.gender === filters.gender)
    ),
    [raw, filters]
  );

  // Options
  const years    = useMemo(() => ["All", ...new Set(raw.map(r => String(r.year)))].sort(), [raw]);
  const states   = useMemo(() => ["All", ...new Set(raw.map(r => r.state_code))].sort(), [raw]);
  const contacts = useMemo(() => ["All", ...new Set(raw.map(r => r.contact_method))].sort(), [raw]);
  const genders  = useMemo(() => ["All", ...new Set(raw.map(r => r.gender))].sort(), [raw]);

  // Pagination
  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex   = startIndex + ITEMS_PER_PAGE;
  const paginatedData = data.slice(startIndex, endIndex);

  // KPIs
  const totalLoss = currency(sum(data, r => r.amount_lost_aud));
  const totalReports = sum(data, r => r.report_count).toLocaleString();
  const avgLossPerReport = data.length > 0
    ? currency(sum(data, r => r.amount_lost_aud) / Math.max(1, sum(data, r => r.report_count)))
    : "$0";
  const totalRecords = data.length.toLocaleString();

  // Series
  const monthly = useMemo(() => {
    const grouped = groupBy(data, r => r.month);
    return grouped
      .map(([month, rows]) => ({
        month,
        loss:  sum(rows, r => r.amount_lost_aud),
        count: sum(rows, r => r.report_count),
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }, [data]);

  const byState = useMemo(() => {
    const grouped = groupBy(data, r => r.state_code);
    return grouped
      .map(([code, rows]) => ({
        code,
        reports: sum(rows, r => r.report_count),
        loss:    sum(rows, r => r.amount_lost_aud),
      }))
      .sort((a, b) => b.reports - a.reports)
      .slice(0, 8);
  }, [data]);

  // Main chart options (bigger + year scrubber)
  const monthlyOpt = {
    tooltip: { trigger: "axis" },
    legend:  { data: ["Reports", "Loss (AUD)"] },
    grid:    { left: 70, right: 60, bottom: 90, top: 36 },
    xAxis: {
      type: "category",
      data: monthly.map(x => x.month),
      axisLabel: { formatter: v => prettyMonth(v), rotate: 20 },
    },
    yAxis: [
      { type: "value", name: "Loss (AUD)", axisLabel: { formatter: v => currency(v).replace(".00","") } },
      { type: "value", name: "Reports", position: "right" },
    ],
    dataZoom: [
      { type: "slider", height: 24, bottom: 18, brushSelect: false },
      { type: "inside" }
    ],
    series: [
      { name:"Reports", type:"bar", yAxisIndex:1, itemStyle:{ color: COLORS.primary }, data: monthly.map(x => x.count) },
      { name:"Loss (AUD)", type:"line", smooth:true, itemStyle:{ color: COLORS.red }, data: monthly.map(x => x.loss) },
    ],
  };

  // Bar fallback for states
  const stateBarOpt = {
    tooltip: { trigger: "item" },
    grid: { left: 70, right: 40, bottom: 40, top: 20 },
    xAxis: { type: "category", data: byState.map(x => x.code) },
    yAxis: [{ type: "value", name: "Reports" }],
    series: [{ type: "bar", itemStyle: { color: COLORS.gold }, data: byState.map(x => x.reports) }],
  };

  // Map data & option
  const mapAgg = useMemo(() => {
    const m = new Map();
    data.forEach(r => {
      const code = r.state_code || "Unspecified";
      const prev = m.get(code) || { reports: 0, loss: 0 };
      prev.reports += r.report_count || 0;
      prev.loss    += r.amount_lost_aud || 0;
      m.set(code, prev);
    });
    const arr = [];
    for (const [code, v] of m) {
      const name = CODE_TO_NAME[code];
      if (!name) continue;
      arr.push({ name, value: v.reports, loss: v.loss, code });
    }
    return arr;
  }, [data]);

  const auMapOption = {
    tooltip: {
      trigger: "item",
      formatter: p => {
        const { name, data } = p;
        if (!data) return `<b>${name}</b><br/>No data`;
        return [`<b>${name}</b>`,`Reports: ${data.value.toLocaleString()}`,`Loss: ${currency(data.loss)}`].join("<br/>");
      }
    },
    visualMap: { left: 10, bottom: 10, text: ["High","Low"], inRange: { color: ["#E6F0FF", "#012169"] }, calculable: true },
    series: [{
      name: "Reports",
      type: "map",
      map: "australia",
      nameProperty: "name",
      roam: true,
      emphasis: { label: { show: false } },
      data: mapAgg
    }]
  };

  // Gender donut data
  const genderAgg = useMemo(() => {
    const grouped = groupBy(data, r => r.gender || "Unspecified");
    const g = grouped.map(([g, rows]) => ({
      key: g,
      reports: sum(rows, r => r.report_count),
      loss:    sum(rows, r => r.amount_lost_aud)
    }));
    const totalReportsNum = g.reduce((a,b)=>a+b.reports,0) || 1;
    const totalLossNum    = g.reduce((a,b)=>a+b.loss,0) || 1;
    return {
      data: g,
      pct: {
        reports: g.map(x => ({ name: x.key, value: +(100 * x.reports / totalReportsNum).toFixed(2) })),
        loss:    g.map(x => ({ name: x.key, value: +(100 * x.loss    / totalLossNum).toFixed(2) })),
      }
    };
  }, [data]);

  const genderOpt = useMemo(() => {
    const src = genderMetric === "loss" ? genderAgg.pct.loss : genderAgg.pct.reports;
    const order = ["Female", "Male", "X", "Unspecified"];
    const pieData = order
      .map(name => {
        const found = src.find(d => d.name === name);
        return found ? {
          ...found,
          itemStyle: { color: GENDER_COLORS[name] || "#888" }
        } : null;
      })
      .filter(Boolean);

    return {
      tooltip: { trigger: "item", formatter: (p) => `${p.name}: ${p.value}%` },
      legend: {
        top: 0, left: "center", orient: "horizontal", icon: "circle",
        textStyle: { fontSize: 12 },
        data: order.filter(n => pieData.some(p => p.name === n)),
      },
      series: [{
        name: "Gender",
        type: "pie",
        radius: ["55%","76%"],
        center: ["50%","62%"],
        label: { formatter: "{b} {d}%" },
        labelLine: { length: 14, length2: 10 },
        itemStyle: { borderColor: "#fff", borderWidth: 2 },
        data: pieData
      }]
    };
  }, [genderAgg, genderMetric]);

  // Insights
  const insights = useMemo(() => makeInsights(data, monthly, byState), [data, monthly, byState]);
  const genderSideInsight = useMemo(() => genderInsightFrom(genderAgg, genderMetric), [genderAgg, genderMetric]);

  // Guided config
  const steps = [
    { key: "year",    title: "Which year do you want to look at?", options: years },
    { key: "state",   title: "Focus on any state?",               options: states },
    { key: "contact", title: "How were victims contacted?",       options: contacts },
    { key: "gender",  title: "Filter by gender?",                 options: genders },
  ];
  function setAnswer(key, value) { setFilters(f => ({ ...f, [key]: value })); setStepIdx(i => Math.min(i+1, steps.length)); }
  function resetGuided() { setFilters({ year:"All", state:"All", contact:"All", gender:"All" }); setStepIdx(0); }

  const onStateClick = p => setFilters(f => ({ ...f, state: p.name ?? p.value ?? "All" }));
  const onMapClick   = p => { const code = Object.entries(CANON).find(([n]) => n === p?.name)?.[1]; if (code) setFilters(f => ({ ...f, state: code })); };

  if (isLoading) {
    return (
      <div id="trends-page" className="page active">
        <div className="page-content-wrapper">
          <div style={{ display:"flex", justifyContent:"center", alignItems:"center", height:"60vh", flexDirection:"column", gap:20 }}>
            <div style={{ width:50, height:50, border:"4px solid #f3f3f3", borderTop:"4px solid #012169", borderRadius:"50%", animation:"spin 1s linear infinite" }} />
            <p style={{ color:"#666", fontSize:16 }}>Loading job scam data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="trends-page" className="page active">
      <div className="page-content-wrapper">
        <div style={{ padding: 24 }}>
          {/* Header */}
          <div style={{ marginBottom: 12 }}>
            <h2 style={{ margin:"0 0 8px 0", fontSize: "24px", fontWeight: 700, color: "#012169" }}>
              Job Scam Analytics
            </h2>
            <p style={{ margin: 0, color: "#666", fontSize: 14 }}>
              Analysis of employment-related fraud data. Use filters below or scrub the timeline slider.
            </p>
          </div>

          {/* Mode toggle */}
          <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
            <Pill active={mode === "guided"} onClick={() => setMode("guided")}>🧭 Guided</Pill>
            <Pill active={mode === "explore"} onClick={() => setMode("explore")}>📊 Explore</Pill>
            <Pill active={mode === "table"}   onClick={() => setMode("table")}>📋 Data Table</Pill>
          </div>

          {/* KPIs */}
          <div className="stats-grid" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:16 }}>
            <KPI title="Total Loss" value={totalLoss} />
            <KPI title="Total Reports" value={totalReports} />
            <KPI title="Avg Loss/Report" value={avgLossPerReport} />
            <KPI title="Records" value={totalRecords} />
          </div>

          {/* Filters (only for Explore/Table) */}
          {(mode === "explore" || mode === "table") && (
            <div className="cardish" style={{ display:"flex", gap:12, alignItems:"center", flexWrap:"wrap", marginBottom:16 }}>
              <Select label="Year"    value={filters.year}    onChange={v => setFilters(f => ({...f, year:v}))}    options={years}/>
              <Select label="State"   value={filters.state}   onChange={v => setFilters(f => ({...f, state:v}))}   options={states}/>
              <Select label="Contact" value={filters.contact} onChange={v => setFilters(f => ({...f, contact:v}))} options={contacts}/>
              <Select label="Gender"  value={filters.gender}  onChange={v => setFilters(f => ({...f, gender:v}))}  options={genders}/>
              <button onClick={() => setFilters({ year:"All", state:"All", contact:"All", gender:"All" })}>Clear All</button>
            </div>
          )}

          {/* ====================== EXPLORE MODE ====================== */}
          {mode === "explore" && (
            <>
              {/* ROW 1: Bar + Insights */}
              <div style={{ display:"grid", gridTemplateColumns:"8fr 4fr", gap:16, alignItems:"stretch", marginBottom:16 }}>
                <Card title="Monthly Job Scam Trends">
                  <ReactECharts style={{ height: 520 }} option={monthlyOpt} />
                </Card>
                <InsightsPanel insights={insights.slice(0,3)} />
              </div>

              {/* ROW 2: Donut + Gender Insight */}
              <div style={{ display:"grid", gridTemplateColumns:"6fr 6fr", gap:16, alignItems:"stretch", marginBottom:16 }}>
                <Card>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                    <div style={{ fontWeight:700, fontSize:16 }}>Gender Breakdown</div>
                    <div style={{ display:"flex", gap:8 }}>
                      <button className="pill"
                        style={{ background: genderMetric === "loss" ? "#012169" : "#dfe6f4", color: genderMetric === "loss" ? "#fff" : "#012169" }}
                        onClick={() => setGenderMetric("loss")}>Amount Lost</button>
                      <button className="pill"
                        style={{ background: genderMetric === "reports" ? "#012169" : "#dfe6f4", color: genderMetric === "reports" ? "#fff" : "#012169" }}
                        onClick={() => setGenderMetric("reports")}>Number of Reports</button>
                    </div>
                  </div>
                  <ReactECharts style={{ height: 380 }} option={genderOpt} />
                  <div style={{ display:"flex", gap:14, justifyContent:"center", marginTop:4, flexWrap:"wrap" }}>
                    {Object.entries(GENDER_COLORS).map(([k, col]) => (<LegendDot key={k} color={col} label={k} />))}
                  </div>
                </Card>
                <Card>
                  <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
                    <div style={{ fontSize:28 }}>🧑‍🤝‍🧑</div>
                    <p style={{ margin:0, color:"#263238", lineHeight:1.6, fontSize:16 }}>{genderSideInsight.text}</p>
                  </div>
                </Card>
              </div>

              {/* ROW 3: Map */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr", gap:16 }}>
                <Card title="State Distribution (Australia map — hover for stats, click to filter)">
                  {auMapReady ? (
                    <ReactECharts style={{ height: 560 }} option={auMapOption} onEvents={{ click: onMapClick }} notMerge />
                  ) : (
                    <ReactECharts style={{ height: 420 }} option={stateBarOpt} onEvents={{ click: onStateClick }} />
                  )}
                </Card>
              </div>
            </>
          )}

          {/* ====================== GUIDED MODE ====================== */}
          {mode === "guided" && (
            <Card title={`Step ${Math.min(stepIdx + 1, steps.length)} of ${steps.length} · Guided filters`}>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:12 }}>
                {Object.entries(filters).map(([k,v]) => (
                  <Chip key={k} onClear={() => setFilters(f => ({...f, [k]:"All"}))}>{labelOf(k)}: {v}</Chip>
                ))}
                <button className="pill" onClick={resetGuided}>Reset</button>
              </div>

              {stepIdx < steps.length ? (
                <Question
                  title={steps[stepIdx].title}
                  options={steps[stepIdx].options}
                  value={filters[steps[stepIdx].key]}
                  onSelect={val => { setFilters(f => ({...f, [steps[stepIdx].key]: val})); setStepIdx(i => i+1); }}
                  onSkip={() => setStepIdx(i => i+1)}
                  onBack={() => setStepIdx(i => Math.max(i-1,0))}
                />
              ) : (
                <>
                  <div style={{ display:"grid", gridTemplateColumns:"8fr 4fr", gap:16, alignItems:"stretch", marginBottom:16 }}>
                    <Card title="Monthly Job Scam Trends">
                      <ReactECharts style={{ height: 520 }} option={monthlyOpt} />
                    </Card>
                    <InsightsPanel insights={insights.slice(0,3)} />
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"6fr 6fr", gap:16, alignItems:"stretch", marginBottom:16 }}>
                    <Card>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                        <div style={{ fontWeight:700, fontSize:16 }}>Gender Breakdown</div>
                        <div style={{ display:"flex", gap:8 }}>
                          <button className="pill"
                            style={{ background: genderMetric === "loss" ? "#012169" : "#dfe6f4", color: genderMetric === "loss" ? "#fff" : "#012169" }}
                            onClick={() => setGenderMetric("loss")}>Amount Lost</button>
                          <button className="pill"
                            style={{ background: genderMetric === "reports" ? "#012169" : "#dfe6f4", color: genderMetric === "reports" ? "#fff" : "#012169" }}
                            onClick={() => setGenderMetric("reports")}>Number of Reports</button>
                        </div>
                      </div>
                      <ReactECharts style={{ height: 380 }} option={genderOpt} />
                      <div style={{ display:"flex", gap:14, justifyContent:"center", marginTop:4, flexWrap:"wrap" }}>
                        {Object.entries(GENDER_COLORS).map(([k, col]) => (<LegendDot key={k} color={col} label={k} />))}
                      </div>
                    </Card>
                    <Card>
                      <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
                        <div style={{ fontSize:28 }}>🧑‍🤝‍🧑</div>
                        <p style={{ margin:0, color:"#263238", lineHeight:1.6, fontSize:16 }}>{genderSideInsight.text}</p>
                      </div>
                    </Card>
                  </div>
                  <Card title="State Distribution (Australia map — hover for stats, click to filter)">
                    {auMapReady ? (
                      <ReactECharts style={{ height: 560 }} option={auMapOption} onEvents={{ click: onMapClick }} notMerge />
                    ) : (
                      <ReactECharts style={{ height: 420 }} option={stateBarOpt} onEvents={{ click: onStateClick }} />
                    )}
                  </Card>
                </>
              )}
            </Card>
          )}

          {/* ====================== DATA TABLE MODE ====================== */}
          {mode === "table" && (
            <Card title={`Job Scam Data (${data.length} records)`}>
              <p style={{ margin:"4px 0 12px", color:"#666", fontSize:14 }}>
                Showing {startIndex + 1}-{Math.min(endIndex, data.length)} of {data.length} records.
              </p>
              <div style={{ overflowX:"auto", maxHeight:440, overflowY:"auto" }}>
                <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
                  <thead style={{ background:"#f8f9fa", position:"sticky", top:0 }}>
                    <tr>
                      <th style={th}>Month</th>
                      <th style={th}>State</th>
                      <th style={th}>Contact</th>
                      <th style={th}>Gender</th>
                      <th style={{...th, textAlign:"right"}}>Loss</th>
                      <th style={{...th, textAlign:"right"}}>Reports</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.map((row, idx) => (
                      <tr key={startIndex + idx} style={{ borderBottom:"1px solid #dee2e6" }}>
                        <td style={td}>{row.month ? prettyMonth(row.month) : "N/A"}</td>
                        <td style={td}>{row.state_code || "N/A"}</td>
                        <td style={td}>{row.contact_method || "N/A"}</td>
                        <td style={td}>{row.gender || "N/A"}</td>
                        <td style={{ ...td, textAlign:"right" }}>{currency(row.amount_lost_aud)}</td>
                        <td style={{ ...td, textAlign:"right" }}>{row.report_count?.toLocaleString() || "0"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {data.length > ITEMS_PER_PAGE && (
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:16 }}>
                  <div style={{ fontSize:12, color:"#666" }}>Page {currentPage} of {totalPages}</div>
                  <div style={{ display:"flex", gap:8 }}>
                    <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} style={{ padding:"4px 8px", fontSize:12 }}>Previous</button>
                    <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} style={{ padding:"4px 8px", fontSize:12 }}>Next</button>
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

/* ---------- helpers & small components ---------- */

function KPI({ title, value }) {
  return (
    <div style={{ padding:16, borderRadius:12, background:"#fff", boxShadow:"0 2px 8px rgba(0,0,0,.08)" }}>
      <div style={{ fontSize:12, opacity:.7 }}>{title}</div>
      <div style={{ fontSize:24, fontWeight:700 }}>{value}</div>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div className="card" style={{ padding:16, borderRadius:12, background:"#fff", boxShadow:"0 2px 8px rgba(0,0,0,.08)", marginBottom:16 }}>
      {title && <div style={{ fontWeight:700, marginBottom:8 }}>{title}</div>}
      {children}
    </div>
  );
}

function Pill({ active, children, onClick }) {
  return (
    <button
      className={`pill ${active ? "active" : ""}`}
      onClick={onClick}
      style={{
        padding:"8px 16px",
        border:"2px solid #012169",
        background: active ? "#012169" : "transparent",
        color: active ? "white" : "#012169",
        borderRadius: "20px",
        cursor: "pointer",
        fontWeight: 600,
      }}
    >
      {children}
    </button>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
      <span style={{ fontSize: 12 }}>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}

function Question({ title, options, value, onSelect, onSkip, onBack }) {
  return (
    <div className="question-wrap">
      <div className="question-title">❓ {title}</div>
      <div className="question-choices">
        {options.map((opt) => (
          <button
            key={opt}
            className={`choice ${value === opt ? "active" : ""}`}
            onClick={() => onSelect(opt)}
          >
            {opt}
          </button>
        ))}
      </div>
      <div className="qa-ctrls">
        <button onClick={onBack}>← Back</button>
        <button onClick={onSkip}>Skip →</button>
      </div>
    </div>
  );
}

function Chip({ children, onClear }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "6px 10px",
        borderRadius: 999,
        background: "#EEF3FF",
        color: "#012169",
        fontWeight: 600,
      }}
    >
      {children}
      <button
        onClick={onClear}
        style={{ border: 0, background: "transparent", cursor: "pointer" }}
      >
        ✕
      </button>
    </span>
  );
}

function InsightsPanel({ insights }) {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      {insights.map(({ icon, text }, i) => (
        <Card key={i}>
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <div style={{ fontSize: 22 }}>{icon}</div>
            <p style={{ margin: 0, color: "#263238", lineHeight: 1.6, fontSize: 15 }}>
              {text}
            </p>
          </div>
        </Card>
      ))}
    </div>
  );
}

function LegendDot({ color, label }) {
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:8, fontSize:12, color:"#34495e" }}>
      <span style={{ width:10, height:10, borderRadius:"50%", background:color, display:"inline-block" }} />
      {label}
    </span>
  );
}

function labelOf(key) {
  return ({ year: "Year", state: "State", contact: "Contact", gender: "Gender" }[key] || key);
}

function makeInsights(data, monthly, byState) {
  if (!data.length)
    return [{ icon: "🪄", text: "No records match your filters yet. Widen them to see trends." }];

  let peakLoss = null;
  let peakCnt = null;
  monthly.forEach((m) => {
    if (!peakLoss || m.loss > peakLoss.loss) peakLoss = m;
    if (!peakCnt || m.count > peakCnt.count) peakCnt = m;
  });

  const leadState = byState[0];

  const byContact = groupBy(data, (r) => r.contact_method)
    .map(([k, rows]) => ({ k, n: sum(rows, (r) => r.report_count), $: sum(rows, (r) => r.amount_lost_aud) }))
    .sort((a, b) => b.n - a.n);

  const out = [];

  if (peakLoss) {
    out.push({
      icon: "💸",
      text: `Biggest loss hit in ${prettyMonth(peakLoss.month)} (~${currency(peakLoss.loss)}). Likely a few large incidents (fake 'placement fees', reimbursements) rather than a broad wave.`,
    });
  }
  if (peakCnt) {
    out.push({
      icon: "📈",
      text: `Most reports landed in ${prettyMonth(peakCnt.month)} (~${peakCnt.count.toLocaleString()}). Seasonal hiring bursts (grads/holidays) tend to drive this.`,
    });
  }
  if (leadState) {
    out.push({
      icon: "🗺️",
      text: `Reports concentrate in ${leadState.code} (~${leadState.reports.toLocaleString()}). Population + job market size + awareness usually explain the skew.`,
    });
  } else if (byContact[0]) {
    out.push({
      icon: "☎️",
      text: `Top contact channel: ${byContact[0].k} (~${byContact[0].n.toLocaleString()} reports). Treat upfront fees / “verify ID” links as red flags.`,
    });
  }

  return out.slice(0, 3);
}

function genderInsightFrom(genderAgg, metric) {
  const arr = (genderAgg?.data || [])
    .map(x => ({ key: x.key, v: metric === "loss" ? x.loss : x.reports }))
    .sort((a,b)=>b.v-a.v);

  if (!arr.length || !arr[0]) {
    return {
      icon: "🧑‍🤝‍🧑",
      text: "No gender breakdown available for the current filter selection."
    };
  }

  const top = arr[0];
  const total = arr.reduce((a,b)=>a+b.v,0) || 1;
  const pct = Math.round((top.v/total)*100);
  const metricLabel = metric === "loss" ? "total loss" : "reported cases";

  return {
    icon: "🧑‍🤝‍🧑",
    text: `${top.key} accounts for ~${pct}% of ${metricLabel}. That usually reflects exposure patterns (industry mix & application volume), not vulnerability — training & awareness help even it out.`
  };
}

const th = { padding: "8px", textAlign: "left", borderBottom: "1px solid #dee2e6" };
const td = { padding: "8px" };
