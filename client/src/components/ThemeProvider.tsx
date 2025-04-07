"use client";

import { useClientLoad } from "@/hooks/useClientLoad";
import { ThemeProvider as NextThemeProvider } from "next-themes";

function ThemeProvider({ children }: { children: React.ReactNode }) {
  // const { connected, messages, connect, disconnect } = useSocket();
  // const { toast } = useToast();
  const isClient = useClientLoad();

  // useEffect(() => {
  //   if (connected) {
  //     toast({
  //       title: "Socket connection established",
  //       description: "Successfully connected to socket server",
  //       action: <ToastAction altText="connection established">OK</ToastAction>,
  //     });
  //   }
  // }, [connected]);

  if (!isClient) return;

  return (
    <NextThemeProvider
      attribute="class"
      forcedTheme="dark"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemeProvider>
  );
}

export default ThemeProvider;
