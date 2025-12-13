"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function LegacyApp({ markup }: { markup: string }) {
  const pathname = usePathname();

  useEffect(() => {
    // Boot after the legacy DOM is present.
    void import("@/legacy/boot");
  }, []);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 18, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.99 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        style={{ minHeight: "100svh", height: "100%" }}
        dangerouslySetInnerHTML={{ __html: markup }}
      />
    </AnimatePresence>
  );
}


