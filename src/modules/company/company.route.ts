// src/modules/company/routes.ts

import { Router } from "express";

import {
  getSettings,
  updateSettings,
} from "./company.controller.js";

import { authMiddleware } from "../../middleware/auth.js";

const router = Router();

// =========================================
// SETTINGS
// =========================================

router.get(
  "/settings",

  authMiddleware,

  getSettings
);

router.patch(
  "/settings",

  authMiddleware,

  updateSettings
);

export default router;