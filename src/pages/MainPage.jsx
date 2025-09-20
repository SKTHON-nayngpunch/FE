import React, { useState, useEffect } from 'react';
import Header from '@components/main/header/Header';
import styles from '@components/main/MainPage.module.css';
import Deadline from '@components/main/Deadline';
import CarbonFootprint from '@components/main/CarbonFootprint';
import { APIService } from '@apis/axios';

export default function MainPage() {
  const [userStats, setUserStats] = useState({
    chanceCount: 0,
    shareCount: 0,
    receiveCount: 0,
    carbonCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        setLoading(true);
        const response = await APIService.private.get('/api/users/result');
        
        if (response.success && response.data) {
          setUserStats({
            chanceCount: response.data.chanceCount || 0,
            shareCount: response.data.shareCount || 0,
            receiveCount: response.data.receiveCount || 0,
            carbonCount: response.data.carbonCount || 0
          });
        }
      } catch (err) {
        console.error('사용자 통계 조회 실패:', err);
        setError('사용자 통계를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserStats();
  }, []);

  return (
    <>
      <div className={styles.mainPage}>
        <Header />
        <CarbonFootprint 
          myShareCount={userStats.shareCount}
          receivedShareCount={userStats.receiveCount}
          chanceCount={userStats.chanceCount}
          carbonCount={userStats.carbonCount}
        />
        <Deadline />
      </div>
    </>
  );
}
