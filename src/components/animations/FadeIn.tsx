"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

type FadeInProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  fullWidth?: boolean;
  padding?: boolean;
};

export function FadeIn({
  children,
  className = "",
  delay = 0,
  direction = "up",
  fullWidth = false,
  padding = true,
}: FadeInProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });

  const directionOffset = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { x: 40, y: 0 },
    right: { x: -40, y: 0 },
  };

  return (
    <div
      ref={ref}
      className={`${fullWidth ? "w-full" : ""} ${padding ? "px-0" : ""} ${className}`}
    >
      <motion.div
        initial={{
          opacity: 0,
          ...directionOffset[direction],
        }}
        animate={{
          opacity: isInView ? 1 : 0,
          x: isInView ? 0 : directionOffset[direction].x,
          y: isInView ? 0 : directionOffset[direction].y,
        }}
        transition={{
          duration: 0.8,
          delay: delay,
          ease: [0.21, 0.47, 0.32, 0.98], // Apple-style ease-out
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export function StaggerContainer({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ staggerChildren: 0.1, delayChildren: delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.21, 0.47, 0.32, 0.98] as any,
    },
  },
};

export const MotionDiv = motion.div;

