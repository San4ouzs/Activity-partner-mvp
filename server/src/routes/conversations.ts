
import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { requireAuth, AuthRequest } from "../util_auth.js";

const prisma = new PrismaClient();
const router = Router();

router.post("/", requireAuth, async (req: AuthRequest, res) => {
  const { peerUserId } = req.body;
  if (!peerUserId) return res.status(400).json({ error: "peerUserId required" });

  // find or create a 1:1 conversation
  const existing = await prisma.conversation.findFirst({
    where: { participants: { some: { userId: req.user!.id } } },
    include: { participants: true }
  });

  // Better approach: find conversation with exactly these two users
  const convo = await prisma.conversation.findFirst({
    where: {
      participants: {
        some: { userId: req.user!.id },
      },
    },
    include: { participants: true }
  });

  const direct = await prisma.conversation.findFirst({
    where: {
      participants: {
        every: { userId: { in: [req.user!.id, peerUserId] } },
      },
    },
    include: { participants: true }
  });

  if (direct && direct.participants.length === 2) {
    return res.json(direct);
  }

  const created = await prisma.conversation.create({
    data: {
      participants: {
        create: [{ userId: req.user!.id }, { userId: peerUserId }]
      }
    },
    include: { participants: true }
  });
  res.json(created);
});

router.get("/:id/messages", requireAuth, async (req: AuthRequest, res) => {
  const { id } = req.params;
  const msgs = await prisma.message.findMany({
    where: { conversationId: id },
    orderBy: { createdAt: "asc" }
  });
  res.json(msgs);
});

export default router;
