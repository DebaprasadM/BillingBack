import { Request, Response } from "express";
import { loginUser, registerUser } from "./auth.service.js";
// import { registerUser } from "./service.js";


// 1-------------------register===================
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, companyName } = req.body;

    const result = await registerUser({
      email,
      password,
      companyName,
    });

    res.json({
      message: "User registered successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({ error: "Registration failed" });
  }
};

// 2-----------------------login=========================
export const login = async (req: Request, res: Response) => {
  try {
    const result = await loginUser(req.body);
    res.json(result);
  } catch (err:any) {
   res.status(400).json({
      message: err.message || "Login failed",
    });  }
};