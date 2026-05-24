// src/modules/invoice/service.ts

import prisma from "../../config/prisma.js";
import { Prisma, PaymentStatus,PaymentMethod } from "@prisma/client";

type InvoiceItemInput = {
  productName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
};

type CreateInvoiceInput = {
  customerName?: string;
  customerWhatsappNo?: string;

  items: InvoiceItemInput[];

  paidAmount?: number;

  discount?: number;
  paymentMethod?: PaymentMethod;
};

export const createInvoice = async (
  payload: CreateInvoiceInput,
  companyId: string
) => {
  const {
    customerName,
    customerWhatsappNo,

    items,

    paidAmount = 0,

    discount = 0,
    paymentMethod = "CASH",
  } = payload;

  // ==================================================
  // ✅ VALIDATION
  // ==================================================

 if (!items || items.length === 0) {
  throw new Error(
    "Invoice items are required"
  );
}

// ==================================================
// ✅ ITEM VALIDATION
// ==================================================

for (const item of items) {

  if (!item.productName?.trim()) {

    throw new Error(
      "Product name is required"
    );
  }

  if (item.quantity <= 0) {

    throw new Error(
      "Quantity must be greater than 0"
    );
  }

  if (item.unitPrice < 0) {

    throw new Error(
      "Invalid unit price"
    );
  }
}

// ==================================================
// ✅ SUBTOTAL
// ==================================================

  

  // ==================================================
  // ✅ SUBTOTAL
  // ==================================================

  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );

  // ==================================================
  // ✅ FINAL TOTAL
  // ==================================================

  const total = subtotal - discount;

  // ==================================================
  // ✅ DUE
  // ==================================================

  const dueAmount = total - paidAmount;

  // ==================================================
  // ✅ PAYMENT STATUS
  // ==================================================

  let paymentStatus: PaymentStatus = "UNPAID";

  if (dueAmount <= 0) {
    paymentStatus = "PAID";
  } else if (paidAmount > 0) {
    paymentStatus = "PARTIAL";
  }

  // ==================================================
  // ✅ TRANSACTION
  // ==================================================

  return prisma.$transaction(async (tx: Prisma.TransactionClient) => {

   
let customer = null;

// ==================================================
// ✅ ONLY IF WHATSAPP EXISTS
// ==================================================

if (customerWhatsappNo) {

  // FIND CUSTOMER

  customer =
    await tx.customer.findUnique({
      where: {
        companyId_whatsappNo: {
          companyId,

          whatsappNo:
            customerWhatsappNo,
        },
      },
    });

  // CREATE CUSTOMER

  if (!customer) {

    customer =
      await tx.customer.create({
        data: {
          companyId,

          name:
            customerName ||

            "Walk-in Customer",

          whatsappNo:
            customerWhatsappNo,
        },
      });
  }
}

    // ==================================================
    // ✅ GENERATE INVOICE NUMBER
    // ==================================================

    const count = await tx.invoice.count({
      where: {
        companyId,
      },
    });

    const invoiceNo = `INV-${count + 1}`;

    // ==================================================
    // ✅ CREATE INVOICE
    // ==================================================

    const invoice = await tx.invoice.create({
      data: {
        
        companyId,
        customerId: customer?.id,

        invoiceNo,

        subtotal,
        discount,
        total,

        paidAmount,
        dueAmount,

        paymentMethod,
        paymentStatus,
      },
    });

    // ==================================================
    // ✅ CREATE ITEMS
    // ==================================================

    await tx.invoiceItem.createMany({
      data: items.map((item) => ({
        invoiceId: invoice.id,

        productName: item.productName,

        quantity: item.quantity,
        unit: item.unit,

        unitPrice: item.unitPrice,

        totalPrice: item.quantity * item.unitPrice,
      })),
    });

    // ==================================================
    // ✅ CREATE INITIAL PAYMENT ENTRY
    // ==================================================

    if (paidAmount > 0) {
      await tx.payment.create({
        data: {
          invoiceId: invoice.id,
          amount: paidAmount,
        },
      });
    }

    // ==================================================
    // ✅ RETURN FULL INVOICE
    // ==================================================

    return tx.invoice.findUnique({
      where: {
        id: invoice.id,
      },
      include: {
        customer: true,
        items: true,
        payments: true,
      },
    });
  });
};

