import React, { useState } from 'react';
import './SharingIngredientsCard.css';

export default function SharingIngredientsCard({
  registrationDate,
  title,
  ingredientName,
  freshness,
  maxFreshness,
  currentMembers,
  totalMembers,
  location,
  remainingTime,
  imageUrl,
}) {
  return (
    <div className="sharing-ingredients-card">
      {/* 왼쪽 이미지 영역 */}
      <div className="image-section">
        <div className="ingredient-image-container">
          {imageUrl ? (
            <img src={imageUrl} alt={ingredientName} className="ingredient-image" />
          ) : (
            <div className="ingredient-image-placeholder"></div>
          )}
        </div>
      </div>
      
      {/* 가운데 텍스트 영역 */}
      <div className="text-section">
        <div className="card-content">
          {/* 등록날짜와 위치 */}
          <div className="card-header">
            <span className="registration-date">등록날짜: {registrationDate}</span>
            <div className="location">
              <img src="/src/assets/images/main/pin.png" alt="위치" className="location-icon" />
              <span className="location-text">{location}</span>
            </div>
          </div>
          
          {/* 제목 */}
          <div className="card-title">{title}</div>
          
          {/* 재료명 */}
          <div className="ingredient-name">{ingredientName}</div>
          
          {/* 신선도와 모집인원 */}
          <div className="card-info">
            <span className="freshness">신선도: {freshness} / {maxFreshness}</span>
            <span className="members">모집인원: {currentMembers}/{totalMembers}</span>
          </div>
        </div>
        
        {/* 남은 시간 표시 */}
        <div className="remaining-time-badge">
          <span className="remaining-time-text">
            남은 시간 : {remainingTime.hours}시간 {remainingTime.minutes}분
          </span>
        </div>
      </div>
    </div>
  );
};