// src/modules/invoice/route.ts

import express from "express";
import { authMiddleware } from "../../middleware/auth.js";
import { create, createPayment, getAll, getAllDateRange, getOne } from "./invoice.controller.js";

const router = express.Router();

router.post("/", authMiddleware, create);
router.get("/", authMiddleware, getAll);
router.get("/", authMiddleware, getAllDateRange);
router.get("/:id", authMiddleware, getOne);
router.post("/:id/payments", authMiddleware,createPayment);

export default router;