"use client";

import { getData } from "@/hooks/useFetch";
import { getUserId, updateConnection } from "@/lib/actions/user.actions";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useSocket } from "./SocketProvider";

function ConnectionUpdater() {
  const pathname = usePathname();
  const socket = useSocket();

  async function changeConnection(status: "offline" | "online") {
    await updateConnection({ status });
  }

  useEffect(() => {
    if (!socket) return;
    socket.addEventListener("open", (event) => {
      getData("/api/user?bySession=true")
        .then(data => {
          socket.send(JSON.stringify({
            type: "connection",
            id: data.id,
            connected: true
          }));
          // changeConnection("online");
        });
    });

  }, [socket]);

  return null;
}

export default ConnectionUpdater;
