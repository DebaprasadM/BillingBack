import { Prisma } from "@prisma/client";
import prisma from "../../config/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// 1--------------register======================

export const registerUser = async (data: {
  email: string;
  password: string;
  companyName: string;
}) => {
  const { email, password, companyName } = data;

  const hashed = await bcrypt.hash(password, 10);

  return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const user = await tx.user.create({
      data: {
        email,
        password: hashed,
      },
    });

    const company = await tx.company.create({
      data: {
        name: companyName,
      },
    });

    await tx.membership.create({
      data: {
        userId: user.id,
        companyId: company.id,
        role: "OWNER",
      },
    });

    return { user, company };
  });
};

// 2---------------------login=========================


export const loginUser = async (data: {
  email: string;
  password: string;
}) => {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
    include: {
      memberships: true,
    },
  });

  if (!user) throw new Error("User not found");

  const isMatch = await bcrypt.compare(data.password, user.password);
  if (!isMatch) throw new Error("Invalid password");

  const membership = user.memberships[0]; // first company

  const token = jwt.sign(
    {
      userId: user.id,
      companyId: membership.companyId,
    },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );

  return { token };
};