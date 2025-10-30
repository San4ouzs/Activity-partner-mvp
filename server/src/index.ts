
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import http from "http";
import { Server } from "socket.io";
import authRouter from "./routes/auth.js";
import profileRouter from "./routes/profile.js";
import activitiesRouter from "./routes/activities.js";
import partnersRouter from "./routes/partners.js";
import conversationsRouter from "./routes/conversations.js";
import { wireSockets } from "./socket.js";

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: process.env.CORS_ORIGIN || "*" } });
export const prisma = new PrismaClient();
app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json());

app.get("/", (_, res) => res.json({ ok: true }));
app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/activities", activitiesRouter);
app.use("/partners", partnersRouter);
app.use("/conversations", conversationsRouter);

wireSockets(io);

const port = Number(process.env.PORT) || 8080;
server.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
