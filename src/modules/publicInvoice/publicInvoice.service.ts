import prisma from "../../config/prisma.js";

export const getPublicInvoice = async (
  publicId: string
) => {

  const invoice = await prisma.invoice.findUnique({
    where: {
      publicId,
    },

    include: {
      customer: true,

      items: true,

      payments: true,

      company: true,
    },
  });

  if (!invoice) {
    throw new Error("Invoice not found");
  }

  return invoice;
};