import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./footer.module.css";

const items = [
  { to: "/", label: "홈", exact: true, iconKey: "home" },
  { to: "/map", label: "동네지도", iconKey: "map" },
  { to: "/cart", label: "장바구니", iconKey: "shop" },
  { to: "/profile", label: "마이페이지", iconKey: "user" },
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
                src={`/src/assets/images/footer/${it.iconKey}${isActive ? '-active' : ''}.png`}
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