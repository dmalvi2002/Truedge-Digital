"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";

interface CustomCursorProps {
  color?: string;
  size?: number;
  hoverScale?: number;
  buttonFillColor?: string;
  enableRipple?: boolean;
  followSpeed?: number; // 1-10, where 10 is fastest
  disableOnMobile?: boolean;
  // New props for better control
  innerDotSize?: number; // Size of the inner dot as percentage of cursor size
  innerDotColor?: string; // Color of the inner dot
  zIndex?: number; // Custom z-index for layering control
  clickScale?: number; // Scale factor when clicking
  debug?: boolean; // Enable debug mode to show performance stats
}

const CustomCursor: React.FC<CustomCursorProps> = ({
  color = "#3b82f6", // Default blue color
  size = 40, // Default size
  hoverScale = 1.5,
  buttonFillColor = "rgba(59, 130, 246, 0.5)", // Semi-transparent blue
  enableRipple = true,
  followSpeed = 5, // Mid-range default speed
  disableOnMobile = true,
  innerDotSize = 30, // 30% of the cursor size
  innerDotColor = "#ffffff",
  zIndex = 9999,
  clickScale = 0.9,
  debug = false,
}) => {
  // Normalize follow speed to a value between 0.01-0.3
  const normalizedSpeed = Math.max(0.01, Math.min(0.3, followSpeed / 33.33));

  // Refs
  const cursorRef = useRef<HTMLDivElement>(null);
  const rippleContainerRef = useRef<HTMLDivElement>(null);
  const lastMousePosRef = useRef({ x: 0, y: 0 });
  const targetPosRef = useRef({ x: 0, y: 0 });
  const currentPosRef = useRef({ x: 0, y: 0 });
  const isVisibleRef = useRef(false);
  const isHoveringButtonRef = useRef(false);
  const isMouseDownRef = useRef(false);
  const activeButtonsRef = useRef<Set<HTMLElement>>(new Set());
  const animationFrameIdRef = useRef<number | null>(null);
  const frameCountRef = useRef(0);
  const lastFrameTimeRef = useRef(performance.now());
  const fpsRef = useRef(0);

  // States that need to trigger rendering
  const [isMobile, setIsMobile] = useState(false);
  const [ripples, setRipples] = useState<
    Array<{
      id: string;
      x: number;
      y: number;
      size: number;
    }>
  >([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [debugStats, setDebugStats] = useState({ fps: 0, lag: 0 });

  // Track cursor visibility - without rerendering
  const setIsVisible = useCallback((visible: boolean) => {
    isVisibleRef.current = visible;
    if (cursorRef.current) {
      cursorRef.current.style.opacity = visible ? "1" : "0";
    }
  }, []);

  // Initialize and detect mobile
  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      const isTouchDevice =
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        (window.matchMedia && window.matchMedia("(pointer: coarse)").matches);

      setIsMobile(isTouchDevice);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    // Initialize cursor position to center of viewport
    currentPosRef.current = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    };
    targetPosRef.current = { ...currentPosRef.current };
    lastMousePosRef.current = { ...currentPosRef.current };

    setIsInitialized(true);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // Setup button interactions
  useEffect(() => {
    // Don't run if on mobile and disabled
    if (isMobile && disableOnMobile) return;

    // Safely modify buttons with error handling
    const setupButtons = () => {
      try {
        const buttons = document.querySelectorAll(
          "button,a,input[type='button'],input[type='submit'],.cursor-btn"
        );

        buttons.forEach((button) => {
          if (
            button instanceof HTMLElement &&
            !button.classList.contains("cursor-btn-initialized")
          ) {
            button.classList.add("cursor-btn");
            button.classList.add("cursor-btn-initialized");

            // Create fill element - wrapped in try/catch for safety
            try {
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

              // Set position relative only if not already positioned
              const computedStyle = window.getComputedStyle(button);
              if (computedStyle.position === "static") {
                button.style.position = "relative";
              }

              button.style.overflow = "hidden";
              button.appendChild(fillElement);
            } catch (err) {
              console.error("Failed to initialize button fill element:", err);
            }
          }
        });
      } catch (err) {
        console.error("Error in setupButtons:", err);
      }
    };

    // Run initial setup with a safety try-catch
    try {
      setupButtons();

      // Set up MutationObserver for dynamic buttons
      const observer = new MutationObserver((mutations) => {
        try {
          const hasNewNodes = mutations.some(
            (mutation) => mutation.addedNodes.length > 0
          );
          if (hasNewNodes) {
            setupButtons();
          }
        } catch (err) {
          console.error("Error in MutationObserver callback:", err);
        }
      });

      // Start observing
      observer.observe(document.body, { childList: true, subtree: true });

      // Cleanup function
      return () => {
        try {
          observer.disconnect();

          // Clean up button styles
          document
            .querySelectorAll(".cursor-btn-initialized")
            .forEach((button) => {
              if (button instanceof HTMLElement) {
                button.classList.remove("cursor-btn");
                button.classList.remove("cursor-btn-initialized");
                button.style.position = "";
                button.style.overflow = "";
                button.style.boxShadow = "";
                button.style.transform = "";
                button.style.transition = "";

                // Remove fill elements
                button
                  .querySelectorAll(".btn-fill")
                  .forEach((fill) => fill.remove());
              }
            });
        } catch (err) {
          console.error("Error in button cleanup:", err);
        }
      };
    } catch (err) {
      console.error("Critical error in button setup:", err);
      return () => {}; // Return empty cleanup function
    }
  }, [buttonFillColor, isMobile, disableOnMobile, isInitialized]);

  // Animation loop with error recovery
  useEffect(() => {
    // Don't run if on mobile and disabled
    if ((isMobile && disableOnMobile) || !isInitialized) return;

    const animateCursor = () => {
      try {
        const now = performance.now();

        // Calculate FPS for debug mode
        if (debug) {
          frameCountRef.current++;
          const elapsed = now - lastFrameTimeRef.current;

          if (elapsed >= 1000) {
            // Update every second
            fpsRef.current = Math.round(
              (frameCountRef.current * 1000) / elapsed
            );
            frameCountRef.current = 0;
            lastFrameTimeRef.current = now;

            setDebugStats({
              fps: fpsRef.current,
              lag:
                Math.abs(targetPosRef.current.x - currentPosRef.current.x) +
                Math.abs(targetPosRef.current.y - currentPosRef.current.y),
            });
          }
        }

        // Update target position from mouse position
        targetPosRef.current = { ...lastMousePosRef.current };

        // Skip animation if button is being hovered
        if (!isHoveringButtonRef.current && isVisibleRef.current) {
          // Calculate new position with smoothing
          currentPosRef.current.x +=
            (targetPosRef.current.x - currentPosRef.current.x) *
            normalizedSpeed;
          currentPosRef.current.y +=
            (targetPosRef.current.y - currentPosRef.current.y) *
            normalizedSpeed;

          // Update cursor position
          if (cursorRef.current) {
            cursorRef.current.style.transform = `translate(${
              currentPosRef.current.x - size / 2
            }px, ${currentPosRef.current.y - size / 2}px) scale(${
              isMouseDownRef.current ? clickScale : 1
            })`;
          }
        }

        // Continue animation loop
        animationFrameIdRef.current = requestAnimationFrame(animateCursor);
      } catch (err) {
        console.error("Error in animation loop:", err);
        // Attempt recovery by requesting a new frame
        animationFrameIdRef.current = requestAnimationFrame(animateCursor);
      }
    };

    // Start animation loop
    animationFrameIdRef.current = requestAnimationFrame(animateCursor);

    // Cleanup
    return () => {
      if (animationFrameIdRef.current !== null) {
        cancelAnimationFrame(animationFrameIdRef.current);
        animationFrameIdRef.current = null;
      }
    };
  }, [
    normalizedSpeed,
    size,
    isMobile,
    disableOnMobile,
    isInitialized,
    debug,
    clickScale,
  ]);

  // Mouse event handlers
  useEffect(() => {
    // Don't set up event listeners if on mobile and disabled
    if ((isMobile && disableOnMobile) || !isInitialized) return;

    // Create a throttled version of the mouse move handler
    let lastMoveTime = 0;
    const throttleTime = 5; // ms between updates (higher = less CPU but less smooth)

    const handleMouseMove = (e: MouseEvent) => {
      const now = performance.now();

      // Throttle updates for performance
      if (now - lastMoveTime > throttleTime) {
        lastMoveTime = now;
        lastMousePosRef.current = { x: e.clientX, y: e.clientY };

        if (!isVisibleRef.current) {
          setIsVisible(true);
        }
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
      // Don't show cursor if hovering a button
      setIsVisible(!isHoveringButtonRef.current);

      // Reset position to center of viewport to avoid jumps
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      lastMousePosRef.current = { x: centerX, y: centerY };
      currentPosRef.current = { x: centerX, y: centerY };
      targetPosRef.current = { x: centerX, y: centerY };
    };

    // Handle window blur/focus for better reliability
    const handleBlur = () => {
      setIsVisible(false);
    };

    const handleFocus = () => {
      // Only show cursor if mouse is over window and not hovering a button
      if (document.hasFocus() && !isHoveringButtonRef.current) {
        setIsVisible(true);
      }
    };

    // Handle click for ripple effect with debounce
    let lastClickTime = 0;
    const clickDebounceTime = 150; // ms between ripples
    let rippleCounter = 0;

    const handleClick = (e: MouseEvent) => {
      if (!enableRipple) return;

      const now = performance.now();
      // Prevent ripple spam
      if (now - lastClickTime < clickDebounceTime) return;
      lastClickTime = now;

      try {
        const rippleId = `ripple-${Date.now()}-${rippleCounter++}`;
        const rippleSize = Math.random() * 20 + 40; // Random size between 40-60px

        // Add ripple
        setRipples((prevRipples) => [
          ...prevRipples.slice(-5), // Keep only the 5 most recent ripples for performance
          { id: rippleId, x: e.clientX, y: e.clientY, size: rippleSize },
        ]);

        // Remove ripple after animation
        setTimeout(() => {
          setRipples((prevRipples) =>
            prevRipples.filter((r) => r.id !== rippleId)
          );
        }, 1000);
      } catch (err) {
        console.error("Error in ripple creation:", err);
      }
    };

    // Button hover handlers
    const onButtonHover = (e: Event) => {
      try {
        const button = e.currentTarget as HTMLElement;

        // Track active button
        activeButtonsRef.current.add(button);
        isHoveringButtonRef.current = true;

        // Apply button effects
        morphCursorToButton(button);
      } catch (err) {
        console.error("Error in button hover:", err);
      }
    };

    const onButtonUnhover = (e: Event) => {
      try {
        const button = e.currentTarget as HTMLElement;

        // Remove from active buttons
        activeButtonsRef.current.delete(button);

        // Only set hovering to false if no other buttons are hovered
        if (activeButtonsRef.current.size === 0) {
          isHoveringButtonRef.current = false;
        }

        // Reset styles
        resetButtonStyles(button);

        // Restore cursor if needed
        if (activeButtonsRef.current.size === 0) {
          restoreCursor();
        }
      } catch (err) {
        console.error("Error in button unhover:", err);
      }
    };

    // Add global event listeners
    document.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("click", handleClick);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);

    // Apply hover effects to buttons - with a small delay
    const buttonSetupTimeout = setTimeout(() => {
      try {
        document.querySelectorAll(".cursor-btn").forEach((button) => {
          button.addEventListener("mouseenter", onButtonHover);
          button.addEventListener("mouseleave", onButtonUnhover);
        });
      } catch (err) {
        console.error("Error in button event setup:", err);
      }
    }, 100);

    // Cleanup function
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("click", handleClick);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);

      clearTimeout(buttonSetupTimeout);

      try {
        document.querySelectorAll(".cursor-btn").forEach((button) => {
          button.removeEventListener("mouseenter", onButtonHover);
          button.removeEventListener("mouseleave", onButtonUnhover);
        });
      } catch (err) {
        console.error("Error in event listener cleanup:", err);
      }
    };
  }, [enableRipple, isInitialized, isMobile, disableOnMobile, setIsVisible]);

  // Helper functions
  const morphCursorToButton = useCallback(
    (button: HTMLElement) => {
      try {
        // Find fill element
        const fill = button.querySelector(".btn-fill") as HTMLElement;
        if (fill) {
          // Get button position
          const rect = button.getBoundingClientRect();

          // Set origin to cursor position relative to button
          const x = lastMousePosRef.current.x - rect.left;
          const y = lastMousePosRef.current.y - rect.top;

          // Optimize transition based on follow speed
          const fillTransitionDuration = Math.max(
            0.3,
            0.7 - normalizedSpeed * 2
          );

          fill.style.transformOrigin = `${x}px ${y}px`;
          fill.style.transform = "scale(3)";
          fill.style.transition = `transform ${fillTransitionDuration}s cubic-bezier(0.34, 1.56, 0.64, 1)`;

          // Add subtle glow effect
          button.style.boxShadow = `0 0 15px ${color}80`;

          // Button transition speed
          const buttonTransitionDuration = Math.max(
            0.2,
            0.6 - normalizedSpeed * 2
          );
          button.style.transition = `all ${buttonTransitionDuration}s cubic-bezier(0.34, 1.56, 0.64, 1)`;
        }

        // Hide cursor by moving to button center and scaling down
        if (cursorRef.current) {
          const rect = button.getBoundingClientRect();
          const buttonCenterX = rect.left + rect.width / 2;
          const buttonCenterY = rect.top + rect.height / 2;

          // Calculate morph speed
          const morphDuration = Math.max(0.15, 0.5 - normalizedSpeed * 2);

          // Animate cursor
          cursorRef.current.style.transform = `translate(${
            buttonCenterX - size / 2
          }px, ${buttonCenterY - size / 2}px) scale(0)`;
          cursorRef.current.style.opacity = "0";
          cursorRef.current.style.transition = `transform ${morphDuration}s cubic-bezier(0.34, 1.56, 0.64, 1), opacity ${
            morphDuration * 0.6
          }s ease`;
        }
      } catch (err) {
        console.error("Error in morphCursorToButton:", err);
      }
    },
    [color, normalizedSpeed, size]
  );

  const resetButtonStyles = useCallback(
    (button: HTMLElement) => {
      try {
        const fill = button.querySelector(".btn-fill") as HTMLElement;
        if (fill) {
          // Speed-adjusted transition
          const resetDuration = Math.max(0.2, 0.5 - normalizedSpeed * 2);

          fill.style.transition = `transform ${resetDuration}s cubic-bezier(0.34, 1.56, 0.64, 1)`;
          fill.style.transform = "scale(0)";
        }

        // Remove glow
        button.style.boxShadow = "none";
      } catch (err) {
        console.error("Error in resetButtonStyles:", err);
      }
    },
    [normalizedSpeed]
  );

  const restoreCursor = useCallback(() => {
    try {
      if (cursorRef.current) {
        // Return cursor to current mouse position
        cursorRef.current.style.transform = `translate(${
          currentPosRef.current.x - size / 2
        }px, ${currentPosRef.current.y - size / 2}px) scale(1)`;
        cursorRef.current.style.opacity = "1";

        // Speed-adjusted transition
        const transitionDuration = Math.max(0.01, 0.1 - normalizedSpeed);

        cursorRef.current.style.transition = `transform ${transitionDuration}s ease-out, opacity 0.1s ease`;
      }
    } catch (err) {
      console.error("Error in restoreCursor:", err);
    }
  }, [normalizedSpeed, size]);

  // Don't render on mobile if disabled
  if (isMobile && disableOnMobile) {
    return null;
  }

  return (
    <>
      {/* Cursor */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none"
        style={{
          opacity: "0", // Start hidden, will be set by JS
          width: `${size}px`,
          height: `${size}px`,
          zIndex,
          willChange: "transform, opacity",
          transition: "opacity 0.2s ease, transform 0.1s ease-out",
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
            transform: "translate(-20%, -20%)",
          }}
        />

        {/* Main circle */}
        <div
          className="absolute rounded-full"
          style={{
            backgroundColor: `${color}cc`,
            width: "100%",
            height: "100%",
            opacity: 0.7,
            boxShadow: `0 0 20px ${color}80`,
            animation: "cursorPulse 2s ease-in-out infinite",
            animationDelay: "0.1s",
            top: 0,
            left: 0,
          }}
        />

        {/* Inner dot - centered precisely */}
        <div
          className="absolute rounded-full"
          style={{
            backgroundColor: innerDotColor,
            width: `${innerDotSize}%`,
            height: `${innerDotSize}%`,
            top: `${(100 - innerDotSize) / 2}%`,
            left: `${(100 - innerDotSize) / 2}%`,
            opacity: 0.8,
            boxShadow: `0 0 10px ${color}`,
            transition: "opacity 0.2s ease",
          }}
        />
      </div>

      {/* Ripple container */}
      <div
        ref={rippleContainerRef}
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: zIndex - 1 }}
      >
        {ripples.map((ripple) => (
          <div
            key={ripple.id}
            className="absolute rounded-full pointer-events-none"
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

      {/* Debug panel - only visible in debug mode */}
      {debug && (
        <div
          className="fixed bottom-2 right-2 bg-black bg-opacity-70 text-white p-2 rounded text-xs"
          style={{ zIndex: zIndex + 1 }}
        >
          <div>FPS: {debugStats.fps}</div>
          <div>Lag: {Math.round(debugStats.lag)}</div>
          <div>
            Speed: {followSpeed} ({normalizedSpeed.toFixed(3)})
          </div>
        </div>
      )}

      {/* Global styles */}
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
      `}</style>
    </>
  );
};

export default CustomCursor;
