import axios from 'axios';

const getCookie = (name) => {
  // 디버깅을 위한 로그
  console.log(`🍪 [getCookie] ${name} 쿠키 찾는 중...`);
  console.log("🍪 [getCookie] 전체 쿠키:", document.cookie);

  if (!document.cookie || document.cookie.trim() === "") {
    console.log("🍪 [getCookie] 쿠키가 없습니다.");
    return null;
  }

  // 방법 1: 기본 방식
  try {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);

    if (parts.length === 2) {
      const cookieValue = parts.pop().split(";").shift();
      if (cookieValue) {
        const decoded = decodeURIComponent(cookieValue);
        console.log(
          `🍪 [getCookie] ${name} 찾음 (방법1):`,
          decoded.substring(0, 50) + "..."
        );
        return decoded;
      }
    }
  } catch (e) {
    console.log(`🍪 [getCookie] 방법1 실패:`, e);
  }

  // 방법 2: 정규식 방식
  try {
    const matches = document.cookie.match(
      new RegExp(`(?:^|; )${name}=([^;]*)`)
    );
    if (matches) {
      const decoded = decodeURIComponent(matches[1]);
      console.log(
        `🍪 [getCookie] ${name} 찾음 (방법2):`,
        decoded.substring(0, 50) + "..."
      );
      return decoded;
    }
  } catch (e) {
    console.log(`🍪 [getCookie] 방법2 실패:`, e);
  }

  // 방법 3: 모든 쿠키를 파싱해서 찾기
  try {
    const cookies = document.cookie.split(";").reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split("=");
      if (key && value) {
        acc[key.trim()] = value.trim();
      }
      return acc;
    }, {});

    console.log(`🍪 [getCookie] 파싱된 모든 쿠키:`, cookies);

    if (cookies[name]) {
      const decoded = decodeURIComponent(cookies[name]);
      console.log(
        `🍪 [getCookie] ${name} 찾음 (방법3):`,
        decoded.substring(0, 50) + "..."
      );
      return decoded;
    }
  } catch (e) {
    console.log(`🍪 [getCookie] 방법3 실패:`, e);
  }

  // 방법 4: 대소문자 구분 없이 찾기 (혹시 이름이 다를 경우)
  try {
    const cookies = document.cookie.split(";").reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split("=");
      if (key && value) {
        acc[key.trim().toLowerCase()] = {
          originalKey: key.trim(),
          value: value.trim(),
        };
      }
      return acc;
    }, {});

    const lowerName = name.toLowerCase();
    if (cookies[lowerName]) {
      const decoded = decodeURIComponent(cookies[lowerName].value);
      console.log(
        `🍪 [getCookie] ${name} 찾음 (방법4 - 대소문자무시):`,
        decoded.substring(0, 50) + "..."
      );
      console.log(
        `🍪 [getCookie] 원본 키 이름:`,
        cookies[lowerName].originalKey
      );
      return decoded;
    }
  } catch (e) {
    console.log(`🍪 [getCookie] 방법4 실패:`, e);
  }

  console.log(`🍪 [getCookie] ${name} 쿠키를 찾을 수 없습니다.`);
  return null;
};

/**
 * 현재 모든 쿠키를 콘솔에 출력하는 디버깅 함수
 */
const debugCookies = () => {
  console.log("=== 쿠키 디버깅 ===");
  console.log("Raw document.cookie:", document.cookie);
  console.log("Cookie length:", document.cookie.length);

  // 모든 쿠키를 파싱해서 보여주기
  const cookies = document.cookie.split(";").reduce((acc, cookie) => {
    const [name, value] = cookie.trim().split("=");
    if (name && value) {
      acc[name] = value;
    }
    return acc;
  }, {});

  console.log("Parsed cookies:", cookies);
  console.log("ACCESS_TOKEN:", getCookie("ACCESS_TOKEN"));
  console.log("REFRESH_TOKEN:", getCookie("REFRESH_TOKEN"));

  // 현재 도메인과 경로 확인
  console.log("Current domain:", window.location.hostname);
  console.log("Current path:", window.location.pathname);
  console.log("Current protocol:", window.location.protocol);
};

