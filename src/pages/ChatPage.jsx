import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ChatPage.module.css';
import profileChat from '@images/chat/profile-chat.png';
import profile2 from '@images/chat/profile-2.png';
import profile3 from '@images/chat/profile-3.png';
import profile4 from '@images/chat/profile-4.png';


const chatData = [
  {
    id: 1,
    name: '댕댕펀치',
    message: '안녕하세요. 궁금해서 문의드려요!',
    time: '1시간 전',
    profileImage: profileChat,
    profileColor: '#FF6B6B',
    hasUnread: true,
  },
  {
    id: 2,
    name: '짹짹펀치',
    message: '안녕하세요. 궁금해서 문의드려요!',
    time: '1시간 전',
    profileImage: profile2,
    profileColor: '#4ECDC4',
    hasUnread: true,
  },
  {
    id: 3,
    name: '샤크펀치',
    message: '안녕하세요. 궁금해서 문의드려요!',
    time: '1시간 전',
    profileImage: profile3,
    profileColor: '#45B7D1',
    hasUnread: true,
  },
  {
    id: 4,
    name: '꽥꽥펀치',
    message: '안녕하세요. 궁금해서 문의드려요!',
    time: '1시간 전',
    profileImage: profile4,
    profileColor: '#96CEB4',
    hasUnread: true,
  },
];

const filterTabs = [
  { id: 'all', label: '전체' },
  { id: 'my-sharing', label: '나의 나눔' },
  { id: 'received', label: '받음' },
  { id: 'unread', label: '안 읽은 채팅방' },
];

export default function ChatPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const navigate = useNavigate();

  const handleChatClick = (chatId) => {
    navigate(`/chat/${chatId}`);
  };

  return (
    <div className={styles.chatPage}>
      {/* 헤더 */}
      <header className={styles.header}>
        <h1 className={styles.title}>채팅</h1>
        <div className={styles.searchIcon}>
          <svg width="22" height="21" viewBox="0 0 22 21" fill="none">
            <path d="M20 19L15.514 14.514M18 9.5C18 14.194 14.194 18 9.5 18C4.806 18 1 14.194 1 9.5C1 4.806 4.806 1 9.5 1C14.194 1 18 4.806 18 9.5Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </header>

      {/* 필터 탭 */}
      <div className={styles.filterTabs}>
        {filterTabs.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.filterTab} ${
              activeFilter === tab.id ? styles.active : ''
            }`}
            onClick={() => setActiveFilter(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 채팅 목록 */}
      <div className={styles.chatList}>
        {chatData.map((chat) => (
          <div 
            key={chat.id} 
            className={styles.chatItem}
            onClick={() => handleChatClick(chat.id)}
          >
            <div 
              className={styles.profileImage}
              style={{ backgroundColor: chat.profileColor }}
            >
              <img src={chat.profileImage} alt={chat.name} />
            </div>
            <div className={styles.chatContent}>
              <div className={styles.chatHeader}>
                <span className={styles.name}>{chat.name}</span>
                <span className={styles.time}>{chat.time}</span>
              </div>
              <p className={styles.message}>{chat.message}</p>
            </div>
            {chat.hasUnread && <div className={styles.unreadDot}></div>}
          </div>
        ))}
      </div>

      {/* 채팅방 개수 표시 */}
      <div className={styles.chatCount}>
        <div className={styles.countCircle}>9</div>
      </div>
    </div>
  );
}