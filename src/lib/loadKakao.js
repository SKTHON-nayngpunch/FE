// src/lib/loadKakao.js

let kakaoLoadingPromise = null;

export function loadKakaoSdk() {
  // 이미 로드된 경우
  if (window.kakao?.maps) {
    console.log('✅ 카카오맵 SDK 이미 로드됨');
    return Promise.resolve(window.kakao);
  }

  if (!kakaoLoadingPromise) {
    const appKey =
      import.meta.env.VITE_KAKAO_MAP_APP_KEY ||
      '507ebe5ec85aa4a46e739d374c95dd0';
    const libs = ['services', 'clusterer', 'drawing'];
    console.log('🔑 카카오맵 앱키:', appKey);

    const script = document.createElement('script');
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false&libraries=${libs.join(',')}`;
    script.async = true;
    console.log('📡 카카오맵 SDK 로딩 시작:', script.src);

    kakaoLoadingPromise = new Promise((resolve, reject) => {
      // 타임아웃 설정 (10초)
      const timeout = setTimeout(() => {
        reject(new Error('카카오맵 SDK 로드 타임아웃 (10초)'));
      }, 10000);

      script.onload = () => {
        clearTimeout(timeout);
        console.log('📦 카카오맵 SDK 스크립트 로드 완료');

        if (window.kakao?.maps) {
          window.kakao.maps.load(() => {
            console.log('✅ 카카오맵 라이브러리 초기화 완료');
            resolve(window.kakao);
          });
        } else {
          reject(new Error('카카오맵 객체를 찾을 수 없습니다'));
        }
      };

      script.onerror = (error) => {
        clearTimeout(timeout);
        console.error('❌ 카카오맵 SDK 스크립트 로드 실패:', error);
        reject(new Error('카카오맵 SDK 스크립트 로드 실패'));
      };
    });

    document.head.appendChild(script);
  }

  return kakaoLoadingPromise;
}

// SDK 로드 상태 초기화 함수 (개발 중 디버깅용)
export function resetKakaoSdk() {
  kakaoLoadingPromise = null;
  console.log('🔄 카카오맵 SDK 상태 초기화');
}
