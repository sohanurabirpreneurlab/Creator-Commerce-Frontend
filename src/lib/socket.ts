import { io, type Socket } from "socket.io-client";
import { env } from "@/config/env";

export function connectNotificationSocket(token: string): Socket {
  return io(env.apiBaseUrl.replace(/\/api\/?$/, ""), {
    auth: { token },
    transports: ["websocket", "polling"],
  });
}
