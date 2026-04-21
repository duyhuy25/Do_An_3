import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const SECRET = "mysecretkey";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Bạn chưa đăng nhập!" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET);
    (req as any).user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token không hợp lệ!" });
  }
};