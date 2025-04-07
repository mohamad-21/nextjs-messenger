import ConnectionUpdater from "@/components/ConnectionUpdater";
import SocketProvider from "@/components/SocketProvider";
import TopHeaderWrapper from "@/components/ui/TopHeaderWrapper";
import React from "react";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SocketProvider>
      <main className="flex-1 flex flex-col">
        <ConnectionUpdater />
        {children}
      </main>
    </SocketProvider>
  )
}

export default Layout;
