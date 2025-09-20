import React from 'react';
import styles from './UserInfo.module.css';
import defaultProfileImage from '../../assets/images/detail/profile-image.png';

export default function UserInfo({
  username = '냥냥펀치',
  location = '성북구 정릉1동',
  profileImage = defaultProfileImage,
}) {
  return (
    <div className={styles.profileContainer}>
      <img src={profileImage} alt="프로필" className={styles.profileImage} />
      <div className={styles.userInfo}>
        <div className={styles.username}>{username}</div>
        <div className={styles.location}>{location}</div>
      </div>
    </div>
  );
}
