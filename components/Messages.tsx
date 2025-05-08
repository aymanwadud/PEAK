"use client";
import { cn } from "@/utils";
import { useVoice } from "@humeai/voice-react";
import Expressions from "./Expressions";
import { AnimatePresence, motion } from "framer-motion";
import { ComponentRef, forwardRef } from "react";
import { useSession } from "@/context/SessionContext";

const Messages = forwardRef<
  ComponentRef<typeof motion.div>,
  Record<never, never>
>(function Messages(_, ref) {
  const { messages } = useVoice();
  const { sessionType } = useSession();

  const getSessionBadge = () => {
    if (!sessionType) return null;
    const isPreSession = sessionType === 'pre-session';
    
    return (
      <div className={cn(
        "px-3 py-1 rounded-full text-xs font-medium inline-flex items-center",
        isPreSession ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
      )}>
        {isPreSession ? "Pre-Session" : "Post-Session"}
      </div>
    );
  };

  return (
    <motion.div
      layoutScroll
      className="flex-1 min-h-0 overflow-y-auto relative flex flex-col"
      ref={ref}
    >
      <motion.div
        className="max-w-2xl mx-auto w-full flex flex-col gap-4 p-4"
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
