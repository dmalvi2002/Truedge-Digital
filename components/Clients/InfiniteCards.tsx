"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState, useRef, useCallback } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";

// Register the Draggable plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(Draggable);
}

// Define interface for testimonial item
interface TestimonialItem {
  quote: string;
  name: string;
  title: string;
}

// Card Template Component Props Interface
interface CardTemplateProps {
  quote: string;
  name: string;
  title: string;
}

// Card Template Component
const CardTemplate: React.FC<CardTemplateProps> = ({ quote, name, title }) => (
  <li
    className="w-[90vw] max-w-full relative rounded-2xl border border-b-0 flex-shrink-0 border-slate-800 p-5 py-5 md:p-16 md:w-[60vw]"
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
        {quote}
      </span>
      <div className="relative z-20 mt-6 flex flex-row items-center">
        <div className="me-3">
          <img src="/profile.svg" alt="profile" />
        </div>
        <span className="flex flex-col gap-1">
          <span className="text-xl font-bold leading-[1.6] text-white">
            {name}
          </span>
          <span className="text-sm leading-[1.6] text-white-200 font-normal">
            {title}
          </span>
        </span>
      </div>
    </blockquote>
  </li>
);

// InfiniteMovingCards Component Props Interface
interface InfiniteMovingCardsProps {
  items: TestimonialItem[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}

export const InfiniteMovingCards: React.FC<InfiniteMovingCardsProps> = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLUListElement>(null);
  const [start, setStart] = useState<boolean>(false);
  const [currentDirection, setCurrentDirection] = useState<"left" | "right">(
    direction
  );
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const draggableRef = useRef<Draggable | null>(null);
  const isDragging = useRef<boolean>(false);
  const isAnimating = useRef<boolean>(false);
  const lastDragX = useRef<number>(0);
  const currentDragDirection = useRef<"left" | "right">(direction);

  // Store original items for reference
  const originalItems = useRef<TestimonialItem[]>(items);

  // Use a state for visible items (what's rendered)
  const [visibleItems, setVisibleItems] = useState<TestimonialItem[]>([]);

  // Initialize visible items - create a repeating pattern
  const initializeItems = useCallback(() => {
    if (!originalItems.current.length) return;

    // Create multiple sets of items to ensure enough content
    // Starting with 3 sets is usually enough for most screen sizes
    const repeatedItems = [
      ...originalItems.current,
      ...originalItems.current,
      ...originalItems.current,
    ];

    setVisibleItems(repeatedItems);
  }, []);

  // Get speed in pixels per second based on the speed prop
  const getSpeedValue = useCallback((): number => {
    switch (speed) {
      case "fast":
        return 60;
      case "normal":
        return 40;
      case "slow":
        return 20;
      default:
        return 40;
    }
  }, [speed]);

  // Calculate animation duration based on container width and speed
  const getAnimationDuration = useCallback((): number => {
    if (!containerRef.current || !scrollerRef.current) return 20;

    const containerWidth = containerRef.current.offsetWidth;
    const scrollerWidth = scrollerRef.current.scrollWidth;
    const itemWidth = scrollerWidth / visibleItems.length;

    // Calculate how many pixels we need to move for one full cycle
    // For one full cycle, we need to move the width of all original items
    const cycleDistance = itemWidth * originalItems.current.length;

    // Calculate duration based on pixel speed
    const pixelSpeed = getSpeedValue();
    const duration = cycleDistance / pixelSpeed;

    return duration;
  }, [visibleItems.length, getSpeedValue]);

  // Main animation function - uses a repeating pattern for smooth transition
  const startAnimation = useCallback(() => {
    if (!scrollerRef.current || !containerRef.current || isAnimating.current)
      return;

    // Kill any existing animation
    if (tweenRef.current) {
      tweenRef.current.kill();
    }

    isAnimating.current = true;

    // Check if we need to add more items to ensure smooth scrolling
    const containerWidth = containerRef.current.offsetWidth;
    const scrollerWidth = scrollerRef.current.scrollWidth;

    // If scroller width is not enough for smooth scrolling, add more items
    if (scrollerWidth < containerWidth * 3) {
      setVisibleItems((prev) => [...prev, ...originalItems.current]);
      // Delay starting animation to let the new items render
      setTimeout(() => {
        isAnimating.current = false;
        startAnimation();
      }, 50);
      return;
    }

    // Calculate single cycle distance - the width of original items set
    const itemSetWidth =
      (scrollerWidth / visibleItems.length) * originalItems.current.length;

    // Set initial position if needed
    const currentX = gsap.getProperty(scrollerRef.current, "x") as number;
    if (currentX === 0) {
      if (currentDirection === "left") {
        gsap.set(scrollerRef.current, { x: 0 });
      } else {
        gsap.set(scrollerRef.current, { x: -itemSetWidth });
      }
    }

    // Get duration based on speed setting
    const duration = getAnimationDuration();

    // Determine target based on current position and direction
    const targetX =
      currentDirection === "left"
        ? currentX - itemSetWidth // Move left by one set
        : currentX + itemSetWidth; // Move right by one set

    // Create the animation with proper easing for smoothness
    tweenRef.current = gsap.to(scrollerRef.current, {
      x: targetX,
      duration,
      ease: "linear",
      onComplete: () => {
        if (!scrollerRef.current) return;

        // When the animation completes, reset position to create infinite loop
        // This is done by moving the position back by one full cycle length
        const newX = gsap.getProperty(scrollerRef.current, "x") as number;

        if (currentDirection === "left") {
          // If we've moved far enough to the left, jump back right
          if (newX <= -itemSetWidth * 2) {
            gsap.set(scrollerRef.current, { x: newX + itemSetWidth });
          }
        } else {
          // If we've moved far enough to the right, jump back left
          if (newX >= 0) {
            gsap.set(scrollerRef.current, { x: newX - itemSetWidth });
          }
        }

        isAnimating.current = false;

        // Continue the animation
        startAnimation();
      },
    });
  }, [currentDirection, getAnimationDuration, visibleItems.length]);

