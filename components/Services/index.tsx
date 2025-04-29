"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { services } from "./services";
import Heading from "../ui/Heading";
import MagicButton from "../ui/MagicButton";
import OfferCTA from "./OfferCTA";

// Define interface for modal data
interface Modal {
  id: number;
  title: string;
  pricing?: string; // Optional, only for some modals
  features: string[];
  highlight?: boolean;
}

// Modal Card Component with morphing animation
const ModalCard = ({
  modal,
  index,
  isVisible,
}: {
  modal: Modal;
  index: number;
  isVisible: boolean;
}) => {
  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0,
        rotateY: 180,
      }}
      animate={{
        opacity: isVisible ? 1 : 0,
        scale: isVisible ? 1 : 0,
        rotateY: isVisible ? 0 : 180,
      }}
      exit={{
        opacity: 0,
        scale: 0,
        rotateY: 180,
        transition: { duration: 0.3 },
      }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        type: "spring",
        stiffness: 100,
        damping: 15,
      }}
      className={`bg-gradient-to-b ${
        modal.highlight
          ? "from-indigo-900/80 to-purple-900/80 border-indigo-500/50"
          : "from-gray-800/80 to-gray-900/80 border-gray-700/30"
      } backdrop-blur-lg border rounded-xl p-4 md:p-6 shadow-xl h-full flex flex-col`}
      style={{
        transformStyle: "preserve-3d",
        boxShadow: modal.highlight
          ? "0 0 20px rgba(129, 140, 248, 0.2)"
          : "0 0 20px rgba(0, 0, 0, 0.4)",
      }}
    >
      {modal.highlight && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-bold py-1 px-4 rounded-full">
          Popular Choice
        </div>
      )}
      <h3
        className={`text-xl md:text-2xl font-bold mb-4 text-center ${
          modal.highlight ? "text-indigo-300" : "text-gray-200"
        }`}
      >
        {modal.title}
      </h3>
      <p className="text-gray-400 text-sm md:text-base mb-4 text-center">
        <span className="text-lg font-semibold text-indigo-400">
          Starting from
        </span>{" "}
        <span className="text-lg font-semibold text-yellow-300">
          {modal.pricing}
        </span>
      </p>
      <ul className="space-y-2 md:space-y-3 mt-4 md:mt-6 flex-grow">
        {modal.features.map((feature, idx) => (
          <motion.li
            key={idx}
            className="flex items-start gap-2 md:gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{
              opacity: isVisible ? 1 : 0,
              x: isVisible ? 0 : -20,
            }}
            transition={{
              duration: 0.3,
              delay: isVisible ? 0.5 + idx * 0.05 : 0,
            }}
          >
            <span
              className={`text-lg ${
                modal.highlight ? "text-indigo-400" : "text-purple-400"
              } mt-[2px] flex-shrink-0`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 md:h-5 md:w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
            <span className="text-gray-300 text-sm">{feature}</span>
          </motion.li>
        ))}
      </ul>
      <div className="mt-6 flex justify-center">
        <MagicButton
          title="Get Quotation"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          }
          position="right"
        />
      </div>
    </motion.div>
  );
};

// Define interface for service data
interface Service {
  id: number;
  title: string;
  description: string;
  gifUrl: string;
  points: string[];
  modals?: Modal[];
}

