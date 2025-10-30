
import { io } from "socket.io-client";
const BASE = process.env.EXPO_PUBLIC_WS_BASE || "http://localhost:8080";
export const socket = io(BASE, { transports: ["websocket"] });
