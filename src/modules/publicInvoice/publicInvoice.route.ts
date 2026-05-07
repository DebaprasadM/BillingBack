import { Router } from "express";
import { getOne } from "./publicInvoice.controller.js";


const router = Router();

router.get(
  "/invoices/:publicId",
  getOne
);

export default router;