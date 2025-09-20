// src/lib/loadKakao.js

let kakaoLoadingPromise = null;

export function loadKakaoSdk() {
  if (window.kakao?.maps) return Promise.resolve(window.kakao);

  if (!kakaoLoadingPromise) {
    const appKey =
      import.meta.env.VITE_KAKAO_MAP_APP_KEY ||
      '507ebe5ec85aa4a46e739d374c95dd0';
    const libs = ['services', 'clusterer', 'drawing']; // 필요 라이브러리 선택
    console.log('카카오맵 앱키:', appKey); // 🔍 1) 키 값 확인
    const script = document.createElement('script');
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false&libraries=${libs.join(',')}`;
    console.log('카카오맵 SDK URL:', script.src); // 🔍 2) 요청 URL 확인
    script.async = true;

    kakaoLoadingPromise = new Promise((resolve, reject) => {
      script.onload = () => {
        window.kakao.maps.load(() => resolve(window.kakao));
      };
      script.onerror = (e) => reject(new Error('Kakao SDK load failed'));
    });

    document.head.appendChild(script);
  }

  return kakaoLoadingPromise;
}
