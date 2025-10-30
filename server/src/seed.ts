
// Simple seed at server start (optional): we add default activities if not present
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function seedActivities() {
  const defaults = [
    { key: "jogging", label: "Jogging" },
    { key: "gym", label: "Gym Workout" },
    { key: "coffee", label: "Grab a Coffee" },
    { key: "study", label: "Study Session" },
    { key: "boardgames", label: "Board Games" },
    { key: "tennis", label: "Tennis" },
    { key: "cycling", label: "Cycling" },
    { key: "hiking", label: "Hiking" }
  ];
  for (const a of defaults) {
    await prisma.activity.upsert({ where: { key: a.key }, update: {}, create: a });
  }
}
seedActivities().finally(()=>prisma.$disconnect());
