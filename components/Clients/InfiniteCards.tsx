"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState, useRef } from "react";
import { motion, useAnimationControls, PanInfo } from "framer-motion";

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}: {
  items: {
    quote: string;
    name: string;
    title: string;
    id?: string;
  }[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}) => {
  // Main refs and state
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [currentDirection, setCurrentDirection] = useState<"left" | "right">(
    direction
  );
  const controls = useAnimationControls();
  const [isDragging, setIsDragging] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Process items to ensure they have IDs
  const processedItems = React.useMemo(() => {
    return items.map((item, index) => ({
      ...item,
      id: item.id || `item-${index}`,
    }));
  }, [items]);

  // Speed calculations
  const getSpeedConfig = () => {
    switch (speed) {
      case "fast":
        return { duration: 20 };
      case "normal":
        return { duration: 40 };
      case "slow":
        return { duration: 60 };
      default:
        return { duration: 40 };
    }
  };

  // Calculate animation parameters
  const calculateAnimationParams = () => {
    if (!containerRef.current) return { x: 0, duration: 40 };

    const listRef = containerRef.current.querySelector("ul");
    if (!listRef) return { x: 0, duration: 40 };

    // Get one-third of the total list width (representing one set of items)
    const singleSetWidth = listRef.scrollWidth / 3;
    const { duration } = getSpeedConfig();

    return {
      x: currentDirection === "left" ? -singleSetWidth : singleSetWidth,
      duration,
    };
  };

  // Start or restart animation
  const startAnimation = () => {
    if (isPaused || isDragging || !containerRef.current) return;

    const { x, duration } = calculateAnimationParams();

    controls.start({
      x,
      transition: {
        duration,
        ease: "linear",
        repeat: 0,
        onComplete: () => {
          // Reset position and start again for true infinite effect
          controls.set({ x: 0 });
          startAnimation();
        },
      },
    });
  };

  // Measure container on mount and resize
  useEffect(() => {
    const updateContainerWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateContainerWidth();
    window.addEventListener("resize", updateContainerWidth);

    return () => {
      window.removeEventListener("resize", updateContainerWidth);
    };
  }, []);

  // Handle direction changes
  useEffect(() => {
    controls.stop();
    startAnimation();
  }, [currentDirection, containerWidth, isPaused]);

  // Handle drag events with enhanced responsiveness
  const handleDragStart = () => {
    setIsDragging(true);
    controls.stop();
  };

  const handleDrag = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    // Update direction in real-time during drag
    if (Math.abs(info.delta.x) > 5) {
      setCurrentDirection(info.delta.x < 0 ? "left" : "right");
    }
  };

  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    setIsDragging(false);

    // Determine final drag direction
    if (Math.abs(info.offset.x) > 5) {
      setCurrentDirection(info.offset.x < 0 ? "left" : "right");
    }

    // Add a small delay before restarting animation
    setTimeout(() => {
      startAnimation();
    }, 50);
  };

  // Handle hover events
  const handleMouseEnter = () => {
    if (pauseOnHover) {
      setIsPaused(true);
      controls.stop();
    }
  };

  const handleMouseLeave = () => {
    if (pauseOnHover) {
      setIsPaused(false);
      if (!isDragging) {
        startAnimation();
      }
    }
  };

  // Start animation on mount
  useEffect(() => {
    const timeout = setTimeout(() => {
      startAnimation();
    }, 100);

    return () => clearTimeout(timeout);
  }, []);

  // Create duplicate items for the infinite effect
  const displayItems = React.useMemo(() => {
    // Create 3 sets of duplicates to ensure smooth infinite scrolling
    return [
      ...processedItems.map((item) => ({ ...item, id: `left-${item.id}` })),
      ...processedItems.map((item) => ({ ...item, id: `center-${item.id}` })),
      ...processedItems.map((item) => ({ ...item, id: `right-${item.id}` })),
    ];
  }, [processedItems]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 w-screen overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
        className
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.ul
        className="flex min-w-full shrink-0 gap-16 py-4 w-max flex-nowrap cursor-grab"
        animate={controls}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        whileTap={{ cursor: "grabbing" }}
      >
        {displayItems.map((item) => (
          <motion.li
            key={item.id}
            className="w-[90vw] max-w-full relative rounded-2xl border border-b-0 flex-shrink-0 border-slate-800 p-5 md:p-16 md:w-[60vw]"
            style={{
              background: "rgb(4,7,29)",
              backgroundImage:
                "linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)",
            }}
          >
            <blockquote>
              <div
                aria-hidden="true"
                className="user-select-none -z-1 pointer-events-none absolute -left-0.5 -top-0.5 h-[calc(100%_+_4px)] w-[calc(100%_+_4px)]"
              ></div>
              <span className="relative z-20 text-sm md:text-lg leading-[1.6] text-white font-normal">
                {item.quote}
              </span>
              <div className="relative z-20 mt-6 flex flex-row items-center">
                <div className="me-3">
                  <img src="/profile.svg" alt="profile" />
                </div>
                <span className="flex flex-col gap-1">
                  <span className="text-xl font-bold leading-[1.6] text-white">
                    {item.name}
                  </span>
                  <span className="text-sm leading-[1.6] text-white-200 font-normal">
                    {item.title}
                  </span>
                </span>
              </div>
            </blockquote>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
};