// 2=================get all invoice======================
export const getInvoices = async (companyId: string) => {
  return prisma.invoice.findMany({
    where: {
      companyId,
    },

    include: {
      customer: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });
};
// 3==================get date range wise======================


type GetInvoicesParams = {
  companyId: string;

  startDate?: string;
  endDate?: string;

  page?: number;
  limit?: number;
};

export const getInvoicesDateRange = async ({
  companyId,

  startDate,
  endDate,

  page = 1,
  limit = 20,
}: GetInvoicesParams) => {

  const skip = (page - 1) * limit;

  return prisma.invoice.findMany({
    where: {
      companyId,

      ...(startDate && endDate
        ? {
            createdAt: {
              gte: new Date(startDate),

              lte: new Date(endDate),
            },
          }
        : {}),
    },

    include: {
      customer: true,
    },

    orderBy: {
      createdAt: "desc",
    },

    skip,
    take: limit,
  });
};
// ==================================================
// 4===========✅ GET SINGLE INVOICE
// ==================================================

export const getInvoiceById = async (
  invoiceId: string,
  companyId: string
) => {
  const invoice = await prisma.invoice.findFirst({
    where: {
      id: invoiceId,
      companyId,
    },

    include: {
      customer: true,

      items: {
        orderBy: {
          createdAt: "asc",
        },
      },

      payments: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!invoice) {
    throw new Error("Invoice not found");
  }

  return invoice;
};

// 5===============due payment====================
// ==================================================
// ✅ ADD PAYMENT
// ==================================================

export const addPayment = async (
  invoiceId: string,
  companyId: string,
  amount: number,
  note?: string
) => {

  if (amount <= 0) {
    throw new Error("Invalid payment amount");
  }

  return prisma.$transaction(async (tx: Prisma.TransactionClient) => {

    // ==================================================
    // ✅ FIND INVOICE
    // ==================================================

    const invoice = await tx.invoice.findFirst({
      where: {
        id: invoiceId,
        companyId,
      },
    });

    if (!invoice) {
      throw new Error("Invoice not found");
    }

    // ==================================================
    // ✅ OVERPAYMENT CHECK
    // ==================================================

    if (amount > invoice.dueAmount) {
      throw new Error("Payment exceeds due amount");
    }

    // ==================================================
    // ✅ CREATE PAYMENT
    // ==================================================

    await tx.payment.create({
      data: {
        invoiceId,
        amount,
        note,
      },
    });

    // ==================================================
    // ✅ UPDATED VALUES
    // ==================================================

    const updatedPaidAmount = invoice.paidAmount + amount;

    const updatedDueAmount =
      invoice.total - updatedPaidAmount;

    // ==================================================
    // ✅ PAYMENT STATUS
    // ==================================================

    let paymentStatus: PaymentStatus = "UNPAID";

    if (updatedDueAmount <= 0) {
      paymentStatus = "PAID";
    } else if (updatedPaidAmount > 0) {
      paymentStatus = "PARTIAL";
    }

    // ==================================================
    // ✅ UPDATE INVOICE
    // ==================================================

    await tx.invoice.update({
      where: {
        id: invoice.id,
      },

      data: {
        paidAmount: updatedPaidAmount,

        dueAmount: updatedDueAmount,

        paymentStatus,
      },
    });

    // ==================================================
    // ✅ RETURN UPDATED INVOICE
    // ==================================================

    return tx.invoice.findUnique({
      where: {
        id: invoice.id,
      },

      include: {
        customer: true,
        items: true,
        payments: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
  });
};
