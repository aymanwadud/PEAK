"use client";

import { VoiceProvider } from "@humeai/voice-react";
import Messages from "./Messages";
import Controls from "./Controls";
import StartCall from "./StartCall";
import { ComponentRef, useRef } from "react";

interface ClientComponentProps {
  accessToken: string;
  isSidebarOpen: boolean;
}

export default function ClientComponent({
  accessToken,
  isSidebarOpen,
}: ClientComponentProps) {
  const timeout = useRef<number | null>(null);
  const ref = useRef<ComponentRef<typeof Messages> | null>(null);
  const configId = process.env.NEXT_PUBLIC_HUME_EVI_CONFIG_ID;

  if (!configId) {
    console.warn('No EVI configuration ID found in environment variables. Using default configuration.');
  }

  return (
    <div className="relative grow flex flex-col mx-auto w-full overflow-hidden h-[0px]">
      <VoiceProvider
        configId={configId}
        auth={{ type: "accessToken", value: accessToken }}
        onMessage={() => {
          if (timeout.current) {
            window.clearTimeout(timeout.current);
          }

          timeout.current = window.setTimeout(() => {
            if (ref.current) {
              const scrollHeight = ref.current.scrollHeight;
              ref.current.scrollTo({
                top: scrollHeight,
                behavior: "smooth",
              });
            }
          }, 200);
        }}
      >
        <Messages ref={ref} />
        <Controls />
        <StartCall isSidebarOpen={isSidebarOpen} />
      </VoiceProvider>
    </div>
  );
}
