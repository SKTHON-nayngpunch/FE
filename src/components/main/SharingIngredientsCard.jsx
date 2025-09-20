import React from 'react';
import onionImage from '@images/onion.png';
import usersIcon from '@images/users-icon.svg';
import './SharingIngredientsCard.css';

const SharingIngredientsCard = ({ 
  ingredientName = "양파", 
  freshness = "8/10", 
  currentMembers = 3, 
  totalMembers = 4,
  onApply 
}) => {
  return (
    <div className="sharing-ingredients-card">
      <div className="ingredient-image">
        <img src={onionImage} alt={ingredientName} />
      </div>
      <div className="ingredient-name">{ingredientName}</div>
      <div className="freshness">신선도: {freshness}</div>
      <div className="members-info">
        <img src={usersIcon} alt="사용자 아이콘" className="users-icon" />
        <span className="member-count">모집 인원 {currentMembers}/{totalMembers}</span>
      </div>
      <button className="apply-button" onClick={onApply}>
        신청
      </button>
    </div>
  );
};

export default SharingIngredientsCard;
