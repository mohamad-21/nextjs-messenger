import React from "react";

interface Props extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode,
}

export function Title({ children, ...props }: Props) {
  return <h1 {...props} className={`md:text-4xl sm:text-3xl text-2xl font-semibold ${props.className || ""}`}>{children}</h1>;
}

export function Subtitle({ children, ...props }: Props) {
  return <h2 {...props} className={`text-[15px] text-zinc-400 font-medium ${props.className || ""}`}>{children}</h2>;
}