import { useEffect, useRef } from 'react';
import { loadKakaoSdk } from '../../lib/loadKakao';
import {
  createVegetableMarkerContent,
  createVegetableInfoContent,
} from './VegetableMarker';
import styles from './VegetableMap.module.css';

export default function VegetableMap({
  center = { lat: 37.615095, lng: 127.013111 }, // 서경대학교
  level = 3, // 더 확대된 기본값
  vegetables = [], // 채소 나눔 데이터 배열
  onMarkerClick,
  className,
  style,
}) {
  const mapRef = useRef(null);
  const mapObjRef = useRef(null);
  const markersRef = useRef([]); // 마커들을 저장할 배열
  const infoWindowRef = useRef(null); // 현재 열린 인포윈도우

  // 지도 초기화와 마커 생성을 통합
  useEffect(() => {
    let mounted = true;

    const initializeMap = async () => {
      try {
        const kakao = await loadKakaoSdk();
        if (!mounted || !mapRef.current) return;

        console.log('🗺️ 카카오맵 SDK 로드 완료');

        const options = {
          center: new kakao.maps.LatLng(center.lat, center.lng),
          level,
        };

        const map = new kakao.maps.Map(mapRef.current, options);
        mapObjRef.current = map;

        console.log('🗺️ 지도 초기화 완료');

        // 지도 초기화 완료 후 마커 생성
        createMarkers(map, kakao);
      } catch (error) {
        console.error('❌ 카카오맵 초기화 실패:', error);
      }
    };

    const createMarkers = (map, kakao) => {
      if (!vegetables || vegetables.length === 0) {
        console.log('📍 표시할 채소 데이터가 없습니다');
        return;
      }

      // 기존 마커들 제거
      markersRef.current.forEach((marker) => {
        marker.setMap(null);
      });
      markersRef.current = [];

      // 인포윈도우 닫기
      if (infoWindowRef.current) {
        infoWindowRef.current.close();
      }

      console.log('🗺️ 마커 생성 중:', vegetables.length, '개의 채소');

      vegetables.forEach((vegetable, index) => {
        console.log(
          `마커 ${index + 1}:`,
          vegetable.item,
          `(${vegetable.lat}, ${vegetable.lng})`
        );

        const position = new kakao.maps.LatLng(vegetable.lat, vegetable.lng);
        const markerContent = createVegetableMarkerContent(
          vegetable.item,
          vegetable.current,
          vegetable.limit
        );

        // 커스텀 마커 생성
        const customOverlay = new kakao.maps.CustomOverlay({
          position: position,
          content: markerContent,
          yAnchor: 1,
          xAnchor: 0.5,
        });

        customOverlay.setMap(map);
        console.log(`✅ 마커 ${index + 1} 지도에 추가됨`);

        // 마커 클릭 이벤트
        setTimeout(() => {
          const markerElement = customOverlay.getContent();
          if (
            markerElement &&
            typeof markerElement.addEventListener === 'function'
          ) {
            markerElement.addEventListener('click', () => {
              if (infoWindowRef.current) {
                infoWindowRef.current.close();
              }

              const infoWindow = new kakao.maps.InfoWindow({
                content: createVegetableInfoContent(vegetable),
                removable: true,
              });

              infoWindow.open(map, customOverlay);
              infoWindowRef.current = infoWindow;

              if (onMarkerClick) {
                onMarkerClick(vegetable);
              }

              map.panTo(position);
            });
          }
        }, 100);

        markersRef.current.push(customOverlay);
      });
    };

    initializeMap();

    return () => {
      mounted = false;
    };
  }, [vegetables, center.lat, center.lng, level, onMarkerClick]);

  return (
    <div
      ref={mapRef}
      className={`${styles.mapContainer} ${className || ''}`}
      style={style}
    />
  );
}
