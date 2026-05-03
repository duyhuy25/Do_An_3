import React, { useState } from "react";
import "./login.css";

interface LoginProps {
  onLogin: (user: any) => void;
}

export default function AuthPage({ onLogin }: LoginProps) {
  const [isLogin, setIsLogin] = useState(true);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [regUsername, setRegUsername] = useState("");
  const [regHoTen, setRegHoTen] = useState("");
  const [regPassword, setRegPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return alert("Vui lòng nhập đầy đủ thông tin!");

    setLoading(true);
    try {

      const res = await fetch("http://localhost:5000/api/user/user");
      if (!res.ok) throw new Error("Không thể kết nối đến máy chủ");
      
      const users = await res.json();
      const user = users.find((u: any) => u.Username === username && u.PasswordHash === password);

      if (!user) {
        alert("Sai tài khoản hoặc mật khẩu!");
      } else {

        alert(`Xin chào ${user.HoTen || user.Username}`);
        onLogin(user);
      }
    } catch (err: any) {
      alert("Lỗi: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regUsername || !regPassword || !regHoTen) return alert("Vui lòng nhập đầy đủ!");

    try {
      const res = await fetch("http://localhost:5000/api/user/adduser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Username: regUsername,
          PasswordHash: regPassword,
          HoTen: regHoTen,
          RoleID: 1, // Default role
          TrangThai: "Hoạt động"
        })
      });

      if (res.ok) {
        alert("Đăng ký thành công! Vui lòng đăng nhập.");
        setIsLogin(true);
      } else {
        alert("Lỗi khi đăng ký.");
      }
    } catch (err) {
      alert("Không thể kết nối đến máy chủ.");
    }
  };

  return (
    <div className="auth-container" style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    }}>
      <div className="auth-card" style={{
        backgroundColor: "white",
        padding: "30px",
        borderRadius: "12px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
        width: "100%",
        maxWidth: "400px"
      }}>
        {isLogin ? (
          <form onSubmit={handleLogin}>
            <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Đăng Nhập</h2>
            <div style={{ marginBottom: "15px" }}>
              <label>Username</label>
              <input
                type="text"
                style={{ width: "100%", padding: "10px", marginTop: "5px", borderRadius: "4px", border: "1px solid #ddd" }}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nhập username"
              />
            </div>
            <div style={{ marginBottom: "20px" }}>
              <label>Mật khẩu</label>
              <input
                type="password"
                style={{ width: "100%", padding: "10px", marginTop: "5px", borderRadius: "4px", border: "1px solid #ddd" }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu"
              />
            </div>
            <button type="submit" disabled={loading} style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#4f46e5",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold"
            }}>
              {loading ? "Đang xử lý..." : "Đăng Nhập"}
            </button>
            <p style={{ textAlign: "center", marginTop: "15px" }}>
              Chưa có tài khoản? <a href="#" onClick={() => setIsLogin(false)}>Đăng ký ngay</a>
            </p>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Đăng Ký</h2>
            <div style={{ marginBottom: "15px" }}>
              <label>Username</label>
              <input
                type="text"
                style={{ width: "100%", padding: "10px", marginTop: "5px", borderRadius: "4px", border: "1px solid #ddd" }}
                value={regUsername}
                onChange={(e) => setRegUsername(e.target.value)}
                placeholder="Username"
              />
            </div>
            <div style={{ marginBottom: "15px" }}>
              <label>Họ tên</label>
              <input
                type="text"
                style={{ width: "100%", padding: "10px", marginTop: "5px", borderRadius: "4px", border: "1px solid #ddd" }}
                value={regHoTen}
                onChange={(e) => setRegHoTen(e.target.value)}
                placeholder="Họ và tên"
              />
            </div>
            <div style={{ marginBottom: "20px" }}>
              <label>Mật khẩu</label>
              <input
                type="password"
                style={{ width: "100%", padding: "10px", marginTop: "5px", borderRadius: "4px", border: "1px solid #ddd" }}
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                placeholder="Mật khẩu"
              />
            </div>
            <button type="submit" style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#10b981",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold"
            }}>
              Đăng Ký
            </button>
            <p style={{ textAlign: "center", marginTop: "15px" }}>
              Đã có tài khoản? <a href="#" onClick={() => setIsLogin(true)}>Đăng nhập</a>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}