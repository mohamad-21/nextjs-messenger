import React from "react";

function DefaultProfilePhoto({ name, w = "54px" }: { name?: string, w?: string }) {
  return (
    <div className={`w-[${w}] h-[${w}] rounded-full border border-muted flex items-center justify-center text-lg uppercase bg-muted`}>{name || ""}</div>
  )
}

export default DefaultProfilePhoto;
