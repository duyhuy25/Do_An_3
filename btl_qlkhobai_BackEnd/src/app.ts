import express from "express";
import containerHistoryRoute from "./routes/containerHistoryRoutes";

const app = express();

app.use(express.json());
app.use("/api/history", containerHistoryRoute);
app.get("/", (req, res) => {
    res.send("API đang chạy");
  });
export default app;