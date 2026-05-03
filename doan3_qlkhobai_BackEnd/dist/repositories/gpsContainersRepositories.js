"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchGpsContainerByKeyword = exports.deleteGpsContainerById = exports.updateGpsContainerById = exports.createGpsContainer = exports.getAllGpsContainers = void 0;
const mssql_1 = __importDefault(require("mssql"));
const db_1 = require("../config/db");
const getAllGpsContainers = async () => {
    const pool = await db_1.poolPromise;
    const result = await pool.request().query(`
    SELECT * FROM GPS_Container ORDER BY GPSID DESC
  `);
    return result.recordset;
};
exports.getAllGpsContainers = getAllGpsContainers;
const createGpsContainer = async (data) => {
    const pool = await db_1.poolPromise;
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
exports.createGpsContainer = createGpsContainer;
const updateGpsContainerById = async (id, data) => {
    const pool = await db_1.poolPromise;
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
exports.updateGpsContainerById = updateGpsContainerById;
const deleteGpsContainerById = async (id) => {
    const pool = await db_1.poolPromise;
    await pool.request()
        .input("GPSID", id)
        .query("DELETE FROM GPS_Container WHERE GPSID = @GPSID");
};
exports.deleteGpsContainerById = deleteGpsContainerById;
const searchGpsContainerByKeyword = async (searchTerm = "") => {
    const pool = await db_1.poolPromise;
    const request = pool.request();
    const term = searchTerm?.trim();
    let query = `SELECT * FROM GPS_Container`;
    if (term) {
        query += ` WHERE ContainerID LIKE @search`;
        request.input("search", mssql_1.default.VarChar(100), `%${term}%`);
    }
    query += " ORDER BY GPSID DESC";
    const result = await request.query(query);
    return result.recordset;
};
exports.searchGpsContainerByKeyword = searchGpsContainerByKeyword;
