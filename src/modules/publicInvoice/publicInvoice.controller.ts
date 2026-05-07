import { Request, Response } from "express";
import { getPublicInvoice } from "./publicInvoice.service.js";


export const getOne = async (
  req: Request,
  res: Response
) => {

  try {

    const publicId = req.params.publicId as string;

    const invoice = await getPublicInvoice(
      publicId
    );

    res.status(200).json({
      success: true,
      data: invoice,
    });

  } catch (error: any) {

    res.status(404).json({
      success: false,
      message:
        error.message || "Invoice not found",
    });

  }
};