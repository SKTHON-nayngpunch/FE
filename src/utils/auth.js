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

// 토큰 저장 (localStorage 방식 - 호환성을 위해 유지)
export const setToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
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
