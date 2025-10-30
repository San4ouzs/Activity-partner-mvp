
import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

router.get("/", async (_, res) => {
  const activities = await prisma.activity.findMany({ orderBy: { label: "asc" } });
  res.json(activities);
});

export default router;
