import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import APIService from '@apis/axios';
import styles from '@components/chat/ChatRoomPage.module.css';
import profileImage from '@images/chat/profile-chat.png';
import backArrow from '@images/chat/back-arrow.svg';
import cameraIcon from '@images/chat/camera-icon.svg';
import sendIcon from '@images/chat/send-icon.svg';
import leafIcon from '@images/modal/leaf-icon.svg';
import closeIcon from '@images/modal/close-icon.svg';

const chatMessages = [
  {
    id: 1,
    type: 'received',
    message: '안녕하세요, \n궁금해서 문의드려요.',
    time: '오후 3:57',
  },
  {
    id: 2,
    type: 'sent',
    message: '안녕하세요. \n나눔 원하시나요?',
    time: '오후 5:15',
  },
  {
    id: 3,
    type: 'received',
    message: '넹 언제 \n가능하실까요?',
    time: '오후 5:17',
  },
  {
    id: 4,
    type: 'sent',
    message: '내일 오후 1시에 \n가능합니다!\n나눔예약 보내드릴게요',
    time: '오후 5:20',
  },
];

export default function ChatRoomPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { chatId } = useParams();
  const [message, setMessage] = useState('');
  const [showReservation, setShowReservation] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [foodId, setFoodId] = useState(null);
  const [sellerInfo, setSellerInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isReservationCompleted, setIsReservationCompleted] = useState(false);
  const [participationId, setParticipationId] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [completionData, setCompletionData] = useState(null);

  // DetailPage에서 전달된 데이터 받기
  useEffect(() => {
    if (location.state) {
      setFoodId(location.state.foodId);
      setSellerInfo(location.state.sellerInfo);
      if (location.state.message) {
        setMessage(location.state.message);
      }
    }
  }, [location]);

  const handleBack = () => {
    navigate('/chat');
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      // 메시지 전송 로직
      setMessage('');
    }
  };

  const handleCameraClick = () => {
    console.log('Camera button clicked, showReservation:', showReservation);
    if (showReservation) {
      // x 버튼 클릭 시 - 아래로 슬라이드 다운 후 숨김
      console.log('Closing reservation...');
      setIsClosing(true);
      setTimeout(() => {
        setShowReservation(false);
        setIsClosing(false);
      }, 300); // 애니메이션 시간과 맞춤
    } else {
      // + 버튼 클릭 시 - 나눔 예약 버튼 표시
      console.log('Opening reservation...');
      setShowReservation(true);
    }
  };

  const handleCloseReservation = () => {
    setShowReservation(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

    // 나눔 예약 API 호출
  const handleReservation = async () => {
    if (!foodId) {
      alert('음식 정보가 없습니다.');
      return;
    }

    try {
      setIsLoading(true);
      console.log(`🔄 나눔 예약 요청 중... foodId: ${foodId}`);

      const response = await APIService.private.post(`/api/participations?foodId=${foodId}`);

      if (response.data.success) {
        console.log('✅ 나눔 예약 성공:', response.data);
        console.log('API 응답 데이터:', response.data.data);
        const newParticipationId = response.data.data.participatationId || response.data.data.participationId;
        
        // 상태 업데이트
        setParticipationId(newParticipationId);
        setIsReservationCompleted(true);
        setShowReservation(false);
        
        console.log('저장된 participationId:', newParticipationId);
        
        if (!newParticipationId) {
          console.error('⚠️ participationId가 제대로 추출되지 않았습니다!');
          console.error('사용 가능한 키들:', Object.keys(response.data.data));
        }
      } else {
        throw new Error(response.data.message || '나눔 예약에 실패했습니다.');
      }
    } catch (error) {
      console.error('❌ 나눔 예약 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 나눔 완료 API 호출
  const handleCompletion = async () => {
    console.log('🔍 현재 저장된 participationId:', participationId);
    if (!participationId) {
      alert('참여 정보가 없습니다.');
      console.error('❌ participationId가 없어서 나눔 완료를 진행할 수 없습니다.');
      return;
    }

    try {
      setIsLoading(true);
      console.log(`🔄 나눔 완료 요청 중... participationId: ${participationId}`);

      const response = await APIService.private.put(`/api/participations/complete?participationId=${participationId}`);

      if (response.data.success) {
        console.log('✅ 나눔 완료 성공:', response.data);
        const responseData = response.data.data;
        
        // 완료 데이터 저장 및 모달 표시
        setCompletionData(responseData);
        setShowSuccessModal(true);
        
        // 완료 후 상태 초기화
        setIsReservationCompleted(false);
        setParticipationId(null);
        
        console.log('완료 데이터:', responseData);
      } else {
        throw new Error(response.data.message || '나눔 완료에 실패했습니다.');
      }
    } catch (error) {
      console.error('❌ 나눔 완료 실패:', error);
      alert(error.response?.data?.message || error.message || '나눔 완료에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 성공 모달 닫기 및 메인 페이지로 이동
  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setCompletionData(null);
    navigate('/'); // 메인 페이지로 이동
  };

  return (
    <div className={styles.chatRoomPage}>
      {/* 헤더 */}
      <header className={styles.header}>
        <button className={styles.backButton} onClick={handleBack}>
          <img src={backArrow} alt="뒤로가기" />
        </button>
        <div className={styles.userInfo}>
          <div className={styles.profileImage}>
            <img 
              src={sellerInfo?.profileImage || profileImage} 
              alt={sellerInfo?.nickname || "판매자"} 
              onError={(e) => {
                e.target.src = profileImage; // 이미지 로드 실패시 기본 이미지
              }}
            />
          </div>
          <span className={styles.userName}>{sellerInfo?.nickname || "판매자"}</span>
        </div>
      </header>

      {/* 채팅 영역 */}
      <div className={styles.chatArea}>
        {/* 날짜 표시 */}
        <div className={styles.dateIndicator}>
          <span>2025. 09.20</span>
        </div>

        {/* 메시지 목록 */}
        <div className={styles.messageList}>
          {chatMessages.map((msg) => (
            <div key={msg.id} className={styles.messageGroup}>
              <div className={`${styles.messageWrapper} ${styles[msg.type]}`}>
                <div className={styles.messageBubble}>
                  {msg.message.split('\n').map((line, index) => (
                    <span key={index}>
                      {line}
                      {index < msg.message.split('\n').length - 1 && <br />}
                    </span>
                  ))}
                </div>
              </div>
              <div className={`${styles.messageTime} ${styles[msg.type]}`}>
                {msg.time}
              </div>
            </div>
          ))}
          
          {/* 나눔 예약 완료 안내 */}
          {isReservationCompleted && (
            <div className={styles.reservationNotice}>
              <div className={styles.noticeBox}>
                안내. {sellerInfo?.nickname || "판매자"}님과 나눔 예약을 했어요.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 하단 입력 영역 */}
      <div className={styles.inputArea}>
        <div className={styles.cameraButton} onClick={handleCameraClick}>
          <div className={`${styles.cameraIcon} ${showReservation ? styles.iconRotated : ''}`}>
            <div className={styles.plusIcon}>
              <div className={styles.plusHorizontal}></div>
              <div className={styles.plusVertical}></div>
            </div>
          </div>
        </div>
        <div className={styles.messageInput}>
          <input
            type="text"
            placeholder="메세지를 입력하세요"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button className={styles.sendButton} onClick={handleSendMessage}>
            <img src={sendIcon} alt="전송" />
          </button>
        </div>
      </div>

      {/* 나눔 예약 버튼 */}
      {showReservation && (
        <div className={`${styles.reservationOverlay} ${isClosing ? styles.slideDown : styles.slideUp}`}>
          <div className={styles.reservationModal}>
            <button 
              className={styles.reservationButton}
              onClick={handleReservation}
              disabled={isLoading}
            >
              {isLoading ? '예약 중...' : '나눔 예약'}
            </button>
          </div>
        </div>
      )}

      {/* 나눔 완료 버튼 */}
      {isReservationCompleted && (
        <div className={styles.completionOverlay}>
          <div className={styles.completionModal}>
            <button 
              className={styles.completionButton}
              onClick={handleCompletion}
              disabled={isLoading}
            >
              {isLoading ? '완료 중...' : '나눔 완료'}
            </button>
          </div>
        </div>
      )}

      {/* 나눔 완료 성공 모달 */}
      {showSuccessModal && completionData && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContainer}>
            <button className={styles.closeButton} onClick={handleCloseSuccessModal}>
              <img src={closeIcon} alt="닫기" />
            </button>
            
            <div className={styles.modalContent}>
              <h3 className={styles.modalTitle}>절약한 탄소 발자국</h3>
              
              <div className={styles.carbonInfo}>
                <div className={styles.carbonAmount}>
                  <span className={styles.carbonPrefix}>약</span>
                  <span className={styles.carbonValue}>{completionData.carbonCount}g</span>
                </div>
                
                <div className={styles.leafIconContainer}>
                  <img src={leafIcon} alt="나뭇잎" className={styles.leafIcon} />
                </div>
              </div>
              
              {!completionData.isParticipation && (
                <p className={styles.modalMessage}>
                  나눔을 통해<br />
                  나눔잎 한 장을 획득하셨습니다.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
