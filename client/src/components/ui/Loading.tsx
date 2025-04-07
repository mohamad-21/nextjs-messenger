import React from "react";

function Loading({ size = "sm" }: { size?: "sm" | "lg" }) {
  return (
    <div className={`${size === "sm" ? "px-1" : "p-3"} flex items-center justify-center`}>
      <svg xmlns="http://www.w3.org/2000/svg" width={35} height={35} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className=" animate-spin icon icon-tabler icons-tabler-outline icon-tabler-loader-2 text-primary"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 3a9 9 0 1 0 9 9" /></svg>
    </div>
  )
}

export default Loading;
