
import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const router = Router();

router.post("/register", async (req, res) => {
  const { email, password, displayName } = req.body;
  if (!email || !password || !displayName) return res.status(400).json({ error: "Missing fields" });
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(400).json({ error: "Email already registered" });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { email, passwordHash, displayName } });
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || "dev_secret", { expiresIn: "30d" });
  res.json({ token, user: { id: user.id, email: user.email, displayName: user.displayName } });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Missing fields" });
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(400).json({ error: "Invalid email or password" });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(400).json({ error: "Invalid email or password" });
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || "dev_secret", { expiresIn: "30d" });
  res.json({ token, user: { id: user.id, email: user.email, displayName: user.displayName } });
});

export default router;
