"use client";

import React from "react";

import { companies, testimonials } from "@/data";
import { InfiniteMovingCards } from "./InfiniteCards";
import Heading from "../ui/Heading";

const Clients = () => {
  return (
    <section id="testimonials" className="py-20">
      <Heading
        text="What Our"
        highlightedText="Clients Are Saying"
        className=""
      />

      <div className="flex flex-col items-center max-lg:mt-10">
        <div className="h-[50vh] md:h-[30rem] w-full rounded-md flex flex-col antialiased items-center justify-center relative overflow-hidden">
          <InfiniteMovingCards
            items={testimonials}
            direction="right"
            speed="slow"
            className="w-full"
          />
        </div>

        {/* Styled container for company logos */}
        <div className="mt-16 w-full max-w-6xl mx-auto px-4">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 shadow-xl border border-slate-700/50">
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
              {companies.map((company) => (
                <div
                  key={company.id}
                  className="flex justify-center items-center h-20 w-full sm:w-1/3 md:w-1/4 lg:w-1/5 p-4"
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <img
                      src={company.img}
                      alt={company.name}
                      className="w-full h-full object-contain max-h-12"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Clients;
