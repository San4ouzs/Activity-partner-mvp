
import { Server } from "socket.io";
import { prisma } from "./index.js";

export function wireSockets(io: Server) {
  io.on("connection", (socket) => {
    // client should emit "join", {conversationId}
    socket.on("join", ({ conversationId }) => {
      socket.join(conversationId);
    });

    // client emits "message", {conversationId, senderId, body}
    socket.on("message", async ({ conversationId, senderId, body }) => {
      const msg = await prisma.message.create({
        data: { conversationId, senderId, body }
      });
      io.to(conversationId).emit("message", msg);
    });
  });
}
