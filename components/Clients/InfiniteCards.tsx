"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState, useRef } from "react";
import { motion, useAnimationControls } from "framer-motion";

interface Item {
  id?: string;
  quote: string;
  name: string;
  title: string;
}

interface InfiniteMovingCardsProps {
  items: Item[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}: InfiniteMovingCardsProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [duplicatedItems, setDuplicatedItems] = useState<Item[]>([]);
  const controls = useAnimationControls();

  // Speed mapping in seconds
  const speedMap = {
    fast: 25,
    normal: 40,
    slow: 60,
  };

  // Prepare duplicated items for infinite scroll effect
  useEffect(() => {
    // Create unique IDs for each copy to prevent React key warnings
    const itemsWithIds = items.map((item, i) => ({
      ...item,
      id: item.id || `item-${i}`,
    }));

    setDuplicatedItems([
      ...itemsWithIds.map((item) => ({ ...item, id: `left-${item.id}` })),
      ...itemsWithIds.map((item) => ({ ...item, id: `center-${item.id}` })),
      ...itemsWithIds.map((item) => ({ ...item, id: `right-${item.id}` })),
    ]);
  }, [items]);

  // Start the infinite animation
  useEffect(() => {
    if (!containerRef.current || duplicatedItems.length === 0) return;

    const startAnimation = () => {
      const container = containerRef.current;
      if (!container) return;
      const firstItemSet =
        (container.querySelector("ul") as HTMLUListElement)?.offsetWidth / 3 ||
        0;

      controls.start({
        x: direction === "left" ? -firstItemSet : firstItemSet,
        transition: {
          duration: speedMap[speed] || speedMap.normal,
          ease: "linear",
          repeat: Infinity,
          repeatType: "loop",
        },
      });
    };

    startAnimation();
  }, [controls, direction, duplicatedItems.length, speed]);

  // Handle pause on hover
  const handleMouseEnter = () => {
    if (pauseOnHover) {
      controls.stop();
    }
  };

  const handleMouseLeave = () => {
    if (pauseOnHover && containerRef.current) {
      const container = containerRef.current;
      const firstItemSet =
        (container.querySelector("ul") as HTMLUListElement)?.offsetWidth / 3 ||
        0;

      controls.start({
        x: direction === "left" ? -firstItemSet : firstItemSet,
        transition: {
          duration: speedMap[speed] || speedMap.normal,
          ease: "linear",
          repeat: Infinity,
          repeatType: "loop",
        },
      });
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative z-20 w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
        className
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.ul
        className="flex gap-4 py-4 w-max flex-nowrap"
        animate={controls}
        initial={{ x: 0 }}
      >
        {duplicatedItems.map((item) => (
          <li
            key={item.id}
            className="w-[280px] md:w-[400px] lg:w-[500px] relative rounded-2xl border border-slate-800 flex-shrink-0 p-4 md:p-6"
            style={{
              background: "rgb(4,7,29)",
              backgroundImage:
                "linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)",
            }}
          >
            <blockquote>
              <div
                aria-hidden="true"
                className="user-select-none pointer-events-none absolute -left-0.5 -top-0.5 h-[calc(100%_+_4px)] w-[calc(100%_+_4px)]"
              ></div>
              <span className="relative z-20 text-sm md:text-base leading-relaxed text-white font-normal">
                {item.quote}
              </span>
              <div className="relative z-20 mt-6 flex flex-row items-center">
                <div className="mr-3">
                  <img src="/profile.svg" alt="profile" />
                </div>
                <span className="flex flex-col gap-1">
                  <span className="text-lg font-bold text-white">
                    {item.name}
                  </span>
                  <span className="text-sm text-white/80 font-normal">
                    {item.title}
                  </span>
                </span>
              </div>
            </blockquote>
          </li>
        ))}
      </motion.ul>
    </div>
  );
};
