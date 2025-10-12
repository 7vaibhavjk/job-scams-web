// src/components/TrendsPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import ReactECharts from "echarts-for-react";
import { loadRecords, groupBy, sum, currency } from "../services/data";

const COLORS = {
  primary: "#012169",
  red: "#E4002B",
  gold: "#FFCD00",
};

function prettyMonth(m) {
  const [y, mm] = String(m).split("-");
  const names = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const mon = names[(+mm || 1) - 1] || m;
  return `${mon} ${String(y).slice(2)}`;
}

export default function TrendsPage() {
  const [raw, setRaw] = useState([]);
  const [viewMode, setViewMode] = useState('overview');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    year: "All",
    state: "All",
    contact: "All",
    gender: "All",
  });

  const ITEMS_PER_PAGE = 20;

  useEffect(() => { 
    (async () => {
      setIsLoading(true);
      try {
        const allRecords = await loadRecords();
        // Only keep job scam records
        const jobScams = allRecords.filter(r => r.scam_type === "Jobs and employment scams");
        setRaw(jobScams);
      } catch (error) {
        console.error('Error loading data:', error);
        setRaw([]);
      } finally {
        setIsLoading(false);
      }
    })(); 
  }, []);

  // Apply filters
  const data = useMemo(() => raw.filter(r => 
    (filters.year === "All" || String(r.year) === filters.year) &&
    (filters.state === "All" || r.state_code === filters.state) &&
    (filters.contact === "All" || r.contact_method === filters.contact) &&
    (filters.gender === "All" || r.gender === filters.gender)
  ), [raw, filters]);

  // Build select options
  const years = useMemo(() => ["All", ...new Set(raw.map(r => String(r.year)))].sort(), [raw]);
  const states = useMemo(() => ["All", ...new Set(raw.map(r => r.state_code))].sort(), [raw]);
  const contacts = useMemo(() => ["All", ...new Set(raw.map(r => r.contact_method))].sort(), [raw]);
  const genders = useMemo(() => ["All", ...new Set(raw.map(r => r.gender))].sort(), [raw]);

  // Pagination
  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedData = data.slice(startIndex, endIndex);

  // KPIs
  const totalLoss = currency(sum(data, r => r.amount_lost_aud));
  const totalReports = sum(data, r => r.report_count).toLocaleString();
  const avgLossPerReport = data.length > 0 ? currency(sum(data, r => r.amount_lost_aud) / sum(data, r => r.report_count)) : "$0";
  const totalRecords = data.length.toLocaleString();

  // Simple data series
  const monthly = useMemo(() => {
    const grouped = groupBy(data, r => r.month);
    return grouped
      .map(([month, rows]) => ({
        month,
        loss: sum(rows, r => r.amount_lost_aud),
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
        loss: sum(rows, r => r.amount_lost_aud)
      }))
      .sort((a, b) => b.reports - a.reports)
      .slice(0, 8); // Only show top 8 states
  }, [data]);

  // Simple chart options
  const monthlyOpt = {
    tooltip: { trigger: "axis" },
    legend: { data: ["Reports", "Loss (AUD)"] },
    grid: { left: 70, right: 60, bottom: 60, top: 36 },
    xAxis: {
      type: "category",
      data: monthly.map((x) => x.month),
      axisLabel: {
        formatter: (v) => prettyMonth(v),
        rotate: 20,
      },
    },
    yAxis: [
      {
        type: "value",
        name: "Loss (AUD)",
        axisLabel: { formatter: (v) => currency(v).replace(".00", "") },
      },
      {
        type: "value",
        name: "Reports",
        position: "right",
      },
    ],
    series: [
      {
        name: "Reports",
        type: "bar",
        yAxisIndex: 1,
        itemStyle: { color: COLORS.primary },
        data: monthly.map((x) => x.count),
      },
      {
        name: "Loss (AUD)",
        type: "line",
        smooth: true,
        itemStyle: { color: COLORS.red },
        data: monthly.map((x) => x.loss),
      },
    ],
  };

  const stateOpt = {
    tooltip: { trigger: "item" },
    grid: { left: 70, right: 40, bottom: 40, top: 20 },
    xAxis: { type: "category", data: byState.map(x => x.code) },
    yAxis: [{ type: "value", name: "Reports" }],
    series: [{
      type: "bar",
      itemStyle: { color: COLORS.gold },
      data: byState.map(x => x.reports)
    }]
  };

  // Event handlers
  const onStateClick = p => setFilters(f => ({ ...f, state: p.name }));

  // Simple export function
  function exportCSV() {
    const headers = ["month","state_code","contact_method","gender","amount_lost_aud","report_count"];
    const lines = [headers.join(",")].concat(
        data.slice(0, 100).map(r => headers.map(h => r[h] || "").join(","))
    );
    const blob = new Blob([lines.join("\n")], {type:"text/csv;charset=utf-8"});
    const a = document.createElement("a"); 
    a.href = URL.createObjectURL(blob);
    a.download = "job_scam_data.csv"; 
    a.click(); 
    URL.revokeObjectURL(a.href);
  }

  if (isLoading) {
    return (
      <div id="trends-page" className="page active">
        <div className="page-content-wrapper">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '60vh',
            flexDirection: 'column',
            gap: '20px'
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #012169',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            <p style={{ color: '#666', fontSize: '16px' }}>Loading job scam data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="trends-page" className="page active">
      <div className="page-content-wrapper">
        <div style={{ padding: 24 }}>
          {/* Simple Header */}
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: '700', color: '#012169' }}>
              Job Scam Analytics
            </h2>
            <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
              Analysis of employment-related fraud data across all years
            </p>
          </div>

          {/* Simple View Toggle */}
          <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
            <button 
              className={`pill ${viewMode === 'overview' ? 'active' : ''}`}
              onClick={() => setViewMode('overview')}
              style={{ 
                padding: '8px 16px', 
                border: '2px solid #012169', 
                background: viewMode === 'overview' ? '#012169' : 'transparent',
                color: viewMode === 'overview' ? 'white' : '#012169',
                borderRadius: '20px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              📋 Data Table
            </button>
            <button 
              className={`pill ${viewMode === 'charts' ? 'active' : ''}`}
              onClick={() => setViewMode('charts')}
              style={{ 
                padding: '8px 16px', 
                border: '2px solid #012169', 
                background: viewMode === 'charts' ? '#012169' : 'transparent',
                color: viewMode === 'charts' ? 'white' : '#012169',
                borderRadius: '20px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              📊 Charts
            </button>
          </div>

          {/* Simple Filters */}
          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", marginBottom: 20 }}>
            <Select label="Year" value={filters.year} onChange={v => setFilters(f => ({...f, year: v}))} options={years}/>
            <Select label="State" value={filters.state} onChange={v => setFilters(f => ({...f, state: v}))} options={states}/>
            <Select label="Contact" value={filters.contact} onChange={v => setFilters(f => ({...f, contact: v}))} options={contacts}/>
            <Select label="Gender" value={filters.gender} onChange={v => setFilters(f => ({...f, gender: v}))} options={genders}/>
            <button onClick={() => setFilters({ year:"All",state:"All",contact:"All",gender:"All" })}>Clear All</button>
            <button onClick={exportCSV}>Export CSV</button>
          </div>

          {/* Simple KPIs */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 20 }}>
            <KPI title="Total Loss" value={totalLoss}/>
            <KPI title="Total Reports" value={totalReports}/>
            <KPI title="Avg Loss/Report" value={avgLossPerReport}/>
            <KPI title="Records" value={totalRecords}/>
          </div>

          {/* Content */}
          {viewMode === 'charts' ? (
            <>
              <Card title="Monthly Job Scam Trends">
                <ReactECharts style={{ height: 300 }} option={monthlyOpt} />
              </Card>
              <Card title="State Distribution (click to filter)">
                <ReactECharts style={{ height: 300 }} option={stateOpt} onEvents={{ click: onStateClick }} />
              </Card>
            </>
          ) : (
            <Card title={`Job Scam Data (${data.length} records)`}>
              <p style={{ margin: "4px 0 12px", color: "#666", fontSize: 14 }}>
                Showing {startIndex + 1}-{Math.min(endIndex, data.length)} of {data.length} records.
              </p>
              
              <div style={{ overflowX: 'auto', maxHeight: '400px', overflowY: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                  <thead style={{ background: '#f8f9fa', position: 'sticky', top: 0 }}>
                    <tr>
                      <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Month</th>
                      <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>State</th>
                      <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Contact</th>
                      <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Gender</th>
                      <th style={{ padding: '8px', textAlign: 'right', borderBottom: '1px solid #dee2e6' }}>Loss</th>
                      <th style={{ padding: '8px', textAlign: 'right', borderBottom: '1px solid #dee2e6' }}>Reports</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.map((row, index) => (
                      <tr key={startIndex + index} style={{ borderBottom: '1px solid #dee2e6' }}>
                        <td style={{ padding: '8px' }}>{row.month ? prettyMonth(row.month) : 'N/A'}</td>
                        <td style={{ padding: '8px' }}>{row.state_code || 'N/A'}</td>
                        <td style={{ padding: '8px' }}>{row.contact_method || 'N/A'}</td>
                        <td style={{ padding: '8px' }}>{row.gender || 'N/A'}</td>
                        <td style={{ padding: '8px', textAlign: 'right' }}>{currency(row.amount_lost_aud)}</td>
                        <td style={{ padding: '8px', textAlign: 'right' }}>{row.report_count?.toLocaleString() || '0'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {data.length > ITEMS_PER_PAGE && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    Page {currentPage} of {totalPages}
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      style={{ padding: '4px 8px', fontSize: '12px' }}
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      style={{ padding: '4px 8px', fontSize: '12px' }}
                    >
                      Next
                    </button>
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