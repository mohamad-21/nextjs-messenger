import React from "react";

interface LogoProps {
  size?: number | string;
  fill?: boolean
}

function Logo({ size = "120", fill }: LogoProps) {
  return (
    <img
      src="/logo.png"
      className={`${fill ? "p-2 bg-primary rounded-full" : ""} mx-auto`}
      width={size}
      alt="Logo"
    />
  )
}

export default Logo;
