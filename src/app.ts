import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.route.js";
import invoiceRoutes from "./modules/invoice/invoice.route.js";
import publicInvoiceRoutes from "./modules/publicInvoice/publicInvoice.route.js";
import productRoutes from "./modules/product/product.route.js";
import companyRoutes from "./modules/company/company.route.js";






const app = express();

app.use(cors({
  origin: ["http://localhost:3000","https://pwvcxzd3-3000.inc1.devtunnels.ms","https://debbilling.vercel.app"],
  credentials: true,
}));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API running 🚀");
});



app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/invoices", invoiceRoutes);
app.use("/api/v1/public", publicInvoiceRoutes);
app.use("/api/v1/products",productRoutes);
app.use("/api/v1/company",companyRoutes)

export default app;