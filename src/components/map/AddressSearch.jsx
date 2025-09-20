import { useEffect, useRef, useState } from 'react';
import { loadKakaoSdk } from '../../lib/loadKakao';

export default function AddressSearch({ onSelect }) {
  const [text, setText] = useState('');
  const geocoderRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    loadKakaoSdk().then((kakao) => {
      if (!mounted) return;
      geocoderRef.current = new kakao.maps.services.Geocoder();
    });
    return () => {
      mounted = false;
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const geocoder = geocoderRef.current;
    if (!geocoder) return;

    geocoder.addressSearch(text, (result, status) => {
      const { kakao } = window;
      if (status === kakao.maps.services.Status.OK && result[0]) {
        const { x, y, address_name } = result[0];
        onSelect?.({
          lat: parseFloat(y),
          lng: parseFloat(x),
          address: address_name,
        });
      } else {
        alert('주소를 찾을 수 없어요. (도로명/지번 형태로 시도해보세요)');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8 }}>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="예) 서울특별시 중구 세종대로 110"
        style={{ flex: 1, padding: '8px 12px' }}
      />
      <button type="submit">검색</button>
    </form>
  );
}
