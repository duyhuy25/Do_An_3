import React, { useState } from "react";
import "./header.css";

interface HeaderProps {
  user: any;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="banner">
      <div className="banner-left">
        <img
          src="https://cdn-icons-png.flaticon.com/512/1995/1995574.png"
          alt="logo"
          className="logo"
        />
        <h2>Hệ thống Quản lý Logistics</h2>
      </div>

      <div className="banner-right">
        {user ? (
          <div className="user-info" onClick={() => setShowDropdown(!showDropdown)}>
            <span>Chào, <strong>{user.HoTen || user.Username}</strong> 👤</span>
            {showDropdown && (
              <div className="dropdown-menu">
                <button className="btn-logout" onClick={(e) => { e.stopPropagation(); onLogout(); }}>
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        ) : (
          <a href="#">Đăng nhập</a>
        )}
      </div>
    </header>
  );
};

export default Header;