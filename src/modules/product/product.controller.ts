// src/modules/product/product.controller.ts

import { Request, Response } from "express";

import {

  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  searchProducts,

} from "./product.service.js";

// =========================================
// CREATE
// =========================================

export const create = async (
  req: Request,
  res: Response
) => {

  try {

    const { companyId } =
      (req as any).user;

    const product =
      await createProduct(
        req.body,
        companyId
      );

    res.status(201).json({
      success: true,
      data: product,
    });

  } catch (error: any) {

    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to create product",
    });
  }
};

// =========================================
// GET ALL
// =========================================

export const getAll = async (
  req: Request,
  res: Response
) => {

  try {

    const { companyId } =
      (req as any).user;

    const products =
      await getProducts(companyId);

    res.status(200).json({
      success: true,
      data: products,
    });

  } catch (error: any) {

    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch products",
    });
  }
};
// search=======================
// =========================================
// SEARCH
// =========================================

export const search = async (
  req: Request,
  res: Response
) => {

  try {

    const { companyId } =
      (req as any).user;

    const search =
      req.query.search as string;

    const products =
      await searchProducts(
        companyId,
        search || ""
      );

    res.status(200).json({
      success: true,

      data: products,
    });

  } catch (error: any) {

    res.status(500).json({
      success: false,

      message:
        error.message ||
        "Failed to search products",
    });
  }
};

// =========================================
// GET ONE
// =========================================

export const getOne = async (
  req: Request,
  res: Response
) => {

  try {

    const { companyId } =
      (req as any).user;

    const product =
      await getProductById(
        req.params.id  as string,
        companyId
      );

    res.status(200).json({
      success: true,
      data: product,
    });

  } catch (error: any) {

    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch product",
    });
  }
};

// =========================================
// UPDATE
// =========================================

export const update = async (
  req: Request,
  res: Response
) => {

  try {

    const { companyId } =
      (req as any).user;

    const product =
      await updateProduct(
        req.params.id  as string,
        req.body,
        companyId
      );

    res.status(200).json({
      success: true,
      data: product,
    });

  } catch (error: any) {

    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to update product",
    });
  }
};

// =========================================
// DELETE
// =========================================

export const remove = async (
  req: Request,
  res: Response
) => {

  try {

    const { companyId } =
      (req as any).user;

    await deleteProduct(
      req.params.id  as string,
      companyId
    );

    res.status(200).json({
      success: true,
      message:
        "Product deleted successfully",
    });

  } catch (error: any) {

    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to delete product",
    });
  }
};