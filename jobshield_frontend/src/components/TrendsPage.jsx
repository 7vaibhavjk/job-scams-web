import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function TrendsPage({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('states');

  const stateData = [
    {
      state: 'Australian Capital Territory',
      reports: '2,607',
      amount: '$1,205,562.07'
    },
    {
      state: 'New South Wales',
      reports: '25,379',
      amount: '$48,672,876.72'
    },
    {
      state: 'Northern Territory',
      reports: '545',
      amount: '$850,187.09'
    },
    {
      state: 'Queensland',
      reports: '17,070',
      amount: '$27,882,590.77'
    },
    {
      state: 'South Australia',
      reports: '6,027',
      amount: '$5,990,647.16'
    },
    {
      state: 'Tasmania',
      reports: '1,771',
      amount: '$1,328,174.66'
    },
    {
      state: 'Victoria',
      reports: '20,115',
      amount: '$28,029,645.94'
    },
    {
      state: 'Western Australia',
      reports: '8,791',
      amount: '$20,726,006.97'
    }
  ];

  const monthlyData = [
    { month: 'Jan 25', reports: 19137, amount: 36595249.46 },
    { month: 'Feb 25', reports: 17394, amount: 28772516.71 },
    { month: 'Mar 25', reports: 19225, amount: 27058640.58 },
    { month: 'Apr 25', reports: 16474, amount: 26453182.45 },
    { month: 'May 25', reports: 17878, amount: 28366511.02 }
  ];

  const chartData = {
    labels: monthlyData.map(item => item.month),
    datasets: [
      {
        type: 'bar',
        label: 'Number of Reports',
        data: monthlyData.map(item => item.reports),
        backgroundColor: '#012169',
        yAxisID: 'y',
        order: 2
      },
      {
        type: 'line',
        label: 'Amount Lost (Million AUD)',
        data: monthlyData.map(item => item.amount / 1000000),
        borderColor: '#E4002B',
        backgroundColor: 'rgba(228, 0, 43, 0.1)',
        fill: true,
        yAxisID: 'y1',
        order: 1,
        tension: 0.3
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Monthly Job Scam Reports and Loss Trends 2025',
        font: {
          size: 16
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.dataset.yAxisID === 'y1') {
              label += `$${(context.raw * 1000000 / 1000000).toFixed(1)}M`;
            } else {
              label += context.raw.toLocaleString();
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Number of Reports'
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Amount Lost (Million AUD)'
        },
        grid: {
          drawOnChartArea: false
        }
      }
    }
  };

  return (
    <div id="trends-page" className="page active">
      <section className="section">
        <div className="container">
          <a 
            href="#" 
            className="back-btn" 
            onClick={(e) => {
              e.preventDefault();
              onNavigate('home');
            }}
          >
            <i className="fas fa-arrow-left"></i> Back to Home
          </a>

          <h2 className="section-title">Australian Job Scam Trends Analysis</h2>
          <p className="section-subtitle">Based on official data from the Australian Competition and Consumer Commission (ACCC) and Scamwatch</p>

          <div className="tab-container">
            <div 
              className={`tab ${activeTab === 'states' ? 'active' : ''}`}
              onClick={() => setActiveTab('states')}
            >
              State Data
            </div>
            <div 
              className={`tab ${activeTab === 'monthly' ? 'active' : ''}`}
              onClick={() => setActiveTab('monthly')}
            >
              Monthly Trends
            </div>
          </div>

          {activeTab === 'states' && (
            <div className="tab-content active">
              <div className="card">
                <h3 className="card-title"><i className="fas fa-map-marked-alt"></i> Job Scam Reports and Losses by State (2025 Data)</h3>
                <p>The following data shows the distribution of job scam reports and financial losses across Australian states in 2025</p>

                <div className="state-cards">
                  {stateData.map((state, index) => (
                    <div key={index} className="state-card">
                      <div className="state-name">{state.state}</div>
                      <div className="state-data">
                        <div className="data-item">
                          <div className="data-value">{state.reports}</div>
                          <div className="data-label">Reports</div>
                        </div>
                        <div className="data-item">
                          <div className="data-value">{state.amount}</div>
                          <div className="data-label">Amount Lost</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <p className="data-source">Data source: Scamwatch.gov.au | Filters: Address State not equal to Outside of Australia or Unspecified, MonthName equal to 2025</p>
              </div>
            </div>
          )}

          {activeTab === 'monthly' && (
            <div className="tab-content active">
              <div className="card">
                <h3 className="card-title"><i className="fas fa-chart-line"></i> Monthly Job Scam Trends 2025</h3>
                <p>The following data shows the monthly trends of job scam reports and financial losses in 2025</p>

                <div className="chart-container">
                  <Chart type="bar" data={chartData} options={chartOptions} />
                </div>

                <p className="data-source">Data source: Scamwatch.gov.au | Filters: MonthName equal to 2025</p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default TrendsPage;