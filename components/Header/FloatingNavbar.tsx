"use client";
import React, { useState, JSX, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
  useAnimate,
  stagger,
} from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Logo text component with animation
const AnimatedLogoText = () => {
  const [scope, animate] = useAnimate();

  // Run animation when component mounts
  useEffect(() => {
    const animateLogo = async () => {
      // Initial animation - text appearing with glow effect
      await animate(
        "span",
        {
          opacity: [0, 1],
          y: [20, 0],
          filter: ["blur(8px)", "blur(0px)"],
        },
        {
          duration: 1.5,
          delay: stagger(0.05),
          ease: "easeOut",
        }
      );

      // Continuous floating animation
      animate(
        scope.current,
        { y: [0, -8, 0] },
        {
          duration: 4,
          ease: "easeInOut",
          repeat: Infinity,
        }
      );

      // Continuous subtle glow animation
      animate(
        "span",
        {
          textShadow: [
            "0 0 5px rgba(111, 134, 245, 0.5)",
            "0 0 15px rgba(111, 134, 245, 0.8)",
            "0 0 5px rgba(111, 134, 245, 0.5)",
          ],
        },
        {
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }
      );
    };

    animateLogo();
  }, [animate]);

  // Split text into individual characters for letter animation
  const text = "Truedge Digital";
  const characters = text.split("");

  return (
    <motion.div
      ref={scope}
      className="flex justify-center absolute top-full left-1/2 transform -translate-x-1/2 mt-4 px-6 py-2 rounded-full bg-black/20 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      {characters.map((char, index) => (
        <motion.span
          key={index}
          className="text-base md:text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-500 to-blue-500"
          style={{
            display: char === " " ? "inline-block" : "inline-block",
            width: char === " " ? "0.5em" : "auto",
          }}
        >
          {char}
        </motion.span>
      ))}
    </motion.div>
  );
};

export const FloatingNav = ({
  navItems,
  className,
}: {
  navItems: {
    name: string;
    link: string;
    icon?: JSX.Element;
    logo?: boolean;
    img?: string;
  }[];
  className?: string;
}) => {
  const { scrollYProgress } = useScroll();

  // set true for the initial state so that nav bar is visible in the hero section
  const [visible, setVisible] = useState(true);

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    // Check if current is not undefined and is a number
    if (typeof current === "number") {
      let direction = current! - scrollYProgress.getPrevious()!;

      if (scrollYProgress.get() < 0.05) {
        // also set true for the initial state
        setVisible(true);
      } else {
        if (direction < 0) {
          setVisible(true);
        } else {
          setVisible(false);
        }
      }
    }
  });

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{
          opacity: 1,
          y: -100,
        }}
        animate={{
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0,
        }}
        transition={{
          duration: 0.2,
        }}
        className={cn(
          "flex max-w-fit md:min-w-[70vw] lg:min-w-fit fixed z-[5000] top-10 inset-x-0 mx-auto px-10 py-5 rounded-lg border border-black/.1 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] items-center justify-center space-x-4",
          className
        )}
        style={{
          backdropFilter: "blur(16px) saturate(180%)",
          backgroundColor: "rgba(17, 25, 40, 0.55)",
          borderRadius: "12px",
          border: "1px solid rgba(255, 255, 255, 0.125)",
        }}
      >
        {navItems.map((navItem: any, idx: number) => (
          <Link
            key={`link=${idx}`}
            href={navItem.link}
            className={cn(
              "relative text-neutral-50 items-center rounded-xl px-2 py-1 flex space-x-1 hover:text-neutral-300"
            )}
          >
            <span className="block sm:hidden">{navItem.icon}</span>
            {/* Check if it's a logo to display image instead of name */}
            {navItem.logo && navItem.img ? (
              <img
                src={navItem.img}
                alt={navItem.name}
                className="h-8 !cursor-pointer"
              />
            ) : (
              <span className="text-sm !cursor-pointer">{navItem.name}</span>
            )}
          </Link>
        ))}

        {/* Animated Logo Text */}
        <AnimatedLogoText />
      </motion.div>
    </AnimatePresence>
  );
};
