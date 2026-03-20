import React,{useEffect,useState} from "react"
import "./Pages.css"

interface User{
  UserID:number
  Username: string
  PasswordHash: string
  HoTen:string
  Email:string
  TrangThai:string
  RoleID:number
}

const Users = () =>{

  const [users,setUsers] = useState<User[]>([])
  const [search,setSearch] = useState("")

  useEffect(()=>{

    fetch("http://localhost:5000/api/user/user")
    .then(res=>res.json())
    .then(data=>setUsers(data))

  },[])

  const filtered = users.filter(u =>
    u.HoTen.toLowerCase().includes(search.toLowerCase())
  )

  return(

    <div>

      <div className="header">

        <h2>👤 Người dùng</h2>

        <div className="toolbar">

          <input
            className="search"
            placeholder="🔍 Tìm người dùng..."
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
          />

          <button className="btn-add">
            + Thêm người dùng
          </button>

        </div>

      </div>

      <table>

        <thead>
          <tr>
            <th>ID</th>
            <th>Tài khoản</th>
            <th>Mật khẩu</th>
            <th>Họ tên</th>
            <th>Email</th>
            <th>Trạng thái</th>
            <th>Vai trò</th>
            <th>Tác vụ</th>
          </tr>
        </thead>
        <tbody>

          {filtered.map(u =>(

            <tr key={u.UserID}>

              <td>{u.UserID}</td>
              <td>{u.Username}</td>
              <td>{u.PasswordHash}</td>
              <td>{u.HoTen}</td>
              <td>{u.Email}</td>
              <td>{u.TrangThai}</td>
              <td>{u.RoleID}</td>

              <td>
                <button className="btn-edit">Sửa</button>
                <button className="btn-delete">Xóa</button>
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  )

}

export default Users