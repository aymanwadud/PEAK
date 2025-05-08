"use client";

import { useVoice } from "@humeai/voice-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "./ui/button";
import { Phone } from "lucide-react";
import { useSession } from "@/context/SessionContext";
import { useEffect } from "react";

interface StartCallProps {
  isSidebarOpen: boolean;
}

export default function StartCall({ isSidebarOpen }: StartCallProps) {
  const { status, connect } = useVoice();
  const { sessionId, sessionType } = useSession();

  useEffect(() => {
    // Clean up voice connection when component unmounts or session changes
    return () => {
      if (status.value === "connected") {
        // Add any cleanup needed for the voice connection
      }
    };
  }, [status.value]);

  return (
    <AnimatePresence>
      {status.value !== "connected" ? (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-background"
          initial="initial"
          animate="enter"
          exit="exit"
          variants={{
            initial: {
              opacity: 0,
              y: 20,
            },
            enter: {
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.3,
              },
            },
            exit: {
              opacity: 0,
              y: 20,
              transition: {
                duration: 0.2,
              },
            },
          }}
          style={{
            marginLeft: isSidebarOpen ? "280px" : "0",
            transition: "margin-left 0.2s ease-in-out",
          }}
        >
          <div className="flex flex-col items-center justify-center space-y-12 p-4">
            <h1 className="text-4xl font-bold tracking-tight whitespace-nowrap">
              What's on your mind right now?
            </h1>
            <Button
              size="lg"
              onClick={() => connect()}
              className="gap-2"
            >
              <Phone className="w-4 h-4" />
              Start Call
            </Button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