/**
 * 토큰 상태를 확인하는 함수 (디버깅용)
 */
export const checkTokenStatus = () => {
  const accessToken = getCookie("ACCESS_TOKEN");
  const refreshToken = getCookie("REFRESH_TOKEN");

  console.log("=== 토큰 상태 확인 ===");
  console.log("ACCESS_TOKEN 존재:", !!accessToken);
  console.log("REFRESH_TOKEN 존재:", !!refreshToken);

  if (accessToken) {
    try {
      // JWT 토큰 디코딩 (간단한 방법)
      const payload = JSON.parse(atob(accessToken.split(".")[1]));
      const now = Math.floor(Date.now() / 1000);
      console.log("ACCESS_TOKEN 만료 시간:", new Date(payload.exp * 1000));
      console.log("ACCESS_TOKEN 만료됨:", payload.exp < now);
    } catch (e) {
      console.log("ACCESS_TOKEN 디코딩 실패:", e);
    }
  }

  if (refreshToken) {
    try {
      const payload = JSON.parse(atob(refreshToken.split(".")[1]));
      const now = Math.floor(Date.now() / 1000);
      console.log("REFRESH_TOKEN 만료 시간:", new Date(payload.exp * 1000));
      console.log("REFRESH_TOKEN 만료됨:", payload.exp < now);
    } catch (e) {
      console.log("REFRESH_TOKEN 디코딩 실패:", e);
    }
  }

  return { accessToken: !!accessToken, refreshToken: !!refreshToken };
};

/**
 * 로그인 상태를 확인하고 필요시 로그인 페이지로 리다이렉트
 */
export const checkAuthStatus = () => {
  const tokenStatus = checkTokenStatus();

  if (!tokenStatus.accessToken && !tokenStatus.refreshToken) {
    console.warn("토큰이 없습니다. 로그인이 필요합니다.");
    return false;
  }

  return true;
};

/**
 * 강제로 로그아웃 처리 (쿠키 정리 + 로그인 페이지 이동)
 */
