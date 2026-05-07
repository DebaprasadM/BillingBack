import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) throw new Error("No token");

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      companyId: string;
    };

    (req as any).user = decoded;

    next();
  } catch (err) {
    res.status(401).json({ error: "Unauthorized" });
  }
};