import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { setToken } from '@utils/auth';
import { APIService } from '../apis/axios';
import logoSvg from '../assets/images/logo.svg';
import kakaoIcon from '../assets/images/kakao-icon.svg';

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleKakaoLogin = () => {};

  const handleTestLogin = async () => {
    try {
      setIsLoading(true);
      console.log('🔧 테스트 로그인 API 요청 시작...');
      
      // 테스트 로그인 API 호출
      const response = await APIService.public.post('/api/auths/test-login');
      
      console.log('✅ 테스트 로그인 성공:', response);
      
      // 서버에서 받은 토큰을 쿠키에 저장
      if (response.data) {
        console.log('🔧 받은 토큰을 쿠키에 저장 중:', response.data.substring(0, 20) + '...');
        setToken(response.data);
        
        // 토큰 저장 후 확인
        setTimeout(() => {
          console.log('🍪 저장된 쿠키 확인:', document.cookie);
          console.log('➡️ 메인 페이지로 이동');
          navigate('/');
        }, 100);
      } else {
        console.warn('⚠️ 서버 응답에 토큰이 없습니다.');
        navigate('/');
      }
      
    } catch (error) {
      console.error('❌ 테스트 로그인 실패:', error);
      
      // 에러 메시지 표시
      const errorMessage = error.response?.data?.message || '테스트 로그인에 실패했습니다.';
      alert(`로그인 실패: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* 로고 섹션 */}
      <div className="logo-section">
        <img src={logoSvg} alt="로고" className="logo" />
      </div>

      {/* 하단 버튼 섹션 */}
      <div className="bottom-section">
        {/* 시작하기 텍스트와 라인 */}
        <div className="start-section">
          <div className="line left-line"></div>
          <span className="start-text">시작하기</span>
          <div className="line right-line"></div>
        </div>

        {/* 카카오 로그인 버튼 */}
        <button className="kakao-login-btn" onClick={handleKakaoLogin}>
          <img src={kakaoIcon} alt="카카오" className="kakao-icon" />
          <span>카카오 계정으로 1초 만에 시작하기</span>
        </button>

        {/* 테스트 로그인 버튼 */}
        <button 
          className="test-login-btn" 
          onClick={handleTestLogin}
          disabled={isLoading}
        >
          {isLoading ? '로그인 중...' : '테스트 로그인'}
        </button>
      </div>
    </div>
  );
};

export default Login;
