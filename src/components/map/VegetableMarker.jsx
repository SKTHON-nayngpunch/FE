import React from 'react';
import { VEGETABLE_ICONS } from '../../data/vegetableIcons';
import styles from './VegetableMarker.module.css';
// 커스텀 마커 HTML을 생성하는 함수
export const createVegetableMarkerContent = (item, current, limit) => {
  const icon = VEGETABLE_ICONS[item] || '🥬'; // 기본값
  const isFull = current >= limit;
  const participationRate = ((current / limit) * 100).toFixed(0);

  // HTML 문자열에서는 CSS 모듈이 작동하지 않으므로 인라인 스타일 사용
  return `
    <div style="
      position: relative;
      background: white;
      border: 3px solid ${isFull ? '#ff6b6b' : '#51cf66'};
      border-radius: 50%;
      width: 60px;
      height: 60px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      cursor: pointer;
      transition: transform 0.2s ease;
    " onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
      <div style="font-size: 20px; line-height: 1;">${icon}</div>
      <div style="
        font-size: 10px; 
        font-weight: bold; 
        color: ${isFull ? '#ff6b6b' : '#51cf66'};
        line-height: 1;
        margin-top: 2px;
      ">${current}/${limit}</div>
      ${
        isFull
          ? `
        <div style="
          position: absolute;
          top: -8px;
          right: -8px;
          background: #ff6b6b;
          color: white;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: bold;
        ">!</div>
      `
          : ''
      }
    </div>
  `;
};

// 인포윈도우 내용을 생성하는 함수
export const createVegetableInfoContent = (data) => {
  const icon = VEGETABLE_ICONS[data.item] || '🥬';
  const isFull = data.current >= data.limit;
  const participationRate = ((data.current / data.limit) * 100).toFixed(0);

  return `
    <div style="
      padding: 16px;
      min-width: 200px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    ">
      <div style="
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 12px;
      ">
        <div style="font-size: 32px;">${icon}</div>
        <div>
          <h3 style="margin: 0; font-size: 18px; color: #333;">${data.item} 나눔</h3>
          <p style="margin: 4px 0 0 0; font-size: 14px; color: #666;">
            ID: ${data.id}
          </p>
        </div>
      </div>
      
      <div style="
        background: ${isFull ? '#ffe0e0' : '#e8f5e8'};
        border-radius: 8px;
        padding: 12px;
        margin-bottom: 12px;
      ">
        <div style="
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        ">
          <span style="font-weight: bold; color: #333;">참여 현황</span>
          <span style="
            background: ${isFull ? '#ff6b6b' : '#51cf66'};
            color: white;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: bold;
          ">${participationRate}%</span>
        </div>
        
        <div style="
          display: flex;
          align-items: center;
          gap: 8px;
        ">
          <div style="
            flex: 1;
            height: 8px;
            background: #f0f0f0;
            border-radius: 4px;
            overflow: hidden;
          ">
            <div style="
              width: ${participationRate}%;
              height: 100%;
              background: ${isFull ? '#ff6b6b' : '#51cf66'};
              transition: width 0.3s ease;
            "></div>
          </div>
          <span style="
            font-weight: bold;
            color: ${isFull ? '#ff6b6b' : '#51cf66'};
            font-size: 14px;
          ">${data.current}/${data.limit}명</span>
        </div>
      </div>
      
      ${
        isFull
          ? `
        <div style="
          background: #ff6b6b;
          color: white;
          padding: 8px;
          border-radius: 6px;
          text-align: center;
          font-size: 14px;
          font-weight: bold;
        ">
          🔥 마감된 나눔입니다
        </div>
      `
          : `
        <button style="
          width: 100%;
          background: #51cf66;
          color: white;
          border: none;
          padding: 12px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: bold;
          cursor: pointer;
          transition: background-color 0.2s ease;
        " onmouseover="this.style.backgroundColor='#40c057'" onmouseout="this.style.backgroundColor='#51cf66'">
          🙋‍♀️ 나눔 참여하기
        </button>
      `
      }
    </div>
  `;
};

export default { createVegetableMarkerContent, createVegetableInfoContent };
