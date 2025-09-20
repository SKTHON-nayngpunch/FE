import React, { useState } from 'react';
import styles from './MessageInput.module.css';
import usersIcon1 from '../../assets/images/detail/message-users-icon-1.svg';
import usersIcon2 from '../../assets/images/detail/message-users-icon-2.svg';
import usersIcon3 from '../../assets/images/detail/message-users-icon-3.svg';
import usersIcon4 from '../../assets/images/detail/message-users-icon-4.svg';

export default function MessageInput({
  participantsCount = '3/4',
  placeholder = '안녕하세요, 궁금해서 문의드려요.',
  onSend = () => {},
}) {
  const [message, setMessage] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSendClick = () => {
    if (message.trim()) {
      onSend(message);
      setMessage('');
      setIsExpanded(false);
    }
    // 더 이상 빈 상태에서 보내기 버튼 클릭 시 input 확장하지 않음
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  return (
    <div className={styles.messageContainer}>
      <div className={styles.participantsInfo}>
        <div className={styles.usersIcon}>
          <img src={usersIcon1} alt="users" />
          <img src={usersIcon2} alt="users" />
          <img src={usersIcon3} alt="users" />
          <img src={usersIcon4} alt="users" />
        </div>
        <span className={styles.participantsCount}>{participantsCount}</span>
      </div>

      <div className={styles.inputContainer}>
        {isExpanded ? (
          <input
            type="text"
            value={message}
            onChange={handleInputChange}
            placeholder={placeholder}
            className={styles.messageInput}
            autoFocus
            onBlur={() => !message && setIsExpanded(false)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendClick()}
          />
        ) : (
          <div className={styles.messagePlaceholder}>
            <span>{placeholder}</span>
          </div>
        )}

        <button className={styles.sendButton} onClick={handleSendClick}>
          보내기
        </button>
      </div>
    </div>
  );
}
