import React from 'react';
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import './CarbonFootprint.css';

const CarbonFootprint = ({ myShareCount = 5, receivedShareCount = 5 }) => {
  // 탄소발자국 데이터 (피그마 곡선을 따라가는 데이터)
  const data = [
    { name: '1', value: 20 },
    { name: '2', value: 15 },
    { name: '3', value: 25 },
    { name: '4', value: 35 },
    { name: '5', value: 45 },
    { name: '6', value: 55 },
    { name: '7', value: 50 },
    { name: '8', value: 60 },
    { name: '9', value: 70 },
    { name: '10', value: 65 },
    { name: '11', value: 75 },
    { name: '12', value: 85 },
  ];

  return (
    <div className="carbon-footprint-container">
      <div className="carbon-content">
        {/* 구분선 */}
        <div className="divider"></div>

        {/* 탄소발자국 제목 */}
        <div className="carbon-title">
          지금까지 <br />
          내가 줄인 <span className="highlight-text">탄소발자국</span>
        </div>


        {/* 차트 영역 */}
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={90}>
            <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="carbonGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(27, 151, 104, 0.8)" />
                  <stop offset="100%" stopColor="rgba(27, 151, 104, 0.1)" />
                </linearGradient>
              </defs>
              <XAxis hide />
              <YAxis hide />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#1B9768"
                strokeWidth={2}
                fill="url(#carbonGradient)"
                dot={false}
                connectNulls={true}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* 하단 정보 영역: 나눔 통계와 탄소발자국 값을 같은 레이어에 배치 */}
        <div className="bottom-info">
          <div className="sharing-stats">
            <div className="stat-item">
              <span className="stat-label">나의 나눔 횟수:</span>
              <span className="stat-value">{myShareCount}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">나눔 받은 횟수:</span>
              <span className="stat-value">{receivedShareCount}</span>
            </div>
          </div>
          <div className="carbon-value">750g</div>
        </div>
      </div>
    </div>
  );
};

export default CarbonFootprint;
