"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { services } from "./services";
import Heading from "../ui/Heading";
import MagicButton from "../ui/MagicButton";

interface ServiceModalProps {
  modal: {
    id: number;
    title: string;
    features: string[];
    highlight?: boolean;
  };
  isSelected: boolean;
  onSelect: () => void;
}

const ServiceModal: React.FC<ServiceModalProps> = ({
  modal,
  isSelected,
  onSelect,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`bg-gradient-to-b ${
        modal.highlight
          ? "from-indigo-900/30 to-purple-900/30 border-indigo-500/50"
          : "from-gray-800/30 to-gray-900/30 border-gray-700/30"
      } border rounded-xl p-6 cursor-pointer transition-all duration-300 ${
        isSelected
          ? "scale-105 shadow-xl shadow-purple-500/10"
          : "hover:scale-102 hover:shadow-lg"
      }`}
      onClick={onSelect}
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
      <ul className="space-y-3">
        {modal.features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
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
            <span className="text-gray-300">{feature}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

interface ServiceModalDetailsProps {
  modal: {
    id: number;
    title: string;
    features: string[];
    highlight?: boolean;
  } | null;
}

const ServiceModalDetails: React.FC<ServiceModalDetailsProps> = ({ modal }) => {
  if (!modal) return null;

  return (
    <motion.div
      key={modal.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-gradient-to-b from-gray-800/70 to-gray-900/70 backdrop-blur-lg rounded-xl p-8 border border-gray-700/30 shadow-2xl"
    >
      <h3
        className={`text-3xl font-bold mb-6 ${
          modal.highlight ? "text-indigo-300" : "text-purple-300"
        }`}
      >
        {modal.title} Plan Details
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {modal.features.map((feature, index) => (
          <div key={index} className="flex items-start gap-3">
            <span
              className={`text-lg ${
                modal.highlight ? "text-indigo-400" : "text-purple-400"
              } mt-1 flex-shrink-0`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
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
            <span className="text-gray-200 text-lg">{feature}</span>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <MagicButton
          title="Get Started"
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

const ServiceCard: React.FC<{
  service: (typeof services)[0];
  isActive: boolean;
  onClick: () => void;
}> = ({ service, isActive, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`flex flex-col h-full rounded-2xl p-6 transition-all duration-300 cursor-pointer ${
        isActive
          ? "bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border-indigo-500/50 shadow-xl shadow-purple-500/10"
          : "bg-gradient-to-br from-gray-800/30 to-gray-900/30 border-gray-700/30 hover:shadow-lg"
      } border`}
      onClick={onClick}
    >
      <div className="w-full h-48 mb-6 overflow-hidden rounded-xl gif-container">
        <img
          src={service.gifUrl}
          alt={service.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      <h3
        className={`text-2xl font-bold mb-3 ${
          isActive ? "text-indigo-300" : "text-white"
        }`}
      >
        {service.title}
      </h3>

      <p className="text-gray-300 mb-4 flex-grow">{service.description}</p>

      <ul className="mb-6 space-y-2">
        {service.points.slice(0, 4).map((point, index) => (
          <li key={index} className="flex items-start gap-2">
            <span className="text-indigo-400 mt-1 flex-shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
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
            <span className="text-gray-300 text-sm">{point}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto">
        <button
          className={`w-full py-2 rounded-lg font-medium transition-all ${
            isActive
              ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
              : "bg-gray-700 text-gray-200 hover:bg-gray-600"
          }`}
        >
          {isActive ? "Currently Viewing" : "View Service"}
        </button>
      </div>
    </motion.div>
  );
};

const ServicesPage: React.FC = () => {
  const [activeServiceId, setActiveServiceId] = useState<number>(1);
  const [selectedModalId, setSelectedModalId] = useState<number | null>(null);

  const activeService =
    services.find((service) => service.id === activeServiceId) || services[0];
  const activeServiceModals = activeService?.modals || [];
  const selectedModal =
    activeServiceModals.find((modal) => modal.id === selectedModalId) || null;

  // Set first modal as default when service changes
  useEffect(() => {
    if (activeServiceModals.length > 0) {
      setSelectedModalId(activeServiceModals[0].id);
    } else {
      setSelectedModalId(null);
    }
  }, [activeServiceId]);

  // Hero section with parallax effect
  const HeroSection = () => (
    <div className="relative flex items-center justify-center overflow-hidden min-h-[60vh] mb-16">
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

          <MagicButton
            title="Explore Services"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            }
            position="right"
          />
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
      <HeroSection />

      <section className="container mx-auto px-4 py-16">
        {/* Service selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              isActive={service.id === activeServiceId}
              onClick={() => setActiveServiceId(service.id)}
            />
          ))}
        </div>

        {/* Active service details */}
        <div className="mb-20">
          <motion.div
            key={activeServiceId}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
                {activeService.title}
              </h2>
              <p className="text-gray-300 max-w-3xl mx-auto">
                {activeService.description}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 mx-auto max-w-6xl mb-16">
              <div className="w-full overflow-hidden rounded-xl p-1 border border-gray-700/30 bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-lg gif-container-large">
                <img
                  src={activeService.gifUrl}
                  alt={activeService.title}
                  className="w-full h-full object-cover rounded-lg"
                  loading="lazy"
                />
              </div>

              <div className="mt-8">
                <h3 className="text-2xl font-bold mb-6 text-gray-200">
                  Key Features
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {activeService.points.map((point, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 bg-gray-800/20 p-4 rounded-lg"
                    >
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
              </div>
            </div>
          </motion.div>
        </div>

        {/* Service packages */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
              Our {activeService.title} Packages
            </h2>
            <p className="text-gray-300 max-w-3xl mx-auto">
              Choose the perfect package that suits your business needs and
              budget.
            </p>
          </div>

          {/* Service modals */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {activeServiceModals.map((modal) => (
              <ServiceModal
                key={modal.id}
                modal={modal}
                isSelected={modal.id === selectedModalId}
                onSelect={() => setSelectedModalId(modal.id)}
              />
            ))}
          </div>

          {/* Selected modal details */}
          {selectedModal && <ServiceModalDetails modal={selectedModal} />}
        </div>

        {/* CTA Section */}
        <div className="relative bg-gradient-to-br from-indigo-900/30 to-purple-900/30 backdrop-blur-lg rounded-2xl p-8 md:p-12 border border-indigo-500/30 shadow-xl overflow-hidden">
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

      {/* CSS for animations and effects */}
      <style jsx global>{`
        .gif-container {
          animation: float 3s ease-in-out infinite;
          will-change: transform;
          contain: layout;
        }

        .gif-container-large {
          animation: float 5s ease-in-out infinite;
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
