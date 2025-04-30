"use client";
import { cn } from "@/utils";
import { useVoice } from "@humeai/voice-react";
import Expressions from "./Expressions";
import { AnimatePresence, motion } from "framer-motion";
import { ComponentRef, forwardRef } from "react";
import { useGameSession } from "@/context/GameSessionContext";

const Messages = forwardRef<
  ComponentRef<typeof motion.div>,
  Record<never, never>
>(function Messages(_, ref) {
  const { messages } = useVoice();
  const { sessionType } = useGameSession();

  const getSessionBadge = () => {
    if (!sessionType) return null;
    const isPreGame = sessionType === 'pre-game';
    
    return (
      <div className={cn(
        "px-3 py-1 rounded-full text-xs font-medium inline-flex items-center",
        isPreGame ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
      )}>
        {isPreGame ? "Pre-Game Session" : "Post-Game Session"}
      </div>
    );
  };

  return (
    <motion.div
      layoutScroll
      className="flex-1 h-full overflow-y-auto p-4 relative flex flex-col"
      ref={ref}
      style={{ maxHeight: "calc(100vh - 200px)" }} // Add fixed max height
    >
      <motion.div
        className="max-w-2xl mx-auto w-full flex flex-col gap-4 min-h-full"
      >
        {sessionType && (
          <div className="flex justify-center mb-4">
            {getSessionBadge()}
          </div>
        )}
        <AnimatePresence mode="popLayout">
          {messages.map((msg, index) => {
            if (
              msg.type === "user_message" ||
              msg.type === "assistant_message"
            ) {
              return (
                <motion.div
                  key={msg.type + index}
                  className={cn(
                    "w-[80%]",
                    "bg-card",
                    "border border-border rounded",
                    msg.type === "user_message" ? "ml-auto" : "",
                  )}
                  initial={{
                    opacity: 0,
                    y: 10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: 0,
                  }}
                >
                  <div
                    className={cn(
                      "text-xs capitalize font-medium leading-none opacity-50 pt-4 px-3",
                    )}
                  >
                    {msg.message.role}
                  </div>
                  <div className="pb-3 px-3">{msg.message.content}</div>
                  <Expressions values={msg.models.prosody?.scores} />
                </motion.div>
              );
            }

            return null;
          })}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
});

export default Messages;
