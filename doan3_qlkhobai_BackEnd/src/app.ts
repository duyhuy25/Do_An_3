import express from "express";
import cors from "cors";
import containerHistoryRoutes from "./routes/containerHistoryRoutes";
import containerRoutes from "./routes/containerRoutes"
import itemtypeRoutes from "./routes/itemtypeRoutes"
import warehouseRoutes from "./routes/warehousesRoutes"
import vehicle from "./routes/vehicleRoutes"
import trip from "./routes/tripsRoutes"
import port from "./routes/portRoutes"
import customer from "./routes/customerRoutes"
import contract from "./routes/contractRoutes"
import cost from "./routes/costRoutes"
import invoice from "./routes/invoiceRoutes"
import user from "./routes/usersRoutes"
import assignmentContainersRoutes from "./routes/assignmentContainersRoutes"
import gpsContainersRoutes from "./routes/gpsContainersRoutes"
import suppliersRoutes from "./routes/suppliersRoutes"
import maintenanceRoutes from "./routes/maintenanceRoutes"
import auditLogRoutes from "./routes/auditLogRoutes"
import payment from "./routes/paymentRoutes"
import workflowRoutes from "./routes/workflowRoutes"

const app = express();

app.use(cors());      
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use("/api/history", containerHistoryRoutes);
app.use("/api/container", containerRoutes);
app.use("/api/itemtype", itemtypeRoutes);
app.use("/api/warehouse", warehouseRoutes);
app.use("/api/vehicle", vehicle);
app.use("/api/trip", trip);
app.use("/api/port", port);
app.use("/api/customer", customer);
app.use("/api/contract", contract);
app.use("/api/cost", cost);
app.use("/api/invoice", invoice);
app.use("/api/user", user);
app.use("/api", assignmentContainersRoutes);
app.use("/api", gpsContainersRoutes);
app.use("/api", suppliersRoutes);
app.use("/api", maintenanceRoutes);
app.use("/api", auditLogRoutes);
app.use("/api/payment", payment);
app.use("/api/workflow", workflowRoutes);

export default app;