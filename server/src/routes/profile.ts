
import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { requireAuth, AuthRequest } from "../util_auth.js";
import { z } from "zod";

const prisma = new PrismaClient();
const router = Router();

const profileSchema = z.object({
  displayName: z.string().min(1),
  latitude: z.number(),
  longitude: z.number(),
  radiusKm: z.number().min(0.5).max(100),
  activityKeys: z.array(z.string()).min(1)
});

router.get("/", requireAuth, async (req: AuthRequest, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user!.id }, include: { activities: { include: { activity: true } } } });
  res.json(user);
});

router.post("/", requireAuth, async (req: AuthRequest, res) => {
  const parsed = profileSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { displayName, latitude, longitude, radiusKm, activityKeys } = parsed.data;

  const user = await prisma.user.update({
    where: { id: req.user!.id },
    data: { displayName, latitude, longitude, radiusKm, activities: { deleteMany: {} } }
  });

  const acts = await prisma.activity.findMany({ where: { key: { in: activityKeys } } });
  const toLink = acts.map(a => ({ userId: user.id, activityId: a.id }));
  await prisma.userActivity.createMany({ data: toLink, skipDuplicates: true });

  const withActs = await prisma.user.findUnique({ where: { id: user.id }, include: { activities: { include: { activity: true } } } });
  res.json(withActs);
});

export default router;
