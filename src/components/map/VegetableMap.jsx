import { useEffect, useRef } from 'react';
import { loadKakaoSdk } from '../../lib/loadKakao';
import {
  createVegetableMarkerContent,
  createVegetableInfoContent,
} from './VegetableMarker';
import styles from './VegetableMap.module.css';

export default function VegetableMap({
  center = { lat: 37.5665, lng: 126.978 },
  level = 5,
  vegetables = [], // 채소 나눔 데이터 배열
  onMarkerClick,
  className,
  style,
}) {
  const mapRef = useRef(null);
  const mapObjRef = useRef(null);
  const markersRef = useRef([]); // 마커들을 저장할 배열
  const infoWindowRef = useRef(null); // 현재 열린 인포윈도우

  useEffect(() => {
    let mounted = true;

    loadKakaoSdk().then((kakao) => {
      if (!mounted || !mapRef.current) return;

      const options = {
        center: new kakao.maps.LatLng(center.lat, center.lng),
        level,
      };

      const map = new kakao.maps.Map(mapRef.current, options);
      mapObjRef.current = map;
    });

    return () => {
      mounted = false;
    };
  }, []);

  // 채소 데이터가 변경될 때마다 마커 업데이트
  useEffect(() => {
    const map = mapObjRef.current;
    if (!map || !window.kakao?.maps) return;

    const kakao = window.kakao;

    // 기존 마커들 제거
    markersRef.current.forEach((marker) => {
      marker.setMap(null);
    });
    markersRef.current = [];

    // 인포윈도우 닫기
    if (infoWindowRef.current) {
      infoWindowRef.current.close();
    }

    // 새로운 마커들 생성
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

      console.log('마커 HTML 콘텐츠:', markerContent);

      // 커스텀 마커 생성
      const customOverlay = new kakao.maps.CustomOverlay({
        position: position,
        content: markerContent,
        yAnchor: 1, // 마커의 y축 기준점 (1은 하단)
        xAnchor: 0.5, // 마커의 x축 기준점 (0.5는 중앙)
      });

      customOverlay.setMap(map);
      console.log(`✅ 마커 ${index + 1} 지도에 추가됨`);

      // 마커 클릭 이벤트 - setTimeout으로 DOM 요소가 렌더링된 후 이벤트 추가
      setTimeout(() => {
        const markerElement = customOverlay.getContent();
        if (
          markerElement &&
          typeof markerElement.addEventListener === 'function'
        ) {
          markerElement.addEventListener('click', () => {
            // 기존 인포윈도우 닫기
            if (infoWindowRef.current) {
              infoWindowRef.current.close();
            }

            // 새로운 인포윈도우 생성
            const infoWindow = new kakao.maps.InfoWindow({
              content: createVegetableInfoContent(vegetable),
              removable: true, // X 버튼으로 닫을 수 있음
            });

            infoWindow.open(map, customOverlay);
            infoWindowRef.current = infoWindow;

            // 부모 컴포넌트에 클릭 이벤트 전달
            if (onMarkerClick) {
              onMarkerClick(vegetable);
            }

            // 지도 중심을 마커 위치로 이동 (부드럽게)
            map.panTo(position);
          });
        }
      }, 100);

      markersRef.current.push(customOverlay);
    });
  }, [vegetables, onMarkerClick]);

  // center/level 변경 시 지도 업데이트
  useEffect(() => {
    const map = mapObjRef.current;
    if (!map || !window.kakao?.maps) return;

    const kakao = window.kakao;
    map.setLevel(level);
    map.panTo(new kakao.maps.LatLng(center.lat, center.lng));
  }, [center.lat, center.lng, level]);

  return (
    <div
      ref={mapRef}
      className={`${styles.mapContainer} ${className || ''}`}
      style={style}
    />
  );
}
