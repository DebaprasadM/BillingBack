import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.route.js";
import invoiceRoutes from "./modules/invoice/invoice.route.js";



const app = express();

app.use(cors({
  origin: ["http://localhost:3000","https://pwvcxzd3-3000.inc1.devtunnels.ms"],
  credentials: true,
}));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API running 🚀");
});



app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/invoices", invoiceRoutes);

export default app;