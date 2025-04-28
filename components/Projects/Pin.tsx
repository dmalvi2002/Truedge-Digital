"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

export const PinContainer = ({
  children,
  title,
  href,
  className,
  containerClassName,
}: {
  children: React.ReactNode;
  title?: string;
  href?: string;
  className?: string;
  containerClassName?: string;
}) => {
  const [transform, setTransform] = useState(
    "translate(-50%,-50%) rotateX(0deg)"
  );

  const onMouseEnter = () => {
    setTransform("translate(-50%,-50%) rotateX(40deg) scale(0.8)");
  };
  const onMouseLeave = () => {
    setTransform("translate(-50%,-50%) rotateX(0deg) scale(1)");
  };

  const handleTitleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (href) {
      e.stopPropagation();
      window.open(href, "_blank");
    }
  };

  return (
    <div
      className={cn(
        "relative group/pin z-50 cursor-pointer",
        containerClassName
      )}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Title Tag - Positioned outside the perspective container */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-[100] opacity-0 group-hover/pin:opacity-100 transition-opacity duration-300">
        <button
          onClick={handleTitleClick}
          className="relative flex space-x-2 items-center rounded-full bg-zinc-950 py-2 px-5 ring-1 ring-white/10 cursor-pointer mt-4"
        >
          <span className="text-white text-sm font-bold whitespace-nowrap">
            {title}
          </span>
          <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 via-emerald-400/90 to-emerald-400/0 transition-opacity duration-500 group-hover:opacity-40"></span>
        </button>
      </div>

      <div
        style={{
          perspective: "1000px",
          transform: "rotateX(70deg) translateZ(0deg)",
        }}
        className="absolute left-1/2 top-1/2 ml-[0.09375rem] mt-4 -translate-x-1/2 -translate-y-1/2 lg:w-[30rem] md:w-[26rem] w-full"
      >
        <div
          style={{
            transform: transform,
          }}
          className="absolute left-1/2 p-4 top-1/2 flex justify-start items-start rounded-2xl shadow-[0_8px_16px_rgb(0_0_0/0.4)] border border-white/[0.1] group-hover/pin:border-white/[0.2] transition duration-700 overflow-hidden lg:w-[30rem] md:w-[26rem] backdrop-blur-md bg-black/30"
        >
          <div className={cn("relative z-50", className)}>{children}</div>
        </div>
      </div>
      <div className="h-80 w-full flex items-center justify-center">
        <PinEffects />
      </div>
    </div>
  );
};

// Separated the effects into their own component
const PinEffects = () => {
  return (
    <div className="w-full h-full -mt-7 flex-none inset-0">
      <div
        style={{
          perspective: "1000px",
          transform: "rotateX(70deg) translateZ(0)",
        }}
        className="absolute left-1/2 top-1/2 ml-[0.09375rem] mt-4 -translate-x-1/2 -translate-y-1/2"
      >
        <>
          {[0, 2, 4].map((delay) => (
            <motion.div
              key={delay}
              initial={{
                opacity: 0,
                scale: 0,
              }}
              animate={{
                opacity: [0, 1, 0.5, 0],
                scale: 1,
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                delay: delay,
              }}
              className="absolute left-1/2 top-1/2 h-[11.25rem] w-[11.25rem] rounded-[50%] bg-sky-500/[0.08] shadow-[0_8px_16px_rgb(0_0_0/0.4)] -translate-x-1/2 -translate-y-1/2"
            />
          ))}
        </>
      </div>

      <>
        <motion.div className="absolute right-1/2 bottom-1/2 bg-gradient-to-b from-transparent to-cyan-500 translate-y-[14px] w-px h-20 group-hover/pin:h-40 blur-[2px]" />
        <motion.div className="absolute right-1/2 bottom-1/2 bg-gradient-to-b from-transparent to-cyan-500 translate-y-[14px] w-px h-20 group-hover/pin:h-40" />
        <motion.div className="absolute right-1/2 translate-x-[1.5px] bottom-1/2 bg-cyan-600 translate-y-[14px] w-[4px] h-[4px] rounded-full z-40 blur-[3px]" />
        <motion.div className="absolute right-1/2 translate-x-[0.5px] bottom-1/2 bg-cyan-300 translate-y-[14px] w-[2px] h-[2px] rounded-full z-40" />
      </>
    </div>
  );
};
