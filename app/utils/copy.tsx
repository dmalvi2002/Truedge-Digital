"use client";
import React, { useState, useEffect, useRef } from "react";

interface CustomCursorProps {
  color?: string;
  size?: number;
  hoverScale?: number;
  buttonFillColor?: string;
  enableRipple?: boolean;
  // New props for better control
  followSpeed?: number; // Controls how fast cursor follows mouse (1-10)
  disableOnMobile?: boolean; // Disable on mobile devices
}

const CustomCursor: React.FC<CustomCursorProps> = ({
  color = "#3b82f6", // Default blue color
  size = 40, // Default size
  hoverScale = 1.5,
  buttonFillColor = "rgba(59, 130, 246, 0.5)", // Semi-transparent blue
  enableRipple = true,
  followSpeed = 10000, // Default follow speed (medium)
  disableOnMobile = true, // Disable on mobile by default
}) => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const rippleContainerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [actualPosition, setActualPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false); // Start hidden
  const [isHoveringButton, setIsHoveringButton] = useState(false);
  const [ripples, setRipples] = useState<
    { id: string; x: number; y: number; size: number }[]
  >([]);
  const [isMobile, setIsMobile] = useState(false);

  // Use useRef for tracking state that shouldn't trigger re-renders
  const rippleCounterRef = useRef(0);
  const lastMousePosRef = useRef({ x: 0, y: 0 });
  const lastRenderTimeRef = useRef(Date.now());
  const lastClickTimeRef = useRef(0);
  const isMouseDownRef = useRef(false);
  const animationFrameIdRef = useRef<number | null>(null);

  // Track active button elements
  const activeButtonsRef = useRef<Set<HTMLElement>>(new Set());

  // Calculated inner circle size (percentage of total cursor size)
  const innerCircleSize = 30; // 30% of the cursor size

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      const isTouchDevice =
        "ontouchstart" in window || navigator.maxTouchPoints > 0;

      setIsMobile(isTouchDevice);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, [disableOnMobile]);

  // Initialize and clean up button styles
  useEffect(() => {
    // Don't set up if on mobile and disableOnMobile is true
    if (isMobile && disableOnMobile) return;

    // Function to set up buttons
    const setupButtons = () => {
      const buttons = document.querySelectorAll("button,a");
      buttons.forEach((button) => {
        if (button instanceof HTMLElement) {
          // Only set up if not already initialized
          if (!button.classList.contains("cursor-btn")) {
            button.classList.add("cursor-btn");

            // Create the fill element for each button
            const fillElement = document.createElement("span");
            fillElement.classList.add("btn-fill");
            fillElement.style.position = "absolute";
            fillElement.style.inset = "0";
            fillElement.style.backgroundColor = buttonFillColor;
            fillElement.style.transform = "scale(0)";
            fillElement.style.transformOrigin = "center";
            fillElement.style.transition =
              "transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)";
            fillElement.style.zIndex = "-1";
            fillElement.style.borderRadius = "inherit";
            button.style.position = button.style.position || "relative";
            button.style.overflow = "hidden";
            button.appendChild(fillElement);
          }
        }
      });
    };

    // Initial setup
    setupButtons();

    // Set up a MutationObserver to handle dynamically added buttons
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length > 0) {
          setupButtons();
        }
      });
    });

    // Start observing the document with the configured parameters
    observer.observe(document.body, { childList: true, subtree: true });

    // Cleanup function
    return () => {
      observer.disconnect();

      // Clean up all button styles
      const buttons = document.querySelectorAll(".cursor-btn");
      buttons.forEach((button) => {
        if (button instanceof HTMLElement) {
          button.classList.remove("cursor-btn");
          button.style.boxShadow = "";
          button.style.transform = "";
          button.style.transition = "";

          // Remove fill elements
          const fill = button.querySelector(".btn-fill");
          if (fill) fill.remove();
        }
      });
    };
  }, [buttonFillColor, isMobile, disableOnMobile]);

  // Smooth animation loop for cursor movement
  useEffect(() => {
    // Don't run animation if on mobile and disableOnMobile is true
    if (isMobile && disableOnMobile) return;

    // Normalized follow speed (0.01-0.2)
    const normalizedSpeed = Math.max(0.05, Math.min(0.4, followSpeed / 25));

    // Normalized distance factor (0-1)
    const distanceFactor = Math.max(0, Math.min(1, 1 - normalizedSpeed));

    const animateCursor = () => {
      const now = Date.now();
      const deltaTime = now - lastRenderTimeRef.current;
      lastRenderTimeRef.current = now;

      // Calculate speed factor based on deltaTime to ensure consistent speed
      const speedFactor = normalizedSpeed * (deltaTime / 16.67); // 16.67ms is ~60fps

      // Get current mouse position
      const mousePos = lastMousePosRef.current;

      // Calculate next position with easing
      // No offset needed anymore since we want to center on the mouse
      const nextX =
        actualPosition.x + (mousePos.x - actualPosition.x) * speedFactor;
      const nextY =
        actualPosition.y + (mousePos.y - actualPosition.y) * speedFactor;

      // Update actual position
      setActualPosition({ x: nextX, y: nextY });

      // Request next frame
      animationFrameIdRef.current = requestAnimationFrame(animateCursor);
    };

    // Start animation loop
    animationFrameIdRef.current = requestAnimationFrame(animateCursor);

    // Cleanup
    return () => {
      if (animationFrameIdRef.current !== null) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [followSpeed, size, isMobile, disableOnMobile, actualPosition]);

  // Handle mouse events
  useEffect(() => {
    // Don't set up event listeners if on mobile and disableOnMobile is true
    if (isMobile && disableOnMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };

      // Only update visibility if needed
      if (!isVisible) {
        setIsVisible(true);
      }
    };

    const handleMouseDown = () => {
      isMouseDownRef.current = true;
    };

    const handleMouseUp = () => {
      isMouseDownRef.current = false;
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(!isHoveringButton);
      // Reset position to avoid jumps when re-entering window
      lastMousePosRef.current = {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      };
      setActualPosition(lastMousePosRef.current);
    };

    // Handle click for ripple effect
    const handleClick = (e: MouseEvent) => {
      if (!enableRipple) return;

      const now = Date.now();
      // Prevent creating too many ripples in quick succession
      if (now - lastClickTimeRef.current < 150) return;
      lastClickTimeRef.current = now;

      const rippleId = `ripple-${Date.now()}-${rippleCounterRef.current++}`;
      const rippleSize = Math.random() * 20 + 40; // Random size between 40-60px

      // Add a new ripple
      setRipples((prevRipples) => [
        ...prevRipples,
        { id: rippleId, x: e.clientX, y: e.clientY, size: rippleSize },
      ]);

      // Remove the ripple after animation completes
      setTimeout(() => {
        setRipples((prevRipples) =>
          prevRipples.filter((r) => r.id !== rippleId)
        );
      }, 1000);
    };

    // Add button hover events
    const onButtonHover = (e: Event) => {
      const button = e.currentTarget as HTMLElement;

      // Track this button as active
      activeButtonsRef.current.add(button);
      setIsHoveringButton(true);

      // Apply morph animation
      morphCursorToButton(button);
    };

    const onButtonUnhover = (e: Event) => {
      const button = e.currentTarget as HTMLElement;

      // Remove from active buttons
      activeButtonsRef.current.delete(button);

      // Only set isHoveringButton to false if no other buttons are being hovered
      if (activeButtonsRef.current.size === 0) {
        setIsHoveringButton(false);
      }

      // Reset button styles
      resetButtonStyles(button);

      // Restore cursor if no more buttons are being hovered
      if (activeButtonsRef.current.size === 0) {
        restoreCursor();
      }
    };

    // Add event listeners
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("click", handleClick);

    // Apply hover effects to all buttons - with a slight delay to ensure they're ready
    setTimeout(() => {
      const buttons = document.querySelectorAll(".cursor-btn");
      buttons.forEach((button) => {
        button.addEventListener("mouseenter", onButtonHover);
        button.addEventListener("mouseleave", onButtonUnhover);
      });
    }, 100);

    // Cleanup
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("click", handleClick);

      const buttons = document.querySelectorAll(".cursor-btn");
      buttons.forEach((button) => {
        button.removeEventListener("mouseenter", onButtonHover);
        button.removeEventListener("mouseleave", onButtonUnhover);
      });
    };
  }, [enableRipple, isHoveringButton, isVisible, isMobile, disableOnMobile]);

  // Function to morph cursor to button
  const morphCursorToButton = (button: HTMLElement) => {
    // Get the button's fill element
    const fill = button.querySelector(".btn-fill") as HTMLElement;
    if (fill) {
      // Get button dimensions and position
      const rect = button.getBoundingClientRect();

      // Set the transform origin to cursor position
      const x = lastMousePosRef.current.x - rect.left;
      const y = lastMousePosRef.current.y - rect.top;

      // Calculate transition duration based on followSpeed (faster speed = shorter transition)
      const fillTransitionDuration = Math.max(0.3, 0.7 - followSpeed / 300);

      fill.style.transformOrigin = `${x}px ${y}px`;
      fill.style.transform = "scale(3)";
      fill.style.transition = `transform ${fillTransitionDuration}s cubic-bezier(0.34, 1.56, 0.64, 1)`;

      // Add subtle glow effect
      button.style.boxShadow = `0 0 15px ${color}80`;

      // Also adjust button transition based on followSpeed
      const buttonTransitionDuration = Math.max(0.2, 0.6 - followSpeed / 300);
      button.style.transition = `all ${buttonTransitionDuration}s cubic-bezier(0.34, 1.56, 0.64, 1)`;
    }

    // Animate cursor to morph and disappear
    if (cursorRef.current) {
      const rect = button.getBoundingClientRect();
      const buttonCenterX = rect.left + rect.width / 2;
      const buttonCenterY = rect.top + rect.height / 2;

      // Calculate morph animation duration based on followSpeed
      const morphDuration = Math.max(0.15, 0.5 - followSpeed / 400);

      // Smooth morph animation with speed-adjusted duration
      cursorRef.current.style.transform = `translate(${
        buttonCenterX - size / 2
      }px, ${buttonCenterY - size / 2}px) scale(0)`;
      cursorRef.current.style.opacity = "0";
      cursorRef.current.style.transition = `transform ${morphDuration}s cubic-bezier(0.34, 1.56, 0.64, 1), opacity ${
        morphDuration * 0.6
      }s ease`;
    }
  };

  // Function to reset button styles
  const resetButtonStyles = (button: HTMLElement) => {
    const fill = button.querySelector(".btn-fill") as HTMLElement;
    if (fill) {
      // Calculate transition duration based on followSpeed
      const resetDuration = Math.max(0.2, 0.5 - followSpeed / 300);

      fill.style.transition = `transform ${resetDuration}s cubic-bezier(0.34, 1.56, 0.64, 1)`;
      fill.style.transform = "scale(0)";
    }

    // Remove the glow
    button.style.boxShadow = "none";
  };

  // Function to restore cursor after button unhover
  const restoreCursor = () => {
    if (cursorRef.current) {
      cursorRef.current.style.transform = `translate(${
        actualPosition.x - size / 2
      }px, ${actualPosition.y - size / 2}px) scale(1)`;
      cursorRef.current.style.opacity = "1";

      // Calculate transition duration based on followSpeed (faster speed = shorter transition)
      // Convert the followSpeed from range 1-150 to transition seconds 0.6-0.1
      const transitionDuration = Math.max(0.01, 0.1 - followSpeed / 300);

      cursorRef.current.style.transition = `transform ${transitionDuration}s ease-out, opacity 0.1s ease`;
    }
  };

  // Update cursor DOM element position when actualPosition changes
  useEffect(() => {
    if (cursorRef.current && !isHoveringButton && isVisible) {
      // Calculate transition duration based on followSpeed (faster speed = shorter transition)
      const transitionDuration = Math.max(0.1, 0.6 - followSpeed / 200);

      cursorRef.current.style.transition = `transform ${transitionDuration}s ease-out, opacity 0.2s ease`;
      cursorRef.current.style.transform = `translate(${
        actualPosition.x - size / 2
      }px, ${actualPosition.y - size / 2}px) scale(1)`;
    }
  }, [actualPosition, size, isHoveringButton, isVisible, followSpeed]);

  // Don't render on mobile if disableOnMobile is true
  if (isMobile && disableOnMobile) {
    return null;
  }

  // Calculate the inner circle offset to position it exactly at the mouse position
  // We need to offset it since the inner circle is positioned relative to the cursor
  const innerCircleOffset = (size * (1 - innerCircleSize / 100)) / 2;

  return (
    <>
      {/* Cursor */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-50 flex items-center justify-center"
        style={{
          opacity: isVisible ? 1 : 0,
          width: `${size}px`,
          height: `${size}px`,
          transform: `translate(${actualPosition.x - size / 2}px, ${
            actualPosition.y - size / 2
          }px)`,
          willChange: "transform, opacity",
        }}
      >
        {/* Outer glow */}
        <div
          className="absolute rounded-full blur-md"
          style={{
            backgroundColor: color,
            width: "140%",
            height: "140%",
            opacity: 0.3,
            animation: "cursorPulse 2s ease-in-out infinite",
          }}
        />

        {/* Main circle */}
        <div
          className="rounded-full"
          style={{
            backgroundColor: `${color}cc`,
            width: "100%",
            height: "100%",
            opacity: 0.7,
            boxShadow: `0 0 20px ${color}80`,
            animation: "cursorPulse 2s ease-in-out infinite",
            animationDelay: "0.1s",
          }}
        />
      </div>

      {/* Ripple container */}
      <div
        ref={rippleContainerRef}
        className="fixed inset-0 pointer-events-none z-40"
      >
        {ripples.map((ripple) => (
          <div
            key={ripple.id}
            className="absolute rounded-full pointer-events-none ripple-effect"
            style={{
              left: ripple.x - ripple.size / 2,
              top: ripple.y - ripple.size / 2,
              width: `${ripple.size}px`,
              height: `${ripple.size}px`,
              border: `2px solid ${color}`,
              boxShadow: `0 0 15px ${color}80`,
              animation:
                "ripple-effect 1s cubic-bezier(0.2, 0.6, 0.4, 1) forwards",
            }}
          />
        ))}
      </div>

      {/* Add necessary CSS animations */}
      <style jsx global>{`
        @keyframes cursorPulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
          }
        }

        @keyframes ripple-effect {
          0% {
            transform: scale(0.1);
            opacity: 1;
          }
          100% {
            transform: scale(3);
            opacity: 0;
          }
        }

        /* REMOVED: Don't hide default cursor now */
        /*
        .cursor-btn,
        .cursor-btn * {
          cursor: none !important;
        }
        */
      `}</style>
    </>
  );
};

export default CustomCursor;
