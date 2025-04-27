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
      // animate(
      //   "span",
      //   {
      //     textShadow: [
      //       "0 0 5px rgba(255, 255, 255, 0.5)",
      //       "0 0 15px rgba(255, 255, 255, 0.8)",
      //       "0 0 5px rgba(255, 255, 255, 0.5)",
      //     ],
      //   },
      //   {
      //     duration: 3,
      //     repeat: Infinity,
      //     ease: "easeInOut",
      //   }
      // );
    };

    animateLogo();
  }, [animate]);

  // Split text into individual characters for letter animation
  const text = "Truedge Digital UK";
  const characters = text.split("");

  return (
    <motion.div
      ref={scope}
      className="justify-center absolute top-full left-1/2 transform -translate-x-1/2 mt-4 px-6 py-2 rounded-full bg-black/20 backdrop-blur-sm hidden md:flex"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      {characters.map((char, index) => (
        <motion.span
          key={index}
          className="text-base md:text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-t from-blue-950 via-gray-50 to-white"
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

// Mobile breadcrumb menu icon
const BreadcrumbIcon = ({ onClick }: { onClick: () => void }) => (
  <motion.button
    onClick={onClick}
    className="text-white flex flex-col gap-1.5 p-2"
    whileTap={{ scale: 0.95 }}
  >
    <motion.div className="w-6 h-0.5 bg-white rounded-full" />
    <motion.div className="w-6 h-0.5 bg-white rounded-full" />
    <motion.div className="w-6 h-0.5 bg-white rounded-full" />
  </motion.button>
);

// Mobile Overlay Menu
const MobileOverlay = ({
  isOpen,
  onClose,
  navItems,
}: {
  isOpen: boolean;
  onClose: () => void;
  navItems: {
    name: string;
    link: string;
    icon?: JSX.Element;
    logo?: boolean;
    img?: string;
  }[];
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: "-100%" }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "-100%" }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed inset-0 z-[6000] bg-black/90 backdrop-blur-md flex flex-col"
        >
          <div className="flex justify-between items-center p-5 border-b border-white/10">
            <div className="text-transparent bg-clip-text bg-gradient-to-t from-gray-500 via-blue-500 to-blue-950 font-bold text-2xl">
              Truedge Digital
            </div>
            <motion.button
              onClick={onClose}
              whileTap={{ scale: 0.95 }}
              className="text-white text-2xl"
            >
              ✕
            </motion.button>
          </div>

          <motion.div
            className="flex flex-col p-6 gap-6"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
            initial="hidden"
            animate="show"
          >
            {navItems.map((item, idx) => (
              <motion.div
                key={`mobile-link-${idx}`}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 },
                }}
              >
                <Link
                  href={item.link}
                  className="text-white text-xl flex items-center gap-3 p-2 hover:text-indigo-400 transition-colors"
                  onClick={onClose}
                >
                  {item.icon && <span>{item.icon}</span>}
                  <span>{item.name}</span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
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
  const [visible, setVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
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
            "flex justify-between fixed z-[5000] top-5 inset-x-0 mx-auto px-4 md:px-10 py-3 md:py-5 rounded-lg border border-black/.1 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] items-center",
            "w-[90%] md:max-w-fit md:min-w-[70vw] lg:min-w-fit",
            className
          )}
          style={{
            backdropFilter: "blur(16px) saturate(180%)",
            backgroundColor: "rgba(17, 25, 40, 0.55)",
            borderRadius: "12px",
            border: "1px solid rgba(255, 255, 255, 0.125)",
          }}
        >
          {/* Mobile logo and breadcrumb */}
          <div className="flex md:hidden items-center">
            {navItems.find((item) => item.logo && item.img) ? (
              <img
                src={navItems.find((item) => item.logo && item.img)?.img}
                alt="Logo"
                className="h-8"
              />
            ) : (
              <div className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-500 to-blue-500 font-bold">
                Truedge
              </div>
            )}
          </div>

          {/* Mobile Breadcrumb */}
          <div className="md:hidden">
            <BreadcrumbIcon onClick={toggleMobileMenu} />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-center space-x-4">
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
                  <span className="text-sm !cursor-pointer">
                    {navItem.name}
                  </span>
                )}
              </Link>
            ))}
          </div>

          {/* Animated Logo Text (Desktop only) */}
          <AnimatedLogoText />
        </motion.div>
      </AnimatePresence>

      {/* Mobile Overlay Menu */}
      <MobileOverlay
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        navItems={navItems}
      />
    </>
  );
};
