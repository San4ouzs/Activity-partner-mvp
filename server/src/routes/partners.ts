
import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { requireAuth, AuthRequest } from "../util_auth.js";

const prisma = new PrismaClient();
const router = Router();

function haversineKm(lat1:number, lon1:number, lat2:number, lon2:number) {
  const toRad = (d:number)=> d*Math.PI/180;
  const R = 6371; // km
  const dLat = toRad(lat2-lat1);
  const dLon = toRad(lon2-lon1);
  const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*Math.sin(dLon/2)**2;
  const c = 2*Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R*c;
}

// Find nearby partners matching any of current user's activities within radius
router.get("/", requireAuth, async (req: AuthRequest, res) => {
  const me = await prisma.user.findUnique({ where: { id: req.user!.id }, include: { activities: true } });
  if (!me?.latitude || !me?.longitude) return res.status(400).json({ error: "Set your location first" });
  const myActivityIds = me.activities.map(a=>a.activityId);
  const candidates = await prisma.user.findMany({
    where: {
      id: { not: me.id },
      activities: { some: { activityId: { in: myActivityIds } } }
    },
    include: { activities: { include: { activity: true } } }
  });

  const within = candidates
    .map(c => {
      const dist = (c.latitude!=null && c.longitude!=null) ? haversineKm(me.latitude!, me.longitude!, c.latitude!, c.longitude!) : Infinity;
      return { ...c, distanceKm: dist };
    })
    .filter(c => c.distanceKm <= (me.radiusKm ?? 5));

  res.json(within.sort((a,b)=>a.distanceKm - b.distanceKm).slice(0,100));
});

export default router;
