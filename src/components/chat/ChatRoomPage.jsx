import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from '@components/chat/ChatRoomPage.module.css';
import profileImage from '@images/chat/profile-chat.png';
import backArrow from '@images/chat/back-arrow.svg';
import cameraIcon from '@images/chat/camera-icon.svg';
import sendIcon from '@images/chat/send-icon.svg';

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
  const { chatId } = useParams();
  const [message, setMessage] = useState('');
  const [showReservation, setShowReservation] = useState(false);

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
    setShowReservation(true);
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

  return (
    <div className={styles.chatRoomPage}>
      {/* 헤더 */}
      <header className={styles.header}>
        <button className={styles.backButton} onClick={handleBack}>
          <img src={backArrow} alt="뒤로가기" />
        </button>
        <div className={styles.userInfo}>
          <div className={styles.profileImage}>
            <img src={profileImage} alt="댕댕펀치" />
          </div>
          <span className={styles.userName}>댕댕펀치</span>
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
        </div>
      </div>

      {/* 하단 입력 영역 */}
      <div className={styles.inputArea}>
        <div className={styles.cameraButton} onClick={handleCameraClick}>
          <div className={styles.cameraIcon}>
            <img src={cameraIcon} alt="카메라" />
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
    </div>
  );
}
