// src/modules/invoice/controller.ts

import { Request, Response } from "express";
import { addPayment, createInvoice, getInvoiceById, getInvoices, getInvoicesDateRange } from "./invoice.service.js";

export const create = async (req: Request, res: Response) => {
  try {
    const { companyId } = (req as any).user;

    const invoice = await createInvoice(req.body, companyId);

    res.status(201).json({
      success: true,
      message: "Invoice created successfully",
      data: invoice,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to create invoice",
    });
  }
};

// 2=======================get all invoice=========
// ==================================================
// ✅ GET ALL INVOICES
// ==================================================

export const getAll = async (req: Request, res: Response) => {
  try {
    const { companyId } = (req as any).user;

    const invoices = await getInvoices(companyId);

    res.status(200).json({
      success: true,
      data: invoices,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch invoices",
    });
  }
};
// 3======================get by date rfange=============
// src/modules/invoice/controller.ts

export const getAllDateRange = async (
  req: Request,
  res: Response
) => {
  try {

    const { companyId } = (req as any).user;

    const {
      startDate,
      endDate,

      page = "1",
      limit = "20",
    } = req.query;

    const invoices = await getInvoicesDateRange({
      companyId,

      startDate: startDate as string,
      endDate: endDate as string,

      page: Number(page),
      limit: Number(limit),
    });

    res.status(200).json({
      success: true,
      data: invoices,
    });

  } catch (error: any) {

    res.status(500).json({
      success: false,
      message:
        error.message || "Failed to fetch invoices",
    });

  }
};
// 4=========get invoice by id=====================
// ==================================================
// ✅ GET SINGLE INVOICE
// ==================================================

export const getOne = async (req: Request, res: Response) => {
  try {
    const { companyId } = (req as any).user;

   const id = req.params.id as string;

    const invoice = await getInvoiceById(id, companyId);

    res.status(200).json({
      success: true,
      data: invoice,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message || "Invoice not found",
    });
  }
};

// ==================================================
// 5==============✅ ADD PAYMENT
// ==================================================

export const createPayment = async (
  req: Request,
  res: Response
) => {
  try {

    const { companyId } = (req as any).user;

    const invoiceId = req.params.id as string;

    const { amount, note } = req.body;

    const invoice = await addPayment(
      invoiceId,
      companyId,
      amount,
      note
    );

    res.status(200).json({
      success: true,
      message: "Payment added successfully",
      data: invoice,
    });

  } catch (error: any) {

    res.status(400).json({
      success: false,
      message:
        error.message || "Failed to add payment",
    });

  }
};