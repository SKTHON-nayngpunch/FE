import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import APIService from '@apis/axios';
import styles from './SearchPage.module.css';
import SharingIngredientsCard from '@components/main/SharingIngredientsCard';
import logo from '@assets/images/logo.svg';

export default function SearchPage() {
  const navigate = useNavigate();

  // 상태 관리
  const [keyword, setKeyword] = useState('');
  const [sortType, setSortType] = useState('deadline'); // 'deadline' | 'freshness'
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

    // remainingSeconds를 시간과 분으로 변환하는 함수
  const convertSecondsToTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return { hours, minutes };
  };

  // 검색 실행
  const handleSearch = async () => {
    if (!keyword.trim()) {
      setError('검색어를 입력해주세요.');
      return;
    }

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const response = await APIService.private.get('/api/foods/search', {
        params: {
          keyword: keyword.trim(),
          sort: sortType === 'deadline' ? 'deadline' : 'freshness', // API가 기대하는 값으로 매핑
        },
      });

      console.log('🔍 검색 API 응답 전체:', response);
      console.log('🔍 response.data (실제 API 응답):', response?.data);
      console.log('🔍 실제 API 응답 구조:');
      console.log('  - success:', response?.data?.success);
      console.log('  - code:', response?.data?.code);
      console.log('  - message:', response?.data?.message);
      console.log('  - data:', response?.data?.data);
      console.log('  - data 배열인가?:', Array.isArray(response?.data?.data));

      // API 응답에서 data 배열 추출 (response.data.data가 실제 배열)
      const results =
        response?.data?.data && Array.isArray(response.data.data)
          ? response.data.data
          : [];

      console.log('🔍 추출된 데이터:', results);
      console.log('🔍 데이터 개수:', results.length);
      setSearchResults(results);
    } catch (err) {
      console.error('검색 API 에러:', err);
      setError('검색 중 오류가 발생했습니다. 다시 시도해주세요.');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  // 정렬 토글
  const handleSortToggle = () => {
    const newSortType = sortType === 'deadline' ? 'freshness' : 'deadline';
    setSortType(newSortType);

    // 이미 검색한 상태라면 새로운 정렬로 다시 검색
    if (hasSearched && keyword.trim()) {
      setLoading(true);
      setError(null);

      APIService.private
        .get('/api/foods/search', {
          params: {
            keyword: keyword.trim(),
            sort: newSortType === 'deadline' ? 'deadline' : 'freshness', // API가 기대하는 값으로 매핑
          },
        })
        .then((response) => {
          console.log('🔄 정렬 변경 API 응답:', response);

          // API 응답에서 data 배열 추출 (response.data.data가 실제 배열)
          const results =
            response?.data?.data && Array.isArray(response.data.data)
              ? response.data.data
              : [];

          setSearchResults(results);
        })
        .catch((err) => {
          console.error('정렬 변경 API 에러:', err);
          setError('정렬 변경 중 오류가 발생했습니다.');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  // 엔터키로 검색
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // 카드 클릭 시 DetailPage로 이동
  const handleCardClick = (foodId) => {
    navigate(`/detail/${foodId}`);
  };

  // 뒤로가기
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className={styles.container}>
      {/* 헤더 */}

      {/* 검색 입력 영역 */}
      <div className={styles.searchSection}>
        <div className={styles.searchInputContainer}>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="찾고 싶은 식재료를 입력하세요"
            className={styles.searchInput}
          />
          <button
            onClick={handleSearch}
            className={styles.searchButton}
            disabled={loading}
          >
            {loading ? '검색중...' : '검색'}
          </button>
        </div>

        {/* 정렬 토글 */}
        <div className={styles.sortSection}>
          <span className={styles.sortLabel}>정렬 기준:</span>
          <button
            onClick={handleSortToggle}
            className={`${styles.sortToggle} ${styles[sortType]}`}
          >
            {sortType === 'deadline' ? '마감일 기준' : '신선도 기준'}
          </button>
        </div>
      </div>

      {/* 검색 결과 */}
      <div className={styles.resultsSection}>
        {loading && (
          <div className={styles.loadingContainer}>
            <div className={styles.logoContainer}>
              <img src={logo} alt="로고" className={styles.logo} />
            </div>
            <p>검색 중입니다...</p>
          </div>
        )}

        {error && (
          <div className={styles.errorContainer}>
            <p className={styles.errorMessage}>{error}</p>
            <button
              onClick={() => setError(null)}
              className={styles.retryButton}
            >
              다시 시도
            </button>
          </div>
        )}

        {!loading && !error && hasSearched && (
          <>
            <div className={styles.resultsHeader}>
              <span className={styles.resultsCount}>
                검색 결과: {searchResults.length}개
              </span>
            </div>

            {searchResults.length === 0 ? (
              <div className={styles.noResults}>
                <p>검색 결과가 없습니다.</p>
                <p>다른 키워드로 검색해보세요.</p>
              </div>
            ) : (
              <div className={styles.resultsGrid}>
                {(Array.isArray(searchResults) &&
                  searchResults.map((food) => (
                    <div
                      key={food.foodId}
                      onClick={() => handleCardClick(food.foodId)}
                    >
                      <SharingIngredientsCard
                        registrationDate={food.createdDate}
                        title={food.title}
                        ingredientName={food.name}
                        freshness={food.conditionScore}
                        maxFreshness={10}
                        currentMembers={food.currentMember}
                        totalMembers={food.maxMember}
                        location={food.location}
                        remainingTime={convertSecondsToTime(food.remainingSeconds)}
                        imageUrl={food.foodImageUrl}
                      />
                    </div>
                  ))) || <div>데이터를 불러올 수 없습니다.</div>}
              </div>
            )}
          </>
        )}

        {!hasSearched && (
          <div className={styles.initialState}>
            <div className={styles.logoContainer}>
              <img src={logo} alt="로고" className={styles.logo} />
            </div>
            <p>검색어를 입력하고 검색해보세요!</p>
          </div>
        )}
      </div>
    </div>
  );
}
