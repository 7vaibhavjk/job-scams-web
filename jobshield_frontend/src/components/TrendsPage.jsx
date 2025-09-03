// src/components/TrendsPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import ReactECharts from "echarts-for-react";
import { loadRecords, groupBy, sum, currency } from "../services/data";

// below other imports
const COLORS = {
  primary:   "#012169", // AUS blue
  dark:      "#001A44",
  gold:      "#FFCD00",
  red:       "#E4002B",
  green:     "#2e7d32",
  teal:      "#00A3A1",
  violet:    "#6C63FF",
  slate:     "#67758d",
  sky:       "#7AB8F5",
  coral:     "#FF7F50",
  pink:      "#F06292",
  orange:    "#F57F17",
};

// helper to build a soft vertical gradient bar
const barGradient = (top, bottom=COLORS.primary) => ({
  type: "linear",
  x: 0, y: 0, x2: 0, y2: 1,
  colorStops: [
    { offset: 0, color: top },
    { offset: 1, color: bottom }
  ]
});



export default function TrendsPage() {
  const [raw, setRaw] = useState([]);
  const [filters, setFilters] = useState({
    year: "All",
    state: "All",
    contact: "All",
    gender: "All",
    age: "All",
    scamType: "All",
  });

  useEffect(() => { (async () => setRaw(await loadRecords()))(); }, []);

  // build select options from the data
  const years   = useMemo(() => ["All", ...new Set(raw.map(r => String(r.year)))].sort(), [raw]);
  const states  = useMemo(() => ["All", ...new Set(raw.map(r => r.state_code))].sort(), [raw]);
  const contacts= useMemo(() => ["All", ...new Set(raw.map(r => r.contact_method))].sort(), [raw]);
  const genders = useMemo(() => ["All", ...new Set(raw.map(r => r.gender))].sort(), [raw]);
  const ages    = useMemo(() => ["All", ...new Set(raw.map(r => r.age_band))].sort(), [raw]);
  const scamTypes = useMemo(() => ["All", ...new Set(raw.map(r => r.scam_type))].sort(), [raw]);

  // apply filters
  const data = useMemo(() => raw.filter(r =>
    (filters.year    === "All" || String(r.year)        === filters.year) &&
    (filters.state   === "All" || r.state_code          === filters.state) &&
    (filters.contact === "All" || r.contact_method      === filters.contact) &&
    (filters.gender  === "All" || r.gender              === filters.gender) &&
    (filters.age     === "All" || r.age_band            === filters.age) &&
    (filters.scamType=== "All" || r.scam_type           === filters.scamType)
  ), [raw, filters]);

  // KPI
  const totalLoss   = currency(sum(data, r => r.amount_lost_aud));
  const totalReports= sum(data, r => r.report_count).toLocaleString();

  // series
  const monthly = useMemo(() =>
    groupBy(data, r => r.month)
      .map(([month, rows]) => ({
        month,
        loss: sum(rows, r => r.amount_lost_aud),
        count: sum(rows, r => r.report_count),
      }))
      .sort((a,b)=> a.month.localeCompare(b.month))
  , [data]);

  const topScams = useMemo(() =>
    groupBy(data, r => r.scam_type)
      .map(([name, rows]) => ({ name, loss: sum(rows, r => r.amount_lost_aud), count: sum(rows, r => r.report_count) }))
      .sort((a,b)=> b.loss - a.loss).slice(0,10)
  , [data]);

  const contactMethods = useMemo(() =>
    groupBy(data, r => r.contact_method)
      .map(([name, rows]) => ({ name, reports: sum(rows, r => r.report_count), loss: sum(rows, r => r.amount_lost_aud) }))
      .sort((a,b)=> b.reports - a.reports)
  , [data]);

  const byState = useMemo(() =>
    groupBy(data, r => r.state_code)
      .map(([code, rows]) => ({ code, reports: sum(rows, r => r.report_count), loss: sum(rows, r => r.amount_lost_aud) }))
      .sort((a,b)=> b.reports - a.reports)
  , [data]);

  const byGender = useMemo(() =>
    groupBy(data, r => r.gender)
      .map(([name, rows]) => ({ name, value: sum(rows, r => r.amount_lost_aud) }))
  , [data]);

  const byAge = useMemo(() =>
    groupBy(data, r => r.age_band)
      .map(([name, rows]) => ({ name, loss: sum(rows, r => r.amount_lost_aud), count: sum(rows, r => r.report_count) }))
      .sort((a,b)=> b.loss - a.loss)
  , [data]);

  // chart options
  const monthlyOpt = {
  tooltip: { trigger: "axis", valueFormatter: v => currency(v) },
  legend: { data: ["Loss (AUD)", "Reports"] },
  grid: { left: 50, right: 40, bottom: 40, top: 30 },
  xAxis: { type: "category", data: monthly.map(x => x.month) },
  yAxis: [
    { type: "value", name: "Loss (AUD)", axisLabel: { formatter: v => currency(v) } },
    { type: "value", name: "Reports", position: "right" }
  ],
  series: [
    {
      name: "Loss (AUD)",
      type: "bar",
      itemStyle: { color: barGradient("#415aD5", COLORS.primary) },
      emphasis: { itemStyle: { color: barGradient("#5C7CFF", COLORS.dark) }},
      data: monthly.map(x => x.loss)
    },
    {
      name: "Reports",
      type: "scatter",
      symbolSize: 10,
      itemStyle: { color: COLORS.green },
      yAxisIndex: 1,
      data: monthly.map(x => x.count)
    }
  ]
  };


  const topScamsOpt = {
  tooltip: { trigger: "item", valueFormatter: v => currency(v) },
  grid: { left: 120, right: 40, bottom: 90, top: 20 },
  xAxis: { type: "category", data: topScams.map(x => x.name), axisLabel: { interval: 0, rotate: 20 } },
  yAxis: { type: "value", axisLabel: { formatter: v => currency(v) } },
  series: [{
    type: "bar",
    itemStyle: { color: barGradient("#9A8CFF", "#6C63FF") },
    emphasis: { itemStyle: { color: barGradient("#B3A8FF", "#7B71FF") }},
    data: topScams.map(x => x.loss)
  }]
 };


  const contactOpt = {
  tooltip: { trigger: "item" },
  grid: { left: 120, right: 40, bottom: 60, top: 20 },
  xAxis: { type: "category", data: contactMethods.map(x => x.name), axisLabel: { interval: 0, rotate: 20 } },
  yAxis: [{ type: "value", name: "Reports" }],
  series: [{
    type: "bar",
    itemStyle: { color: barGradient("#3EDBD9", COLORS.teal) },
    emphasis: { itemStyle: { color: barGradient("#68E7E5", "#06B3B1") }},
    data: contactMethods.map(x => x.reports)
  }]
 };


  const stateOpt = {
  tooltip: { trigger: "item" },
  grid: { left: 70, right: 40, bottom: 40, top: 20 },
  xAxis: { type: "category", data: byState.map(x => x.code) },
  yAxis: [{ type: "value", name: "Reports" }],
  series: [{
    type: "bar",
    itemStyle: { color: barGradient("#FFE26B", COLORS.gold) },
    emphasis: { itemStyle: { color: barGradient("#FFE891", "#FFB300") }},
    data: byState.map(x => x.reports)
  }]
 };


  const genderOpt = {
  tooltip: { trigger: "item", valueFormatter: v => currency(v) },
  legend: { top: 0 },
  color: [COLORS.primary, COLORS.pink, COLORS.orange, COLORS.slate],
  series: [{
    type: "pie",
    radius: ["50%","70%"],
    data: byGender,
    label: { formatter: "{b}: {d}%"}
  }]
 };


  const ageOpt = {
  tooltip: { trigger: "axis", valueFormatter: v => currency(v) },
  grid: { left: 120, right: 40, bottom: 80, top: 20 },
  xAxis: { type: "category", data: byAge.map(x => x.name), axisLabel: { interval: 0, rotate: 20 } },
  yAxis: [{ type: "value", axisLabel: { formatter: v => currency(v) } }],
  series: [{
    type: "bar",
    itemStyle: { color: barGradient("#FF9A7A", COLORS.coral) },
    emphasis: { itemStyle: { color: barGradient("#FFB199", "#FF6A3D") }},
    data: byAge.map(x => x.loss)
  }]
 };

  // fixed grid positions for each state/territory
// fixed grid positions for each state/territory
// --- tile layout stays the same ---
const TILE = {
  WA:  [0,1],
  NT:  [1,0],
  QLD: [2,0],
  SA:  [1,1],
  NSW: [2,1],
  ACT: [3,1],
  TAS: [1,2],
  VIC: [2,2],
};

const stateReports = new Map(byState.map(s => [s.code, s.reports]));

// Build data as objects with value:[x,y,v] + state label
const heatData = Object.entries(TILE).map(([code, [x, y]]) => ({
  value: [x, y, stateReports.get(code) || 0],
  state: code
}));

// Category labels derived from TILE extents
const maxX = Math.max(...Object.values(TILE).map(([x]) => x));
const maxY = Math.max(...Object.values(TILE).map(([, y]) => y));
const xCats = Array.from({ length: maxX + 1 }, (_, i) => String(i));
const yCats = Array.from({ length: maxY + 1 }, (_, i) => String(i));

const ausHeatmapOpt = {
  tooltip: {
    formatter: p =>
      `${p.data.state}: ${p.value[2].toLocaleString()} reports`
  },
  grid: { left: 20, right: 20, top: 10, bottom: 30 },

  // Two category axes with boundaryGap and visible split areas
  xAxis: {
    type: "category",
    data: xCats,
    boundaryGap: true,
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { show: false },
    splitArea: { show: true }     // helps you see the tiles
  },
  yAxis: {
    type: "category",
    data: yCats,
    boundaryGap: true,
    inverse: true,
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { show: false },
    splitArea: { show: true }
  },

  visualMap: {
    min: 0,
    max: Math.max(...heatData.map(d => d.value[2])) || 1,
    calculable: true,
    orient: "horizontal",
    left: "center",
    bottom: 0,
    inRange: { color: ["#E6F0FF", COLORS.primary] }
  },

  series: [{
    type: "heatmap",
    coordinateSystem: "cartesian2d",
    data: heatData,
    encode: { x: 0, y: 1, value: 2 },  // 👈 make mapping explicit
    itemStyle: { borderColor: "#fff", borderWidth: 2 },
    label: {
      show: true,
      formatter: p => p.data.state,
      color: "#fff",
      fontWeight: 700
    },
    emphasis: {
      itemStyle: { shadowBlur: 8, shadowColor: "rgba(0,0,0,0.25)" }
    }
  }]
};





  // linked interactions: click → apply filter
  const onTopScamClick = p => setFilters(f => ({ ...f, scamType: p.name }));
  const onGenderClick  = p => setFilters(f => ({ ...f, gender: p.name }));
  const onContactClick = p => setFilters(f => ({ ...f, contact: p.name }));
  const onStateClick   = p => setFilters(f => ({ ...f, state: p.name }));

  // export filtered rows as CSV
  function exportCSV() {
    const headers = ["date","year","month","state_code","state_name","contact_method","age_band","gender","scam_group","scam_type","amount_lost_aud","report_count"];
    const lines = [headers.join(",")].concat(
      data.map(r => headers.map(h => (""+ (r[h]?.valueOf?.() ?? r[h] ?? "")).replaceAll('"','""')).map(x=>`"${x}"`).join(","))
    );
    const blob = new Blob([lines.join("\n")], {type:"text/csv;charset=utf-8"});
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = "jobshield_filtered.csv"; a.click(); URL.revokeObjectURL(a.href);
  }

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 12 }}>Scam Trends & Insights</h2>

      {/* Filters */}
      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", marginBottom: 16 }}>
        <Select label="Scam Type" value={filters.scamType} onChange={v => setFilters(f => ({...f, scamType: v}))} options={scamTypes}/>
        <Select label="State"     value={filters.state}    onChange={v => setFilters(f => ({...f, state: v}))} options={states}/>
        <Select label="Year"      value={filters.year}     onChange={v => setFilters(f => ({...f, year: v}))} options={years}/>
        <Select label="Contact"   value={filters.contact}  onChange={v => setFilters(f => ({...f, contact: v}))} options={contacts}/>
        <Select label="Gender"    value={filters.gender}   onChange={v => setFilters(f => ({...f, gender: v}))} options={genders}/>
        <Select label="Age"       value={filters.age}      onChange={v => setFilters(f => ({...f, age: v}))} options={ages}/>
        <button onClick={() => setFilters({ year:"All",state:"All",contact:"All",gender:"All",age:"All",scamType:"All" })}>Clear All</button>
        <button onClick={exportCSV}>Export</button>
      </div>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 16 }}>
        <KPI title="Reported losses" value={totalLoss}/>
        <KPI title="Reported scams"  value={totalReports}/>
        <KPI title="Top scam by loss" value={topScams[0]?.name ?? "—"}/>
        <KPI title="Top contact method" value={contactMethods[0]?.name ?? "—"}/>
      </div>

      {/* Charts */}
      <Card title="Amount lost and number of reports">
        <ReactECharts style={{ height: 340 }} option={monthlyOpt}/>
      </Card>

      <Card title="Top ten scams by loss (click bar to filter)">
        <ReactECharts style={{ height: 360 }} option={topScamsOpt} onEvents={{ click: onTopScamClick }}/>
      </Card>

      <Card title="Top contact methods (click bar to filter)">
        <ReactECharts style={{ height: 300 }} option={contactOpt} onEvents={{ click: onContactClick }}/>
      </Card>

      <Card title="State reported scams (click bar to filter)">
        <ReactECharts style={{ height: 300 }} option={stateOpt} onEvents={{ click: onStateClick }}/>
      </Card>

      <Card title="State heatmap (click tile to filter)">
        <ReactECharts
          style={{ height: 260 }}
          option={ausHeatmapOpt}
          onEvents={{
            click: (p) => setFilters(f => ({ ...f, state: p.data?.state || f.state }))
          }}
        />

      </Card>


      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card title="Gender breakdown (click slice to filter)">
          <ReactECharts style={{ height: 320 }} option={genderOpt} onEvents={{ click: onGenderClick }}/>
        </Card>
        <Card title="Reported scams and loss breakdown by age">
          <ReactECharts style={{ height: 320 }} option={ageOpt}/>
        </Card>
      </div>
    </div>
  );
}

function KPI({ title, value }) {
  return (
    <div style={{ padding: 16, borderRadius: 12, background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,.08)" }}>
      <div style={{ fontSize: 12, opacity: .7 }}>{title}</div>
      <div style={{ fontSize: 22, fontWeight: 700 }}>{value}</div>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div style={{ padding: 16, borderRadius: 12, background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,.08)", marginBottom: 16 }}>
      <div style={{ fontWeight: 600, marginBottom: 8 }}>{title}</div>
      {children}
    </div>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
      <span style={{ fontSize: 12 }}>{label}</span>
      <select value={value} onChange={e => onChange(e.target.value)}>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}