export const forceLogout = (reason = "401/403 인증 에러") => {
  console.log("🚪 강제 로그아웃 실행 - 이유:", reason);

  // 모든 관련 쿠키 정리
  const cookiesToClear = ["ACCESS_TOKEN", "REFRESH_TOKEN", "JSESSIONID"];
  const currentDomain = window.location.hostname;

  // 다양한 도메인/경로 조합으로 쿠키 삭제
  const domains = [
    "",
    currentDomain,
    `.${currentDomain}`,
    currentDomain.replace("www.", ""),
    `.${currentDomain.replace("www.", "")}`,
  ];
  const paths = ["/", "/api", ""];

  cookiesToClear.forEach((cookieName) => {
    domains.forEach((domain) => {
      paths.forEach((path) => {
        const cookieString = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path};${
          domain ? ` domain=${domain};` : ""
        }`;
        document.cookie = cookieString;
      });
    });
  });

  console.log("🍪 쿠키 정리 후 상태:", document.cookie);
  console.log("➡️ 로그인 페이지로 리다이렉트");

  // 알림 없이 바로 리다이렉트 (더 부드러운 UX)
  window.location.href = "/login";
};

/**
 * 토큰이 필요없는 일반 요청 (public API)
 */
const publicApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://api.silversieon.store',
  timeout: 30000,
  withCredentials: true, // 쿠키 자동 전송
});

/**
 * 토큰이 필요한 인증 요청 (private API)
 */
const privateApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://api.silversieon.store',
  timeout: 30000,
  withCredentials: true, // 쿠키 자동 전송
});

// 환경 변수 디버깅
console.log('🌍 환경 변수 확인:');
console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
console.log('실제 사용될 baseURL:', import.meta.env.VITE_API_URL || 'https://api.silversieon.store');

/**
 * 요청 인터셉터 - 쿠키 자동 전송 및 Authorization 헤더 추가
 */
privateApi.interceptors.request.use(
  (config) => {
    console.log("Private API request with credentials:", config.url);

    // 1. withCredentials: true로 쿠키 자동 전송 (배포 환경에서 주요 인증 방식)

    // 2. Authorization 헤더도 추가 (백엔드가 헤더 방식을 사용할 경우를 대비)
    const accessToken = getCookie("ACCESS_TOKEN");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
      console.log(
        "Authorization 헤더 추가됨:",
        `Bearer ${accessToken.substring(0, 20)}...`
      );
    } else {
      console.log("ACCESS_TOKEN이 없어서 Authorization 헤더 추가 안됨");
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * 토큰 갱신 중인지 확인하는 플래그
 */
let isRefreshing = false;
let failedQueue = [];

/**
 * 대기 중인 요청들을 처리하는 함수
 */
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

/**
 * 응답 인터셉터 - 401 발생 시 자동으로 토큰 갱신
 */
privateApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        // 이미 토큰 갱신 중이면 대기열에 추가
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return privateApi(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log("🔄 401/403 에러 발생 - 토큰 갱신 시도 중...");

        const refreshResponse = await publicApi.post(
          "/api/auths/refresh",
          {},
          {
            withCredentials: true, // 쿠키로 REFRESH_TOKEN 전송
          }
        );
        console.log("✅ 토큰 갱신 성공:", refreshResponse.status);

        // 토큰 갱신 성공
        isRefreshing = false;
        processQueue(null, refreshResponse);

        console.log("🔁 원본 요청 재시도");
        return privateApi(originalRequest);
      } catch (refreshError) {
        // 리프레시 실패
        isRefreshing = false;
        processQueue(refreshError, null);

        console.log("❌ 토큰 갱신 실패:", refreshError.response?.status);
        console.log("🚪 로그인 페이지로 리다이렉트");

        // 토큰 갱신 실패 시 무조건 로그아웃 처리
        forceLogout(
          `토큰 갱신 실패 (${refreshError.response?.status || "Network Error"})`
        );
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

/**
 * API 서비스 객체
 */
export const APIService = {
  public: {
    get: async (url, config = {}) => {
      const response = await publicApi.get(url, config);
      return response.data;
    },
    post: async (url, data = {}, config = {}) => {
      const response = await publicApi.post(url, data, config);
      return response.data;
    },
    patch: async (url, data = {}, config = {}) => {
      const response = await publicApi.patch(url, data, config);
      return response.data;
    },
  },
  private: {
    get: async (url, config = {}) => {
      const response = await privateApi.get(url, config);
      return response.data;
    },
    post: async (url, data = {}, config = {}) => {
      const response = await privateApi.post(url, data, config);
      return response.data;
    },
    put: async (url, data = {}, config = {}) => {
      const response = await privateApi.put(url, data, config);
      return response.data;
    },
    delete: async (url, config = {}) => {
      const response = await privateApi.delete(url, config);
      return response.data;
    },
    patch: async (url, data = {}, config = {}) => {
      const response = await privateApi.patch(url, data, config);
      return response.data;
    },
  },
};

export default {
  public: publicApi,
  private: privateApi,
};

/**
 * 마감임박 음식 목록 조회 API
 * @returns {Promise} API 응답 데이터
 */
export const getClosingSoonFoods = async () => {
  try {
    console.log('🔥 getClosingSoonFoods API 함수 호출됨');
    console.log('🔥 사용할 URL:', `${import.meta.env.VITE_API_URL || 'https://api.silversieon.store'}/api/closing-soon/foods`);
    
    const response = await APIService.private.get('/api/closing-soon/foods');
    console.log('🔥 API 응답 성공:', response);
    return response;
  } catch (error) {
    console.error('🔥 마감임박 음식 목록 조회 실패:', error);
    console.error('🔥 에러 상세:', error.response?.data);
    console.error('🔥 에러 상태:', error.response?.status);
    throw error;
  }
};

/**
 * 현재 로그인한 사용자 정보 조회 API
 * @returns {Promise} API 응답 데이터
 */
export const getCurrentUser = async () => {
  try {
    const response = await APIService.private.get('/api/users');
    return response;
  } catch (error) {
    console.error('사용자 정보 조회 실패:', error);
    throw error;
  }
};