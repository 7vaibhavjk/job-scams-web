// src/components/TrendsPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import ReactECharts from "echarts-for-react";
import { loadRecords, groupBy, sum, currency } from "../services/data";

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

function prettyMonth(m) {
  const [y, mm] = String(m).split("-");
  const names = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const mon = names[(+mm || 1) - 1] || m;
  return `${mon} ${String(y).slice(2)}`;
}

export default function TrendsPage() {
  const [raw, setRaw] = useState([]);
  const [filters, setFilters] = useState({
    year: "All",
    state: "All",
    contact: "All",
    gender: "All",
    age: "All",
    scamType: "Jobs and employment scams",
  });

  // NEW: for chart selection
  const [selectedChart, setSelectedChart] = useState("");
  const [showChart, setShowChart] = useState(false);

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

  // chart options (same as before)
  const monthlyOpt = {
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "cross" },
        formatter: (params) => {
          const x = params?.[0]?.axisValue;
          const p = params
              .map((s) =>
                  s.seriesName === "Loss (AUD)"
                      ? `${s.marker} ${s.seriesName}: <b>${currency(s.value)}</b>`
                      : `${s.marker} ${s.seriesName}: <b>${s.value.toLocaleString()}</b>`
              )
              .join("<br/>");
          return `<div style="font-weight:700;margin-bottom:4px">${prettyMonth(x)}</div>${p}`;
        },
      },
      legend: { data: ["Reports", "Loss (AUD)"] },
      grid: { left: 70, right: 60, bottom: 60, top: 36 },
      xAxis: {
        type: "category",
        data: monthly.map((x) => x.month),
        axisLabel: {
          formatter: (v) => prettyMonth(v),
          rotate: 20,
          color: "#59657a",
          fontSize: 12,
        },
        axisLine: { lineStyle: { color: "#E5EBF4" } },
        axisTick: { show: true, length: 6, lineStyle: { color: "#C8D2E3" } },
      },
      yAxis: [
        {
          type: "value",
          name: "Loss (AUD)",
          axisLabel: {
            formatter: (v) => currency(v).replace(".00", ""),
            color: "#59657a",
          },
          splitLine: { lineStyle: { color: "#EEF2F8" } },
          axisLine: { show: false },
          axisTick: { show: false },
        },
        {
          type: "value",
          name: "Reports",
          position: "right",
          axisLabel: { color: "#59657a" },
          splitLine: { show: false },
          axisLine: { show: false },
          axisTick: { show: false },
        },
      ],
      series: [
        {
          name: "Reports",
          type: "bar",
          yAxisIndex: 1,
          barWidth: 18,
          itemStyle: { color: barGradient("#3EDBD9", COLORS.teal) },
          emphasis: { itemStyle: { color: barGradient("#68E7E5", "#06B3B1") } },
          data: monthly.map((x) => x.count),
        },
        {
          name: "Loss (AUD)",
          type: "line",
          smooth: true,
          symbol: "circle",
          symbolSize: 6,
          lineStyle: { width: 3, color: COLORS.red },
          itemStyle: { color: COLORS.red },
          areaStyle: {
            color: {
              type: "linear",
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: "rgba(228,0,43,.18)" },
                { offset: 1, color: "rgba(228,0,43,0)" },
              ],
            },
            opacity: 0.7,
          },
          data: monthly.map((x) => x.loss),
        },
      ],
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

  // interactions
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
      <section className="section">
  <div className="container">
    <h2 className="features-title">Scam Trends & Insights</h2>
  </div>
</section>


      {/* Filters */}
      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", marginBottom: 16 }}>
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
        <KPI title="Scam Type" value="Jobs and Employment Scams"/>
        <KPI title="Contact method" value={contactMethods[0]?.name ?? "—"}/>
      </div>

      {/* Chart selector */}
      <div style={{ display: "flex", gap: 12, margin: "16px 0" }}>
        <label>
          <span style={{ fontSize: 12, marginRight: 6 }}>Select Chart</span>
          <select
            value={selectedChart}
            onChange={(e) => setSelectedChart(e.target.value)}
          >
            <option value="">-- Choose One --</option>
            <option value="monthly">Amount lost & reports (monthly trend)</option>
            <option value="topScams">Top ten scams by loss</option>
            <option value="contact">Top contact methods</option>
            <option value="state">State reported scams</option>
            <option value="heatmap">State heatmap</option>
            <option value="gender">Gender breakdown</option>
            <option value="age">Age breakdown</option>
          </select>
        </label>

        <button onClick={() => setShowChart(true)} disabled={!selectedChart}>
          Show Graph
        </button>
      </div>

      {/* Conditional chart rendering */}
      {showChart && (
        <>
          {selectedChart === "monthly" && (
            <Card title="Amount lost and number of reports">
              <ReactECharts style={{ height: 340 }} option={monthlyOpt} />
            </Card>
          )}
          {selectedChart === "topScams" && (
            <Card title="Top ten scams by loss (click bar to filter)">
              <ReactECharts style={{ height: 360 }} option={topScamsOpt} onEvents={{ click: onTopScamClick }}/>
            </Card>
          )}
          {selectedChart === "contact" && (
            <Card title="Top contact methods (click bar to filter)">
              <ReactECharts style={{ height: 300 }} option={contactOpt} onEvents={{ click: onContactClick }}/>
            </Card>
          )}
          {selectedChart === "state" && (
            <Card title="State reported scams (click bar to filter)">
              <ReactECharts style={{ height: 300 }} option={stateOpt} onEvents={{ click: onStateClick }}/>
            </Card>
          )}
          {selectedChart === "heatmap" && (
            <Card title="State heatmap (click tile to filter)">
              <ReactECharts style={{ height: 260 }} option={ausHeatmapOpt} />
            </Card>
          )}
          {selectedChart === "gender" && (
            <Card title="Gender breakdown (click slice to filter)">
              <ReactECharts style={{ height: 320 }} option={genderOpt} onEvents={{ click: onGenderClick }}/>
            </Card>
          )}
          {selectedChart === "age" && (
            <Card title="Reported scams and loss breakdown by age">
              <ReactECharts style={{ height: 320 }} option={ageOpt} />
            </Card>
          )}
        </>
      )}
    </div>
  );
}

// small helper components
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
