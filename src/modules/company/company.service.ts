

import prisma from "../../config/prisma.js";

// =========================================
// GET SETTINGS
// =========================================

export const getCompanySettings =
  async (
    companyId: string
  ) => {

    const company =
      await prisma.company.findUnique({
        where: {
          id: companyId,
        },

        select: {
          id: true,

          name: true,

          upiId: true,

          upiName: true,
        },
      });

    if (!company) {

      throw new Error(
        "Company not found"
      );
    }

    return company;
  };

// =========================================
// UPDATE SETTINGS
// =========================================

type UpdateCompanySettingsInput = {

  upiId?: string;

  upiName?: string;
};

export const updateCompanySettings =
  async (
    companyId: string,

    payload:
      UpdateCompanySettingsInput
  ) => {

    const {
      upiId,

      upiName,
    } = payload;

    const company =
      await prisma.company.update({
        where: {
          id: companyId,
        },

        data: {

          upiId,

          upiName,
        },

        select: {

          id: true,

          name: true,

          upiId: true,

          upiName: true,
        },
      });

    return company;
  };