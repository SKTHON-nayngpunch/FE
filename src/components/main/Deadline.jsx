import React from 'react';
import { useNavigate } from 'react-router-dom';
import SharingIngredientsCard from './SharingIngredientsCard';
import styles from './Deadline.module.css';

import image1 from '@assets/images/main/image1.png';
import image2 from '@assets/images/main/image2.png';
import image3 from '@assets/images/main/image3.png';

const Deadline = () => {
  const navigate = useNavigate();

  // 카드 클릭 핸들러
  const handleCardClick = (id) => {
    navigate(`/detail/${id}`);
  };

  // 마감임박 카드 데이터
  const urgentCards = [
    {
      id: 1,
      registrationDate: '2025/09/20',
      title: '브로콜리 10개 남았어요~ 세척해서 빨리 먹어야 해요',
      ingredientName: '브로콜리',
      freshness: 8,
      maxFreshness: 10,
      currentMembers: 3,
      totalMembers: 4,
      location: '정릉동',
      remainingTime: { hours: 17, minutes: 38 },
      imageUrl: image1, // 실제 이미지 URL로 교체 가능
    },
    {
      id: 2,
      registrationDate: '2025/09/20',
      title: '양배추 볶음 해먹고 너무 많이 남았어요ㅠㅠ',
      ingredientName: '양배추',
      freshness: 8,
      maxFreshness: 10,
      currentMembers: 3,
      totalMembers: 4,
      location: '정릉동',
      remainingTime: { hours: 17, minutes: 38 },
      imageUrl: image2,
    },
    {
      id: 3,
      registrationDate: '2025/09/20',
      title: '당근이 넘 많아염 나눔 합니다',
      ingredientName: '당근',
      freshness: 8,
      maxFreshness: 10,
      currentMembers: 3,
      totalMembers: 4,
      location: '정릉동',
      remainingTime: { hours: 17, minutes: 38 },
      imageUrl: image3,
    },
  ];

  return (
    <div className={styles.deadlineSection}>
      <h2 className={styles.deadlineTitle}>마감임박</h2>
      <div className={styles.deadlineCardsContainer}>
        {urgentCards.map((card) => (
          <SharingIngredientsCard
            key={card.id}
            registrationDate={card.registrationDate}
            title={card.title}
            ingredientName={card.ingredientName}
            freshness={card.freshness}
            maxFreshness={card.maxFreshness}
            currentMembers={card.currentMembers}
            totalMembers={card.totalMembers}
            location={card.location}
            remainingTime={card.remainingTime}
            imageUrl={card.imageUrl}
            onClick={() => handleCardClick(card.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default Deadline;