  // Set up draggable functionality
  const setupDraggable = useCallback(() => {
    if (!scrollerRef.current) return;

    // Clean up existing draggable
    if (draggableRef.current) {
      draggableRef.current.kill();
    }

    draggableRef.current = Draggable.create(scrollerRef.current, {
      type: "x",
      inertia: true,
      onDragStart: function () {
        // Pause the animation
        if (tweenRef.current) tweenRef.current.pause();

        isDragging.current = true;
        lastDragX.current = this.x as number;
      },
      onDrag: function () {
        if (!scrollerRef.current) return;

        const currentX = this.x as number;

        // Determine drag direction
        if (currentX < lastDragX.current) {
          currentDragDirection.current = "left";
        } else if (currentX > lastDragX.current) {
          currentDragDirection.current = "right";
        }

        lastDragX.current = currentX;

        // Handle wrap-around during dragging
        const scrollerWidth = scrollerRef.current.scrollWidth;
        const itemSetWidth =
          (scrollerWidth / visibleItems.length) * originalItems.current.length;

        // If dragged too far left, wrap to right
        if (currentX < -scrollerWidth + containerRef.current!.offsetWidth) {
          this.x = currentX + itemSetWidth;
          lastDragX.current = this.x;
        }

        // If dragged too far right, wrap to left
        if (currentX > 0) {
          this.x = currentX - itemSetWidth;
          lastDragX.current = this.x;
        }
      },
      onDragEnd: function () {
        isDragging.current = false;

        // Update the direction state based on the drag
        setCurrentDirection(currentDragDirection.current);

        // Restart the animation
        isAnimating.current = false;
        startAnimation();
      },
    })[0];
  }, [startAnimation, visibleItems.length]);

  // Initialize on mount
  useEffect(() => {
    initializeItems();

    // Short delay to ensure DOM is ready
    const timeout = setTimeout(() => {
      setStart(true);
      setupDraggable();
      startAnimation();
    }, 100);

    return () => {
      clearTimeout(timeout);
      if (tweenRef.current) tweenRef.current.kill();
      if (draggableRef.current) draggableRef.current.kill();
      isAnimating.current = false;
    };
  }, [initializeItems, setupDraggable, startAnimation]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      // Reset and restart animation
      if (tweenRef.current) tweenRef.current.kill();

      // Check if we need to add more items based on new container width
      if (containerRef.current && scrollerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const scrollerWidth = scrollerRef.current.scrollWidth;

        if (scrollerWidth < containerWidth * 3) {
          setVisibleItems((prev) => [...prev, ...originalItems.current]);
        }
      }

      setupDraggable();

      if (start) {
        isAnimating.current = false;
        startAnimation();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setupDraggable, startAnimation, start, originalItems]);

  // Handle pause on hover
  useEffect(() => {
    if (!pauseOnHover || !containerRef.current) return;

    const handleMouseEnter = () => {
      if (tweenRef.current) tweenRef.current.pause();
    };

    const handleMouseLeave = () => {
      if (!isDragging.current && tweenRef.current) {
        tweenRef.current.play();
      }
    };

    containerRef.current.addEventListener("mouseenter", handleMouseEnter);
    containerRef.current.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener(
          "mouseenter",
          handleMouseEnter
        );
        containerRef.current.removeEventListener(
          "mouseleave",
          handleMouseLeave
        );
      }
    };
  }, [pauseOnHover]);

  // Update animation when direction changes
  useEffect(() => {
    if (start && !isDragging.current) {
      // Restart animation with new direction
      if (tweenRef.current) tweenRef.current.kill();
      isAnimating.current = false;
      startAnimation();
    }
  }, [currentDirection, start, startAnimation]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 w-screen overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
        className
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex min-w-full shrink-0 gap-16 py-4 w-max flex-nowrap cursor-grab",
          start && "will-change-transform"
        )}
        style={{
          // Use GPU acceleration for smoother animations
          transform: "translate3d(0, 0, 0)",
        }}
      >
        {visibleItems.map((item, index) => (
          <CardTemplate
            key={`testimonial-${index}`}
            quote={item.quote}
            name={item.name}
            title={item.title}
          />
        ))}
      </ul>
    </div>
  );
};
