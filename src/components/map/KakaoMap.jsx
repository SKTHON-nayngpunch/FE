import { useEffect, useRef } from 'react';
import { loadKakaoSdk } from '../../lib/loadKakao';

export default function KakaoMap({
  center = { lat: 37.615095, lng: 127.013111 }, // 서경대학교
  level = 3, // 확대레벨(작을수록 더 확대) - 더 확대된 기본값
  onReady, // kakao, map 인스턴스 넘겨줌
  className,
  style,
}) {
  const mapRef = useRef(null);
  const mapObjRef = useRef(null);

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

      onReady?.(kakao, map);
    });

    return () => {
      mounted = false;
    };
  }, []); // 최초 1회만 생성

  // center/level을 외부 props로 바꾸면 map.panTo 등으로 갱신하고 싶다면 아래처럼:
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
      className={className}
      style={{ width: '100%', height: '400px', ...style }}
    />
  );
}
