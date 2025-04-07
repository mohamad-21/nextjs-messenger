"use client";

import { getData } from "@/hooks/useFetch";
import React, { createContext, useContext, useEffect, useState } from "react";

const Socket = createContext<WebSocket | null>(null);

function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  useEffect(() => {
    getData("/api/user?bySession=true")
      .then(data => {
        setSocket(new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}${data.id ? `?userId=${data.id}` : ""}`));
      })
  }, []);

  return (
    <Socket.Provider value={socket}>{children}</Socket.Provider>
  )
}

export const useSocket = () => useContext(Socket);

export default SocketProvider;
