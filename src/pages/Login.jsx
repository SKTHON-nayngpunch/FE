import React from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { setToken } from '@utils/auth';
import logoSvg from '@images/logo.svg';
import kakaoIcon from '@images/kakao-icon.svg';

const Login = () => {
  const navigate = useNavigate();

  const handleKakaoLogin = () => {
  };

  const handleTestLogin = () => {
    // 테스트용 임시 토큰 설정 (실제 개발에서는 서버에서 받은 토큰을 사용)
    const testToken = 'test-jwt-token-for-development';
    setToken(testToken);
    navigate('/');
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
        <button className="test-login-btn" onClick={handleTestLogin}>
          테스트 로그인
        </button>
      </div>
    </div>
  );
};

export default Login;
