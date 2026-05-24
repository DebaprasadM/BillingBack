

import { Request, Response } from "express";

import {
  getCompanySettings,
  updateCompanySettings,
} from "./company.service.js";

// =========================================
// GET SETTINGS
// =========================================

export const getSettings = async (
  req: Request,
  res: Response
) => {

  try {

    const { companyId } =
      (req as any).user;

    const company =
      await getCompanySettings(
        companyId
      );

    res.status(200).json({
      success: true,
      data: company,
    });

  } catch (error: any) {

    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch settings",
    });

  }
};

// =========================================
// UPDATE SETTINGS
// =========================================

export const updateSettings =
  async (
    req: Request,
    res: Response
  ) => {

    try {

      const { companyId } =
        (req as any).user;

      const company =
        await updateCompanySettings(
          companyId,
          req.body
        );

      res.status(200).json({
        success: true,
        message:
          "Settings updated successfully",
        data: company,
      });

    } catch (error: any) {

      res.status(400).json({
        success: false,
        message:
          error.message ||
          "Failed to update settings",
      });

    }
  };