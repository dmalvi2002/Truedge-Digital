"use client";
import { FaLocationArrow } from "react-icons/fa6";
import { motion } from "framer-motion";
import MagicButton from "@/components/ui/CustomMagicButton";
import { Spotlight } from "@/components/ui/Spotlight";
import { TextGenerateEffect } from "@/components/ui/TextGenerateEffect";
import HeroGlobe from "@/components/Hero/HeroClientGlobe";
import TypingAnimation from "../ui/TypingAnimation";
import { useEffect, useState } from "react";

const Hero = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if window is defined (client-side)
    if (typeof window !== "undefined") {
      // Set initial state
      setIsMobile(window.innerWidth < 768);

      // Add event listener for window resize
      const handleResize = () => {
        setIsMobile(window.innerWidth < 768);
      };

      window.addEventListener("resize", handleResize);

      // Clean up event listener
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  // Content component to avoid duplication
  const HeroContent = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="max-w-[89vw] sm:max-w-3xl"
    >
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="uppercase tracking-widest text-xs text-blue-100 max-w-80 mb-2"
      >
        Helping Brands Build & Scale Online
      </motion.p>

      <TypingAnimation
        text="Transforming Concepts into Seamless User Experiences"
        typingSpeed={100}
        pauseBeforeRestart={500}
        fadedOpacity={0.3}
      />

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="md:tracking-wider mt-6 mb-8 text-sm md:text-lg lg:text-xl text-gray-300"
      >
        Expert in Website Design, Development & Marketing Services – Your
        One-Stop Digital Agency
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 3, duration: 0.5, type: "spring" }}
      >
        <MagicButton
          handleClick={() => {
            const aboutSection = document.getElementById("contact");
            if (aboutSection) {
              aboutSection.scrollIntoView({ behavior: "smooth" });
            }
          }}
          title="Get in touch"
          icon={<FaLocationArrow />}
          position="right"
          otherClasses="bg-gradient-to-r from-indigo-600 via-indigo-800 to-indigo-950 hover:from-purple-600 hover:via-purple-700 hover:to-purple-950"
        />
      </motion.div>
    </motion.div>
  );

  // Globe component to avoid duplication
  const GlobeComponent = ({ className }: { className: string }) => (
    <div className={className}>
      <HeroGlobe />
    </div>
  );

  // Mobile version
  const MobileHero = () => (
    <div className="relative z-18 flex flex-col items-center w-full max-w-7xl min-h-screen mx-auto">
      {/* Globe at top */}
      <div className="w-full flex items-center justify-center pointer-events-none mb-10 mt-20">
        <GlobeComponent className="w-[280px] h-[280px]" />
      </div>

      {/* Content below */}
      <div className="w-full z-20">
        <HeroContent />
      </div>
    </div>
  );

  // Desktop version
  const DesktopHero = () => (
    <div className="relative z-18 flex flex-col justify-center w-full max-w-7xl min-h-screen mx-auto">
      <div className="w-full z-20 md:w-1/2 mt-20 md:mt-0">
        <HeroContent />
      </div>

      {/* Globe - Positioned in background */}
      <div className="absolute z-19 top-0 right-0 w-full md:w-1/2 h-full flex items-center justify-end pointer-events-none">
        <GlobeComponent className="w-[500px] h-[500px] lg:w-[600px] lg:h-[600px] mr-0" />
      </div>
    </div>
  );

  return (
    <div className="relative w-full px-5 sm:px-10 flex items-center justify-center min-h-screen overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 blur-3xl backdrop-blur-3xl bg-gradient-to-t from-black/5 via-indigo-950 to-purple-950 opacity-50" />

      {/* Conditional rendering based on screen size */}
      {isMobile ? <MobileHero /> : <DesktopHero />}
    </div>
  );
};

export default Hero;
