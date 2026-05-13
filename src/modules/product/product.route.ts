// src/modules/product/product.route.ts

import { Router } from "express";

import { authMiddleware } from "../../middleware/auth.js";

import {

  create,
  getAll,
  getOne,
  update,
  remove,
  search,

} from "./product.controller.js";

const router = Router();

// =========================================
// CRUD
// =========================================

router.post(
  "/",
  authMiddleware,
  create
);

router.get(
  "/",
  authMiddleware,
  getAll
);
router.get(
  "/search",
  authMiddleware,
  search
);

router.get(
  "/:id",
  authMiddleware,
  getOne
);

router.patch(
  "/:id",
  authMiddleware,
  update
);

router.delete(
  "/:id",
  authMiddleware,
  remove
);

export default router;