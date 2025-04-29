"use client";
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Heading from "@/components/ui/Heading";
import { CanvasRevealEffect } from "@/components/ui/CanvasRevealEffect";

const Approach = () => {
  // State to keep track of which card is active
  const [activeCardIndex, setActiveCardIndex] = useState<number | null>(null);

  // Function to handle card activation
  const handleCardActivation = (index: number) => {
    setActiveCardIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="w-full py-20">
      <Heading
        text="Our approach to"
        highlightedText="solutions"
        className=""
      />
      <div className="my-20 flex flex-col lg:flex-row items-center justify-center w-full gap-4">
        <Card
          title="Web Design & Planning"
          icon={<AceternityIcon order="Phase 1" />}
          des="After a quick chat, we dive into research and sketching. We create a
          wireframe and a mood board to set the vibe. We also share a project
          plan with you, so we're on the same page."
          isActive={activeCardIndex === 0}
          onActivate={() => handleCardActivation(0)}
        >
          <CanvasRevealEffect
            animationSpeed={5.1}
            containerClassName="bg-emerald-900 overflow-hidden"
          />
        </Card>
        <Card
          title="Development & Updates"
          icon={<AceternityIcon order="Phase 2" />}
          des="Once the design is approved, we start coding. We keep you in the loop
          with regular updates and feedback sessions. We also make sure the
          website is responsive and works well on all devices."
          isActive={activeCardIndex === 1}
          onActivate={() => handleCardActivation(1)}
        >
          <CanvasRevealEffect
            animationSpeed={3}
            containerClassName="bg-pink-900 overflow-hidden"
            colors={[
              [255, 166, 158],
              [221, 255, 247],
            ]}
            dotSize={2}
          />
        </Card>
        <Card
          title="SEO & Launch"
          icon={<AceternityIcon order="Phase 3" />}
          des="After the website is ready, we optimize it for search engines. We also
          set up analytics to track performance. Once everything is perfect, we
          launch the website and make it live for everyone to see."
          isActive={activeCardIndex === 2}
          onActivate={() => handleCardActivation(2)}
        >
          <CanvasRevealEffect
            animationSpeed={3}
            containerClassName="bg-sky-600 overflow-hidden"
            colors={[[125, 211, 252]]}
          />
        </Card>
      </div>
    </section>
  );
};

export default Approach;

const Card = ({
  title,
  icon,
  children,
  des,
  isActive,
  onActivate,
}: {
  title: string;
  icon: React.ReactNode;
  children?: React.ReactNode;
  des: string;
  isActive: boolean;
  onActivate: () => void;
}) => {
  // Handle hover on desktop only
  const handleMouseEnter = () => {
    if (!("ontouchstart" in window)) {
      onActivate();
    }
  };

  const handleMouseLeave = () => {
    if (!("ontouchstart" in window)) {
      onActivate(); // This will toggle back to null in the parent
    }
  };

  const handleClick = () => {
    onActivate();
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      className="border group/canvas-card flex items-center justify-center
       border-white/[0.2] max-w-sm w-full mx-auto p-4 relative lg:h-[35rem] cursor-pointer"
      style={{
        background:
          "linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)",
      }}
    >
      <Icon className="absolute h-10 w-10 -top-5 -left-5 text-white opacity-30" />
      <Icon className="absolute h-10 w-10 -bottom-5 -left-5 text-white opacity-30" />
      <Icon className="absolute h-10 w-10 -top-5 -right-5 text-white opacity-30" />
      <Icon className="absolute h-10 w-10 -bottom-5 -right-5 text-white opacity-30" />

      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full w-full absolute inset-0"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-20 px-10">
        <div
          className={`text-center absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]
          transition duration-200 min-w-40 mx-auto flex items-center justify-center
          ${isActive ? "-translate-y-4 opacity-0" : "opacity-100"}`}
        >
          {icon}
        </div>
        <h2
          className={`text-white text-center text-3xl relative z-10 mt-4 font-bold
          transition duration-200 ${
            isActive ? "opacity-100 -translate-y-2" : "opacity-0"
          }`}
        >
          {title}
        </h2>
        <p
          className={`text-sm relative z-10 mt-4 text-center
          transition duration-200 ${
            isActive ? "opacity-100 -translate-y-2" : "opacity-0"
          }`}
          style={{ color: "#E4ECFF" }}
        >
          {des}
        </p>
      </div>
    </div>
  );
};

const AceternityIcon = ({ order }: { order: string }) => {
  return (
    <div>
      <button className="relative inline-flex overflow-hidden rounded-full p-[1px]">
        <span
          className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite]
         bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]"
        />
        <span
          className="inline-flex h-full w-full cursor-pointer items-center
        justify-center rounded-full bg-slate-950 px-5 py-2 text-purple backdrop-blur-3xl font-bold text-2xl"
        >
          {order}
        </span>
      </button>
    </div>
  );
};

export const Icon = ({ className, ...rest }: any) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className={className}
      {...rest}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
    </svg>
  );
};
