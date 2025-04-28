"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/MovingBorders";
import { companies, testimonials } from "@/data";
import { InfiniteMovingCards } from "./InfiniteCards";
import Heading from "../ui/Heading";

const Clients = () => {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const logoVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
      },
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
      },
    },
  };
  return (
    <section id="testimonials" className="py-20">
      <Heading
        text="What Our"
        highlightedText="Clients Are Saying"
        className=""
      />

      <div className="flex flex-col items-center max-lg:mt-10">
        <div className="min-h-[50vh] md:h-[30rem] w-full rounded-md flex flex-col antialiased items-center justify-center relative overflow-hidden">
          <InfiniteMovingCards
            items={testimonials}
            direction="right"
            speed="slow"
            className="w-full"
          />
        </div>

        {/* Styled container for company logos */}
        <div className="mt-16 w-full">
          <Heading
            text="Our Trusted"
            highlightedText="Companies"
            className=""
          />

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full max-w-5xl mt-10 mx-auto px-2 sm:px-3 lg:px-4"
          >
            <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 md:gap-8">
              {companies.map((company) => (
                <Button
                  key={company.id}
                  className="flex items-center justify-center bg-gradient-to-b from-gray-900/30 to-gray-800/30 hover:bg-gradient-to-b hover:from-gray-900/10 hover:to-gray-800/10 rounded-xl px-4 py-2 shadow-md hover:shadow-xl transition-all duration-300"
                >
                  <img
                    src={company.img}
                    alt={company.name}
                    loading="lazy"
                    className="w-20 h-6 sm:w-28 sm:h-12 md:w-36 md:h-20 object-contain transition-transform duration-300 filter brightness-110"
                  />
                </Button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Clients;
