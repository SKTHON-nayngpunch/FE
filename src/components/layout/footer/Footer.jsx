import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./footer.module.css";

// Footer 아이콘들 import
import homeIcon from "@images/footer/home.png";
import homeActiveIcon from "@images/footer/home-active.png";
import mapIcon from "@images/footer/map.png";
import mapActiveIcon from "@images/footer/map-active.png";
import chatIcon from "@images/footer/chat.png";
import chatActiveIcon from "@images/footer/chat-active.png";
import userIcon from "@images/footer/user.png";
import userActiveIcon from "@images/footer/user-active.png";

const items = [
  { 
    to: "/", 
    label: "홈", 
    exact: true, 
    icon: homeIcon, 
    activeIcon: homeActiveIcon 
  },
  { 
    to: "/map", 
    label: "동네지도", 
    icon: mapIcon, 
    activeIcon: mapActiveIcon 
  },
  { 
    to: "/chat", 
    label: "채팅", 
    icon: chatIcon, 
    activeIcon: chatActiveIcon 
  },
  { 
    to: "/profile", 
    label: "마이페이지", 
    icon: userIcon, 
    activeIcon: userActiveIcon 
  },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      {items.map((it) => (
        <NavLink
          key={it.to}
          to={it.to}
          end={it.exact}
          className={({ isActive }) =>
            `${styles.item} ${isActive ? styles.active : ""}`
          }
        >
          {({ isActive }) => (
            <>
              <img
                src={isActive ? it.activeIcon : it.icon}
                alt={it.label}
                className={styles.icon}
              />
              <span className={styles.label}>{it.label}</span>
              <span className={styles.underline} />
            </>
          )}
        </NavLink>
      ))}
    </footer>
  );
}