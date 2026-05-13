// src/modules/product/product.service.ts

import prisma from "../../config/prisma.js";

// =========================================
// TYPES
// =========================================

type CreateProductInput = {
  name: string;

  stockQty?: number;

  defaultUnit?: string;

  defaultPrice?: number;
};

type UpdateProductInput = {
  name?: string;

  stockQty?: number;

  defaultUnit?: string;

  defaultPrice?: number;

  isActive?: boolean;
};

// =========================================
// CREATE PRODUCT
// =========================================

export const createProduct = async (
  payload: CreateProductInput,
  companyId: string
) => {

  return prisma.product.create({
    data: {

      companyId,

      name: payload.name,

      stockQty: payload.stockQty,

      defaultUnit: payload.defaultUnit,

      defaultPrice: payload.defaultPrice,
    },
  });
};

// =========================================
// GET ALL PRODUCTS
// =========================================

export const getProducts = async (
  companyId: string
) => {

  return prisma.product.findMany({
    where: {
      companyId,

      isActive: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });
};
// search product======================================

// =========================================
// SEARCH PRODUCTS
// =========================================

export const searchProducts = async (
  companyId: string,
  search: string
) => {

  return prisma.product.findMany({
    where: {

      companyId,

      isActive: true,

      name: {
        contains: search,

        mode: "insensitive",
      },
    },

    orderBy: {
      name: "asc",
    },

    take: 6,
  });
};
// =========================================
// GET SINGLE PRODUCT
// =========================================

export const getProductById = async (
  id: string,
  companyId: string
) => {

  return prisma.product.findFirst({
    where: {
      id,
      companyId,
    },
  });
};

// =========================================
// UPDATE PRODUCT
// =========================================

export const updateProduct = async (
  id: string,
  payload: UpdateProductInput,
  companyId: string
) => {

  return prisma.product.update({
    where: {
      id,
    },

    data: {
      ...payload,
    },
  });
};

// =========================================
// DELETE PRODUCT
// =========================================

export const deleteProduct = async (
  id: string,
  companyId: string
) => {

  // soft delete

  return prisma.product.update({
    where: {
      id,
    },

    data: {
      isActive: false,
    },
  });
};