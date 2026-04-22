import sql from "mssql";

const config = {
  user: "sa",
  password: "123",
  server: "DESKTOP-FTDRE2U",
  database: "DoAn3",
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

export const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log("Connected to SQL Server");
    return pool;
  })
  .catch(err => {
    console.log("Database connection failed:", err);
    throw err;
  });