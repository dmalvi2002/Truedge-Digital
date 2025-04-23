"use client";
import React from "react";
import MagicButton from "@/components/ui/MagicButton"; // Import the MagicButton component

const OfferCTA = () => {
  return (
    // CTA Section
    <div className="relative container mx-auto px-4 bg-gradient-to-br from-indigo-900/30 to-purple-900/30 backdrop-blur-lg rounded-xl p-6 md:p-12 border border-indigo-500/30 shadow-xl overflow-hidden mt-12 md:mt-20">
      {/* Decorative background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-40 h-40 md:w-64 md:h-64 rounded-full bg-indigo-600/10 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 md:w-64 md:h-64 rounded-full bg-purple-600/10 blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <h2 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6">
          <span className="text-white">Starting from with only </span>
          <span className="text-yellow-300">450£</span>
          <span className="text-white">... </span>
          <span className="text-purple-400">what are you waiting for?</span>
        </h2>
        <p className="text-gray-300 text-base md:text-lg mb-6 md:mb-8">
          Let's discuss how our services can help you achieve your business
          goals. Contact us today for a free consultation.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
          <MagicButton
            handleClick={() => {
              window.location.href = "/#contact";
            }}
            title="Send Your Ideas"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5 2a1 1 0 011 1v1h8V3a1 1 0 112 0v1h1a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2h1V3a1 1 0 011-1zm11 14V8H4v8h12z"
                  clipRule="evenodd"
                />
              </svg>
            }
            position="left"
          />
          {/* </a> */}
          {/* <a
            href="/#contact"
            className="w-full sm:w-auto px-6 py-3 h-12 rounded-lg border border-gray-400/50 text-gray-200 hover:bg-gray-800/40 hover:border-gray-300/70 transition-all text-sm md:text-base flex items-center justify-center mt-4 sm:mt-0"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
            Contact Us
          </a> */}
        </div>
      </div>
    </div>
  );
};

export default OfferCTA;
