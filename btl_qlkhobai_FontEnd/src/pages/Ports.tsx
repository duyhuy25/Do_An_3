import React,{useEffect,useState} from "react"
import "./Pages.css"

interface Port{
  CangID:number
  TenCang:string
  MaCang:string
  DiaChi:string
}

const Ports = () =>{

  const [ports,setPorts] = useState<Port[]>([])
  const [search,setSearch] = useState("")

  useEffect(()=>{

    fetch("http://localhost:5000/api/ports")
    .then(res=>res.json())
    .then(data=>setPorts(data))

  },[])

  const filtered = ports.filter(p =>
    p.TenCang.toLowerCase().includes(search.toLowerCase())
  )

  return(

    <div>

      <div className="header">

        <h2>⚓ Danh mục Cảng</h2>

        <div className="toolbar">

          <input
            className="search"
            placeholder="🔍 Tìm cảng..."
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
          />

          <button className="btn-add">
            + Thêm cảng
          </button>

        </div>

      </div>

      <table>

        <thead>
          <tr>
            <th>ID</th>
            <th>Tên cảng</th>
            <th>Mã cảng</th>
            <th>Địa chỉ</th>
            <th>Tác vụ</th>
          </tr>
        </thead>

        <tbody>

          {filtered.map(p =>(

            <tr key={p.CangID}>

              <td>{p.CangID}</td>
              <td>{p.TenCang}</td>
              <td>{p.MaCang}</td>
              <td>{p.DiaChi}</td>

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

export default Ports