// Service Card Component
const ServiceCard = ({
  service,
  onViewPackages,
}: {
  service: Service;
  onViewPackages: (serviceId: number) => void;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col md:flex-row gap-6 bg-gradient-to-br from-gray-900/70 to-black/70 backdrop-blur-md border border-gray-700/30 rounded-xl p-5 md:p-8"
    >
      <div className="w-full md:w-1/3">
        <div className="w-full rounded-xl overflow-hidden gif-container mb-4 md:mb-6">
          <img
            src={service.gifUrl}
            alt={service.title}
            className="w-full h-48 md:h-64 object-contain"
            loading="lazy"
          />
        </div>

        <h3 className="text-xl md:text-3xl font-bold mb-3 md:mb-4 text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-600">
          {service.title}
        </h3>
      </div>

      <div className="w-full md:w-2/3">
        <p className="text-gray-300 mb-4 md:mb-6 text-base md:text-lg leading-relaxed">
          {service.description}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-8">
          {service.points.map((point, index) => (
            <div key={index} className="flex items-start gap-2 md:gap-3">
              <span className="text-indigo-400 mt-[2px] flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 md:h-5 md:w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              <span className="text-gray-300 text-sm md:text-base">
                {point}
              </span>
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => onViewPackages(service.id)}
            className="px-5 py-2 md:px-6 md:py-3 rounded-lg font-medium bg-gradient-to-r from-gray-600 to-gray-950 text-white hover:from-purple-300/50 hover:to-purple-950 transition-all transform hover:scale-105 shadow-md hover:shadow-indigo-600/20 text-sm md:text-base"
          >
            View Packages
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 md:h-5 md:w-5 inline-block ml-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Modal Container Component
interface ModalContainerProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service | null;
}

const ModalContainer = ({ isOpen, onClose, service }: ModalContainerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const modals = service?.modals || [];
  const [bodyScrollLocked, setBodyScrollLocked] = useState(false);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen && !bodyScrollLocked) {
      // Save current scroll position
      const scrollY = window.scrollY;
      // Add styles to body
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.overflow = "hidden";
      setBodyScrollLocked(true);
    } else if (!isOpen && bodyScrollLocked) {
      // Restore scroll position
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";
      document.body.style.overflow = "";
      window.scrollTo(0, parseInt(scrollY || "0") * -1);
      setBodyScrollLocked(false);
    }
  }, [isOpen, bodyScrollLocked]);

  // Close when clicking outside of container
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen, onClose]);

  // Clean up scroll lock on unmount
  useEffect(() => {
    return () => {
      if (bodyScrollLocked) {
        document.body.style.position = "";
        document.body.style.width = "";
        document.body.style.top = "";
        document.body.style.overflow = "";
        setBodyScrollLocked(false);
      }
    };
  }, [bodyScrollLocked]);

  // Get the appropriate grid columns based on number of modals
  const getGridColumns = () => {
    if (modals.length === 1) return "grid-cols-1";
    if (modals.length === 2) return "grid-cols-1 md:grid-cols-2";
    if (modals.length === 3) return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
    return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
  };

  // Background shape animations
  const shapes = [
    { size: "w-48 h-48 md:w-64 md:h-64", position: "top-0 left-0", delay: 0 },
    {
      size: "w-32 h-32 md:w-48 md:h-48",
      position: "bottom-0 right-0",
      delay: 0.2,
    },
    {
      size: "w-24 h-24 md:w-32 md:h-32",
      position: "top-1/3 right-1/4",
      delay: 0.4,
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm overflow-y-auto"
          style={{
            touchAction: "pan-y",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <div className="min-h-screen py-8 px-4 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-6xl mx-auto relative bg-gradient-to-b from-gray-900/90 to-black/90 backdrop-blur-lg rounded-xl md:rounded-2xl p-5 md:p-8 border border-gray-700/30 shadow-2xl"
              ref={containerRef}
            >
              {/* Close button for mobile - positioned at top right */}
              <div className="absolute top-3 right-3 z-20 md:hidden">
                <button
                  onClick={onClose}
                  className="bg-gray-800/80 hover:bg-gray-700 text-gray-200 p-2 rounded-full transition-all"
                  aria-label="Close modal"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>

              {/* Animated background shapes */}
              <div className="absolute inset-0 overflow-hidden rounded-xl md:rounded-2xl">
                {shapes.map((shape, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 0.1, scale: 1 }}
                    transition={{
                      duration: 0.8,
                      delay: shape.delay,
                      ease: "easeOut",
                    }}
                    className={`absolute ${shape.position} ${shape.size} rounded-full bg-indigo-600/30 blur-3xl`}
                  />
                ))}
              </div>

              {/* Modal header */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="mb-6 md:mb-10 text-center relative z-10"
              >
                <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
                  {service?.title || "Service"} Packages
                </h2>
                <p className="text-gray-300 max-w-3xl mx-auto text-sm md:text-base">
                  Choose the perfect package that suits your business needs and
                  budget.
                </p>
              </motion.div>

              {/* Cards in a grid layout */}
              <div
                className={`grid ${getGridColumns()} gap-4 md:gap-8 mb-8 relative z-10`}
              >
                {modals.map((modal, index) => (
                  <ModalCard
                    key={modal.id}
                    modal={modal}
                    index={index}
                    isVisible={isOpen}
                  />
                ))}
              </div>

              {/* Close button for desktop */}
              <div className="hidden md:flex justify-center mt-6 md:mt-8 relative z-10">
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                  onClick={onClose}
                  className="bg-gray-800 hover:bg-gray-700 text-gray-200 px-6 py-3 rounded-full transition-all flex items-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Close Packages
                </motion.button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Main Services Page
const ServicesPage = () => {
  const [activeServiceId, setActiveServiceId] = useState<number | null>(null);

  // Get active service
  const activeService = activeServiceId
    ? services.find((service) => service.id === activeServiceId) || null
    : null;

  // Handle opening and closing the modal
  const handleViewPackages = (serviceId: number) => {
    setActiveServiceId(serviceId);
  };

  const handleCloseModal = () => {
    setActiveServiceId(null);
  };

  // Hero section
  const HeroSection = () => (
    <div className="relative container rounded-2xl mx-auto px-4 flex items-center justify-center overflow-hidden min-h-[40vh] md:min-h-[50vh] mb-10 md:mb-16">
      <div className="absolute inset-0 bg-gradient-to-b from-black/90 to-transparent z-10"></div>
      <div className="absolute inset-0 bg-[url('/images/grids/grid1.gif')] bg-cover bg-center opacity-100"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black"></div>

      <div className="relative z-20 text-center max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Heading
            text="Our"
            highlightedText="Services"
            className="mb-4 md:mb-6"
          />

          <p className="text-gray-300 text-base md:text-xl leading-relaxed mb-6 md:mb-8">
            Discover our comprehensive range of digital services designed to
            transform your online presence and drive meaningful business growth
            in today's digital landscape.
          </p>
        </motion.div>
      </div>

      {/* Decorative elements */}
      <div className="absolute -bottom-10 left-0 w-full h-40 bg-gradient-to-t from-black to-transparent z-10"></div>
      <div className="absolute bottom-0 left-1/4 w-48 h-48 md:w-96 md:h-96 rounded-full bg-indigo-600/10 blur-3xl"></div>
      <div className="absolute top-1/4 right-1/4 w-48 h-48 md:w-96 md:h-96 rounded-full bg-purple-600/10 blur-3xl"></div>
    </div>
  );

  return (
    <main className="min-h-screen py-20 bg-black/10 text-white">
      {/* Hero section */}
      <HeroSection />

      <OfferCTA />

      {/* Services section */}
      <section className="container mx-auto px-4 py-8 md:py-16">
        <div className="space-y-6 md:space-y-12">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onViewPackages={handleViewPackages}
            />
          ))}
        </div>

        {/* CTA Section */}
        <div className="relative bg-gradient-to-br from-indigo-900/30 to-purple-900/30 backdrop-blur-lg rounded-xl p-6 md:p-12 border border-indigo-500/30 shadow-xl overflow-hidden mt-12 md:mt-20">
          {/* Decorative background */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-0 w-40 h-40 md:w-64 md:h-64 rounded-full bg-indigo-600/10 blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-40 h-40 md:w-64 md:h-64 rounded-full bg-purple-600/10 blur-3xl"></div>
          </div>

          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6">
              Ready to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-t from-gray-400 to-purple-600">
                Transform
              </span>{" "}
              Your Digital Presence?
            </h2>
            <p className="text-gray-300 text-base md:text-lg mb-6 md:mb-8">
              Let's discuss how our services can help you achieve your business
              goals. Contact us today for a free consultation.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
              {/* <a href="/#contact"> */}
              <MagicButton
                handleClick={() => {
                  window.location.href = "/#contact";
                }}
                title="Request a Quote"
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
              <a
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
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Modal for displaying service packages */}
      <ModalContainer
        isOpen={activeServiceId !== null}
        onClose={handleCloseModal}
        service={activeService}
      />

      {/* CSS for animations and effects */}
      <style jsx global>{`
        .gif-container {
          animation: float 3s ease-in-out infinite;
          will-change: transform;
          contain: layout;
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(10px);
          }
        }

        /* Force hardware acceleration */
        .force-gpu {
          transform: translateZ(0);
          backface-visibility: hidden;
          perspective: 1000px;
        }

        /* Improve scrolling smoothness */
        * {
          -webkit-overflow-scrolling: touch;
        }
      `}</style>
    </main>
  );
};

export default ServicesPage;
