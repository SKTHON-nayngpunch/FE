// 토큰 관리 유틸리티 함수들

const TOKEN_KEY = 'ACCESS_TOKEN';

// 쿠키에서 토큰 가져오는 함수
const getCookie = (name) => {
  if (!document.cookie || document.cookie.trim() === "") {
    return null;
  }

  try {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    
    if (parts.length === 2) {
      const cookieValue = parts.pop().split(";").shift();
      if (cookieValue) {
        return decodeURIComponent(cookieValue);
      }
    }
  } catch (e) {
    console.error(`쿠키 ${name} 읽기 실패:`, e);
  }
  
  return null;
};

// 쿠키에 토큰 저장하는 함수
const setCookie = (name, value, days = 7) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  const expiresString = expires.toUTCString();
  
  // 쿠키 설정 (HttpOnly는 클라이언트에서 설정 불가, Secure는 HTTPS에서만)
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expiresString}; path=/; SameSite=Lax`;
  
  console.log(`🍪 쿠키 저장: ${name} = ${value.substring(0, 20)}...`);
};

// 토큰 저장 (쿠키 우선, localStorage 대안)
export const setToken = (token) => {
  if (token) {
    // 1. 쿠키에 저장
    setCookie(TOKEN_KEY, token);
    
    // 2. localStorage에도 저장 (호환성을 위해 유지)
    localStorage.setItem(TOKEN_KEY, token);
    
    console.log('✅ 토큰 저장 완료:', token.substring(0, 20) + '...');
  }
};

// 토큰 가져오기 (쿠키 우선, localStorage 대안)
export const getToken = () => {
  // 1. 쿠키에서 먼저 확인
  const cookieToken = getCookie(TOKEN_KEY);
  if (cookieToken) {
    return cookieToken;
  }
  
  // 2. localStorage에서 확인 (대안)
  return localStorage.getItem(TOKEN_KEY);
};

// 토큰 삭제
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  // 쿠키도 삭제 시도
  document.cookie = `${TOKEN_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

// 토큰 존재 여부 확인 (쿠키 또는 localStorage)
export const hasToken = () => {
  const token = getToken();
  console.log('🔍 hasToken 체크:', {
    cookieToken: !!getCookie(TOKEN_KEY),
    localStorageToken: !!localStorage.getItem(TOKEN_KEY),
    finalResult: !!token
  });
  return !!token;
};

// Authorization 헤더 생성
export const getAuthHeader = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};
