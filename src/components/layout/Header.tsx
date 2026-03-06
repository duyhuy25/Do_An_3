import "./Header.css";

const Header = () => {
  return (
    <header className="banner">
      <div className="banner-left">
        <img
          src="https://cdn-icons-png.flaticon.com/512/1995/1995574.png"
          alt="Logo"
          className="logo"
        />
        <h1>Hệ thống Quản lý Logistics</h1>
      </div>

      <div className="banner-right">
        <ul>
          <li>
            <a href="#">Đăng Nhập</a>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;