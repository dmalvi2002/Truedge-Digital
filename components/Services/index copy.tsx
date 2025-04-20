"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { services } from "./services";
import Heading from "../ui/Heading";
import MagicButton from "../ui/MagicButton";

// Define interface for modal data
interface Modal {
  id: number;
  title: string;
  features: string[];
  highlight?: boolean;
}

// Modal Card Component
const ModalCard = ({
  modal,
  index,
  isVisible,
  totalCards,
}: {
  modal: Modal;
  index: number;
  isVisible: boolean;
  totalCards: number;
}) => {
  // Calculate the positioning based on index and total cards
  const calculatePosition = () => {
    // Fan out effect
    const angle = index === 1 ? 0 : index === 0 ? -15 : 15;
    const translateX = index === 1 ? 0 : index === 0 ? -20 : 20;

    return {
      rotate: angle,
      translateX: translateX,
      translateY: index === 1 ? 0 : -10,
      zIndex: totalCards - index,
    };
  };

  const position = calculatePosition();

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 100,
        rotate: position.rotate,
        x: position.translateX,
        zIndex: position.zIndex,
      }}
      animate={{
        opacity: isVisible ? 1 : 0,
        y: isVisible ? position.translateY : 100,
        rotate: position.rotate,
        x: position.translateX,
        zIndex: position.zIndex,
      }}
      exit={{
        opacity: 0,
        y: 100,
        transition: { duration: 0.3 },
      }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        type: "spring",
        damping: 15,
      }}
      className={`absolute top-0 left-0 right-0 w-full max-w-md mx-auto bg-gradient-to-b ${
        modal.highlight
          ? "from-indigo-900/80 to-purple-900/80 border-indigo-500/50"
          : "from-gray-800/80 to-gray-900/80 border-gray-700/30"
      } backdrop-blur-lg border rounded-xl p-6 shadow-xl`}
      style={{
        transformOrigin: "bottom center",
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
        className={`text-2xl font-bold mb-4 text-center ${
          modal.highlight ? "text-indigo-300" : "text-gray-200"
        }`}
      >
        {modal.title}
      </h3>

      <ul className="space-y-3 mt-8">
        {modal.features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <span
              className={`text-lg ${
                modal.highlight ? "text-indigo-400" : "text-purple-400"
              } mt-1`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
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
          </li>
        ))}
      </ul>

      <div className="mt-8 flex justify-center">
        <MagicButton
          title="Select Package"
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
      className="flex flex-col md:flex-row gap-8 bg-gradient-to-br from-gray-900/70 to-black/70 backdrop-blur-md border border-gray-700/30 rounded-xl p-6 md:p-8"
    >
      <div className="w-full md:w-1/3">
        <div className="w-full rounded-xl overflow-hidden gif-container mb-6">
          <img
            src={service.gifUrl}
            alt={service.title}
            className="w-full h-64 object-cover"
            loading="lazy"
          />
        </div>

        <h3 className="text-2xl md:text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
          {service.title}
        </h3>
      </div>

      <div className="w-full md:w-2/3">
        <p className="text-gray-300 mb-6 text-lg leading-relaxed">
          {service.description}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {service.points.slice(0, 6).map((point, index) => (
            <div key={index} className="flex items-start gap-3">
              <span className="text-indigo-400 mt-1 flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
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
              <span className="text-gray-300">{point}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => onViewPackages(service.id)}
            className="px-6 py-3 rounded-lg font-medium bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500 transition-all transform hover:scale-105 shadow-md hover:shadow-indigo-600/20"
          >
            View Packages
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 inline-block ml-2"
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
  const modalCount = modals.length;

  // Close when clicking outside of modals
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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/70 backdrop-blur-sm"
        >
          <div className="w-full max-w-5xl mx-auto px-4 relative">
            {/* Modal header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="mb-16 text-center"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
                {service?.title || "Service"} Packages
              </h2>
              <p className="text-gray-300 max-w-3xl mx-auto">
                Choose the perfect package that suits your business needs and
                budget.
              </p>
            </motion.div>

            {/* Cards container */}
            <div className="relative h-[600px]" ref={containerRef}>
              {modals.map((modal, index) => (
                <ModalCard
                  key={modal.id}
                  modal={modal}
                  index={index}
                  isVisible={isOpen}
                  totalCards={modalCount}
                />
              ))}
            </div>

            {/* Close button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              onClick={onClose}
              className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 bg-gray-800 hover:bg-gray-700 text-gray-200 px-6 py-3 rounded-full transition-all flex items-center gap-2"
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
    <div className="relative flex items-center justify-center overflow-hidden min-h-[50vh] mb-16">
      <div className="absolute inset-0 bg-gradient-to-b from-black to-transparent z-10"></div>
      <div className="absolute inset-0 bg-[url('/images/service-hero.jpg')] bg-cover bg-center opacity-40"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black"></div>

      <div className="relative z-20 text-center max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Heading text="Our" highlightedText="Services" className="mb-6" />

          <p className="text-gray-300 text-lg md:text-xl leading-relaxed mb-8">
            Discover our comprehensive range of digital services designed to
            transform your online presence and drive meaningful business growth
            in today's digital landscape.
          </p>
        </motion.div>
      </div>

      {/* Decorative elements */}
      <div className="absolute -bottom-10 left-0 w-full h-40 bg-gradient-to-t from-black to-transparent z-10"></div>
      <div className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full bg-indigo-600/10 blur-3xl"></div>
      <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-purple-600/10 blur-3xl"></div>
    </div>
  );

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero section */}
      <HeroSection />

      {/* Services section */}
      <section className="container mx-auto px-4 py-16">
        <div className="space-y-12">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onViewPackages={() => handleViewPackages(service.id)}
            />
          ))}
        </div>

        {/* CTA Section */}
        <div className="relative bg-gradient-to-br from-indigo-900/30 to-purple-900/30 backdrop-blur-lg rounded-2xl p-8 md:p-12 border border-indigo-500/30 shadow-xl overflow-hidden mt-20">
          {/* Decorative background */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-indigo-600/10 blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-purple-600/10 blur-3xl"></div>
          </div>

          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
                Transform
              </span>{" "}
              Your Digital Presence?
            </h2>
            <p className="text-gray-300 text-lg mb-8">
              Let's discuss how our services can help you achieve your business
              goals. Contact us today for a free consultation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <MagicButton
                title="Request a Quote"
                icon={null}
                position="left"
              />
              <button className="px-6 py-3 rounded-lg border border-gray-400 text-gray-200 hover:bg-gray-800/40 transition-all">
                Contact Us
              </button>
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
      `}</style>
    </main>
  );
};

export default ServicesPage;
