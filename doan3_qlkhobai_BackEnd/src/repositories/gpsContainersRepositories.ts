import sql from "mssql";
import { poolPromise } from "../config/db";

export const getAllGpsContainers = async () => {
  const pool = await poolPromise;
  const result = await pool.request().query(`
    SELECT * FROM GPS_Container ORDER BY GPSID DESC
  `);
  return result.recordset;
};

export const createGpsContainer = async (data: any) => {
  const pool = await poolPromise;
  await pool.request()
    .input("ContainerID", data.ContainerID)
    .input("ViDo", data.ViDo)
    .input("KinhDo", data.KinhDo)
    .input("TocDo", data.TocDo)
    .input("ThoiGian", data.ThoiGian ? new Date(data.ThoiGian) : null)
    .query(`
      INSERT INTO GPS_Container (ContainerID, ViDo, KinhDo, TocDo, ThoiGian)
      VALUES (@ContainerID, @ViDo, @KinhDo, @TocDo, @ThoiGian)
    `);
};

export const updateGpsContainerById = async (id: number, data: any) => {
  const pool = await poolPromise;
  await pool.request()
    .input("GPSID", id)
    .input("ContainerID", data.ContainerID)
    .input("ViDo", data.ViDo)
    .input("KinhDo", data.KinhDo)
    .input("TocDo", data.TocDo)
    .input("ThoiGian", data.ThoiGian ? new Date(data.ThoiGian) : null)
    .query(`
      UPDATE GPS_Container SET
        ContainerID = @ContainerID,
        ViDo = @ViDo,
        KinhDo = @KinhDo,
        TocDo = @TocDo,
        ThoiGian = @ThoiGian
      WHERE GPSID = @GPSID
    `);
};

export const deleteGpsContainerById = async (id: number) => {
  const pool = await poolPromise;
  await pool.request()
    .input("GPSID", id)
    .query("DELETE FROM GPS_Container WHERE GPSID = @GPSID");
};

export const searchGpsContainerByKeyword = async (searchTerm = "") => {
  const pool = await poolPromise;
  const request = pool.request();
  const term = searchTerm?.trim();

  let query = `SELECT * FROM GPS_Container`;

  if (term) {
    query += ` WHERE ContainerID LIKE @search`;
    request.input("search", sql.VarChar(100), `%${term}%`);
  }

  query += " ORDER BY GPSID DESC";

  const result = await request.query(query);
  return result.recordset;
};

export const getLatestGpsForAllContainers = async () => {
  const pool = await poolPromise;
  const result = await pool.request().query(`
    SELECT g1.*
    FROM GPS_Container g1
    INNER JOIN (
      SELECT ContainerID, MAX(ThoiGian) as MaxTime
      FROM GPS_Container
      GROUP BY ContainerID
    ) g2 ON g1.ContainerID = g2.ContainerID AND g1.ThoiGian = g2.MaxTime
  `);
  return result.recordset;
};
