"use client";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export const BackgroundGradientAnimation = ({
  gradientBackgroundStart = "rgb(108, 0, 162)",
  gradientBackgroundEnd = "rgb(0, 17, 82)",
  firstColor = "18, 113, 255",
  secondColor = "221, 74, 255",
  thirdColor = "100, 220, 255",
  fourthColor = "200, 50, 50",
  fifthColor = "180, 180, 50",
  pointerColor = "140, 100, 255",
  sunColor = "255, 165, 0", // Orange color for the sun
  sunGlowColor = "255, 215, 0", // Golden glow
  size = "80%",
  blendingValue = "hard-light",
  children,
  className,
  interactive = true,
  containerClassName,
}: {
  gradientBackgroundStart?: string;
  gradientBackgroundEnd?: string;
  firstColor?: string;
  secondColor?: string;
  thirdColor?: string;
  fourthColor?: string;
  fifthColor?: string;
  pointerColor?: string;
  sunColor?: string;
  sunGlowColor?: string;
  size?: string;
  blendingValue?: string;
  children?: React.ReactNode;
  className?: string;
  interactive?: boolean;
  containerClassName?: string;
}) => {
  const interactiveRef = useRef<HTMLDivElement>(null);

  const [curX, setCurX] = useState(0);
  const [curY, setCurY] = useState(0);
  const [tgX, setTgX] = useState(0);
  const [tgY, setTgY] = useState(0);

  useEffect(() => {
    document.body.style.setProperty(
      "--gradient-background-start",
      gradientBackgroundStart
    );
    document.body.style.setProperty(
      "--gradient-background-end",
      gradientBackgroundEnd
    );
    document.body.style.setProperty("--first-color", firstColor);
    document.body.style.setProperty("--second-color", secondColor);
    document.body.style.setProperty("--third-color", thirdColor);
    document.body.style.setProperty("--fourth-color", fourthColor);
    document.body.style.setProperty("--fifth-color", fifthColor);
    document.body.style.setProperty("--pointer-color", pointerColor);
    document.body.style.setProperty("--sun-color", sunColor);
    document.body.style.setProperty("--sun-glow-color", sunGlowColor);
    document.body.style.setProperty("--size", size);
    document.body.style.setProperty("--blending-value", blendingValue);
  }, []);

  useEffect(() => {
    function move() {
      if (!interactiveRef.current) {
        return;
      }
      setCurX(curX + (tgX - curX) / 20);
      setCurY(curY + (tgY - curY) / 20);
      interactiveRef.current.style.transform = `translate(${Math.round(
        curX
      )}px, ${Math.round(curY)}px)`;
    }

    move();
  }, [tgX, tgY]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (interactiveRef.current) {
      const rect = interactiveRef.current.getBoundingClientRect();
      setTgX(event.clientX - rect.left);
      setTgY(event.clientY - rect.top);
    }
  };

  // Animation variants for the floating sun
  const sunVariants = {
    animate: {
      x: [0, 100, -150, 200, -100, 50, -200, 100, 0],
      y: [0, -80, 120, -150, 80, -120, 150, -100, 0],
      scale: [1, 1.05, 1, 0.95, 1, 1.05, 1],
      rotate: [0, 5, -5, 3, -3, 0],
      transition: {
        x: {
          repeat: Infinity,
          duration: 30,
          ease: "easeInOut",
          repeatType: "reverse",
        },
        y: {
          repeat: Infinity,
          duration: 25,
          ease: "easeInOut",
          repeatType: "reverse",
        },
        scale: {
          repeat: Infinity,
          duration: 8,
          ease: "easeInOut",
        },
        rotate: {
          repeat: Infinity,
          duration: 12,
          ease: "easeInOut",
        },
      },
    },
  };

  // Animation variants for the sun's glow
  const glowVariants = {
    animate: {
      opacity: [0.6, 0.8, 0.6, 0.7, 0.6],
      scale: [1, 1.2, 1, 1.1, 1],
      transition: {
        opacity: {
          repeat: Infinity,
          duration: 4,
          ease: "easeInOut",
        },
        scale: {
          repeat: Infinity,
          duration: 5,
          ease: "easeInOut",
        },
      },
    },
  };

  return (
    <div
      className={cn(
        "w-full h-full absolute overflow-hidden top-0 left-0 bg-[linear-gradient(40deg,var(--gradient-background-start),var(--gradient-background-end))]",
        containerClassName
      )}
    >
      <div className={cn("", className)}>{children}</div>

      {/* Sun with glow effect */}
      <motion.div
        className="absolute w-40 h-40 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        initial="initial"
        animate="animate"
        variants={sunVariants}
      >
        {/* Outer glow */}
        <motion.div
          className="absolute w-full h-full rounded-full bg-yellow-500 blur-2xl"
          style={{
            backgroundColor: `rgba(var(--sun-glow-color), 0.3)`,
            boxShadow: `0 0 60px 30px rgba(var(--sun-glow-color), 0.5),
                         0 0 100px 60px rgba(var(--sun-glow-color), 0.3)`,
          }}
          variants={glowVariants}
        />

        {/* Sun core */}
        <div
          className="absolute w-full h-full rounded-full"
          style={{
            background: `radial-gradient(circle at center,
                          rgba(var(--sun-glow-color), 0.9) 0%,
                          rgba(var(--sun-color), 0.8) 60%,
                          rgba(var(--sun-color), 0.6) 100%)`,
            boxShadow: `0 0 20px 10px rgba(var(--sun-color), 0.6)`,
          }}
        />
      </motion.div>

      <div className="gradients-container h-full w-full">
        {interactive && (
          <div
            ref={interactiveRef}
            onMouseMove={handleMouseMove}
            className={cn(
              `absolute [background:radial-gradient(circle_at_center,_rgba(var(--pointer-color),_0.8)_0,_rgba(var(--pointer-color),_0)_50%)_no-repeat]`,
              `[mix-blend-mode:var(--blending-value)] w-full h-full -top-1/2 -left-1/2`,
              `opacity-70`
            )}
          ></div>
        )}
      </div>
    </div>
  );
};
