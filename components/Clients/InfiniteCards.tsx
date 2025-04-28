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

  // Get speed in pixels per second based on the speed prop
  const getSpeedValue = useCallback((): number => {
    switch (speed) {
      case "fast":
        return 80;
      case "normal":
        return 50;
      case "slow":
        return 30;
      default:
        return 50;
    }
  }, [speed]);

  // Calculate animation duration based on distance and speed
  const getAnimationDuration = useCallback(
    (distance: number): number => {
      // Calculate duration based on pixel speed
      const pixelSpeed = getSpeedValue();
      const duration = Math.abs(distance) / pixelSpeed;

      return duration;
    },
    [getSpeedValue]
  );

  // Check if the scroller has reached the bounds and should reverse direction
  const checkBoundsAndDirection = useCallback(() => {
    if (!scrollerRef.current || !containerRef.current) return currentDirection;

    const containerWidth = containerRef.current.offsetWidth;
    const scrollerWidth = scrollerRef.current.scrollWidth;
    const currentX = gsap.getProperty(scrollerRef.current, "x") as number;

    // Calculate the leftmost and rightmost bounds
    const leftBound = -(scrollerWidth - containerWidth);
    const rightBound = 0;

    // Determine if we need to change direction
    if (currentDirection === "left" && currentX <= leftBound + 5) {
      // We've reached the left end, start moving right
      return "right";
    } else if (currentDirection === "right" && currentX >= rightBound - 5) {
      // We've reached the right end, start moving left
      return "left";
    }

    // No direction change needed
    return currentDirection;
  }, [currentDirection]);

  // Main animation function - moves cards and reverses direction at bounds
  const startAnimation = useCallback(() => {
    if (!scrollerRef.current || !containerRef.current || isAnimating.current)
      return;

    // Kill any existing animation
    if (tweenRef.current) {
      tweenRef.current.kill();
    }

    isAnimating.current = true;

    // Check if we need to change direction
    const newDirection = checkBoundsAndDirection();
    if (newDirection !== currentDirection) {
      setCurrentDirection(newDirection);
      // Allow the effect to run
      isAnimating.current = false;
      return;
    }

    // Calculate bounds
    const containerWidth = containerRef.current.offsetWidth;
    const scrollerWidth = scrollerRef.current.scrollWidth;
    const leftBound = -(scrollerWidth - containerWidth);
    const rightBound = 0;

    // Get current position
    const currentX = gsap.getProperty(scrollerRef.current, "x") as number;

    // Calculate target position based on direction
    let targetX;
    if (currentDirection === "left") {
      // Moving left, target the left bound
      targetX = leftBound;
    } else {
      // Moving right, target the right bound
      targetX = rightBound;
    }

    // Calculate distance and duration
    const distance = targetX - currentX;
    const duration = getAnimationDuration(distance);

    // Create the animation with proper easing for smoothness
    tweenRef.current = gsap.to(scrollerRef.current, {
      x: targetX,
      duration,
      ease: "linear",
      onUpdate: function () {
        // Periodically check if we should update the direction
        // This handles the case when a user resizes the window during animation
        if (this.progress() % 0.1 < 0.01) {
          // Check roughly every 10% of the animation
          const shouldChangeDirection =
            checkBoundsAndDirection() !== currentDirection;
          if (shouldChangeDirection) {
            tweenRef.current?.kill();
            isAnimating.current = false;
            startAnimation();
          }
        }
      },
      onComplete: () => {
        // When animation completes, check direction again and restart
        const newDirection = checkBoundsAndDirection();
        if (newDirection !== currentDirection) {
          setCurrentDirection(newDirection);
        }

        isAnimating.current = false;
        startAnimation();
      },
    });
  }, [currentDirection, checkBoundsAndDirection, getAnimationDuration]);

  // Set up draggable functionality
  const setupDraggable = useCallback(() => {
    if (!scrollerRef.current) return;

    // Clean up existing draggable
    if (draggableRef.current) {
      draggableRef.current.kill();
    }

    draggableRef.current = Draggable.create(scrollerRef.current, {
      type: "x",
      bounds: containerRef.current,
      inertia: true,
      onDragStart: function () {
        // Pause the animation
        if (tweenRef.current) tweenRef.current.pause();

        isDragging.current = true;
        lastDragX.current = this.x as number;
      },
      onDrag: function () {
        const currentX = this.x as number;

        // Determine drag direction
        if (currentX < lastDragX.current) {
          currentDragDirection.current = "left";
        } else if (currentX > lastDragX.current) {
          currentDragDirection.current = "right";
        }

        lastDragX.current = currentX;
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

    // Set proper bounds for the draggable
    if (containerRef.current && scrollerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const scrollerWidth = scrollerRef.current.scrollWidth;

      draggableRef.current.applyBounds({
        minX: -(scrollerWidth - containerWidth),
        maxX: 0,
      });
    }
  }, [startAnimation]);

  // Initialize on mount
  useEffect(() => {
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
  }, [setupDraggable, startAnimation]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      // Reset and restart animation
      if (tweenRef.current) tweenRef.current.kill();

      setupDraggable();

      if (start) {
        isAnimating.current = false;
        startAnimation();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setupDraggable, startAnimation, start]);

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
        {originalItems.current.map((item, index) => (
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
