import React from "react";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex-1 flex flex-col items-center justify-center py-10">
      {children}
    </main>
  )
}

export default Layout;
