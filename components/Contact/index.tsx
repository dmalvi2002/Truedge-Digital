"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useInView, useAnimation } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import Heading from "../ui/Heading";
import MagicButton from "../ui/MagicButton";

// Enable ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Form field type
type FormField = {
  name: string;
  value: string;
  error: string;
  focused?: boolean;
};

// Package options
type PackageOption = {
  id: string;
  name: string;
  subpackages: { id: string; name: string }[];
};

// Selected package type
type SelectedPackages = {
  [key: string]: string; // packageId -> selected subpackage id
};

const ContactSection = () => {
  // Package data
  const packageOptions: PackageOption[] = [
    {
      id: "web-development",
      name: "Web Development",
      subpackages: [
        { id: "web-basic", name: "Basic Package" },
        { id: "web-standard", name: "Standard Package" },
        { id: "web-premium", name: "Premium Package" },
      ],
    },
    {
      id: "seo-marketing",
      name: "SEO & Digital Marketing",
      subpackages: [
        { id: "seo-basic", name: "Basic Package" },
        { id: "seo-premium", name: "Premium Package" },
      ],
    },
  ];

  // Form state
  const [formFields, setFormFields] = useState<FormField[]>([
    { name: "name", value: "", error: "" },
    { name: "email", value: "", error: "" },
    { name: "message", value: "", error: "" },
  ]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedPackages, setSelectedPackages] = useState<SelectedPackages>(
    {}
  );
  const [packageError, setPackageError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Refs for GSAP animations
  const contactSectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  // For Framer Motion animations
  const controls = useAnimation();
  const isInView = useInView(contactSectionRef, { once: false, amount: 0.3 });

  // Contact information data
  const contactInfo = [
    {
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
          />
        </svg>
      ),
      title: "Phone",
      content: "+44 (0) 7832 921562",
    },
    {
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
      title: "Email",
      content: "info@truedgedigital.co.uk",
    },
  ];

  // Handle service checkbox selection
  const handleServiceToggle = (serviceId: string, checked: boolean) => {
    if (checked) {
      // Add service if not already included
      if (!selectedServices.includes(serviceId)) {
        setSelectedServices([...selectedServices, serviceId]);
      }
    } else {
      // Remove service if unchecked
      setSelectedServices(selectedServices.filter((id) => id !== serviceId));

      // Also remove any selected packages for this service
      const updatedPackages = { ...selectedPackages };
      delete updatedPackages[serviceId];
      setSelectedPackages(updatedPackages);
    }

    if (packageError) setPackageError("");
  };

  // Handle subpackage radio selection
  const handlePackageSelect = (serviceId: string, packageId: string) => {
    setSelectedPackages({
      ...selectedPackages,
      [serviceId]: packageId,
    });

    if (packageError) setPackageError("");
  };

  // Check if a service is selected
  const isServiceSelected = (serviceId: string) => {
    return selectedServices.includes(serviceId);
  };

  // Check if a package is selected
  const isPackageSelected = (serviceId: string, packageId: string) => {
    return selectedPackages[serviceId] === packageId;
  };

  // Initialize GSAP animations
  useEffect(() => {
    if (!contactSectionRef.current) return;

    // Create particles for background effect
    const particlesContainer = particlesRef.current;
    if (particlesContainer) {
      for (let i = 0; i < 20; i++) {
        const particle = document.createElement("div");
        particle.className = "absolute rounded-full bg-indigo-500 opacity-20";

        // Random size between 5-20px
        const size = Math.random() * 15 + 5;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;

        // Random position within container
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;

        particlesContainer.appendChild(particle);

        // Animate each particle with GSAP
        gsap.to(particle, {
          x: `${(Math.random() - 0.5) * 100}`,
          y: `${(Math.random() - 0.5) * 100}`,
          opacity: Math.random() * 0.5,
          duration: 5 + Math.random() * 10,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }
    }

    // Title animation with GSAP ScrollTrigger
    if (titleRef.current && subtitleRef.current) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: contactSectionRef.current,
          start: "top 80%",
          end: "top 50%",
          toggleActions: "play none none reverse",
        },
      });

      tl.from(titleRef.current, {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: "back.out(1.7)",
      }).from(
        subtitleRef.current,
        {
          y: 30,
          opacity: 0,
          duration: 0.6,
        },
        "-=0.4"
      );
    }

    // Map reveal animation
    if (mapRef.current) {
      gsap.from(mapRef.current, {
        scrollTrigger: {
          trigger: mapRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
        scale: 0.9,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
      });
    }

    // Cleanup function
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  // Framer Motion animations based on view
  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [isInView, controls]);

  // Form handling
  const handleInputChange = (index: number, value: string) => {
    const updatedFields = [...formFields];
    updatedFields[index].value = value;

    // Clear error when user types
    if (updatedFields[index].error) {
      updatedFields[index].error = "";
    }

    setFormFields(updatedFields);
  };

  const validateForm = (): boolean => {
    let isValid = true;
    const updatedFields = [...formFields];

    // Validate name
    if (!updatedFields[0].value.trim()) {
      updatedFields[0].error = "Name is required";
      isValid = false;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!updatedFields[1].value.trim()) {
      updatedFields[1].error = "Email is required";
      isValid = false;
    } else if (!emailRegex.test(updatedFields[1].value)) {
      updatedFields[1].error = "Please enter a valid email";
      isValid = false;
    }

    // Validate message
    if (!updatedFields[2].value.trim()) {
      updatedFields[2].error = "Message is required";
      isValid = false;
    }

    // Validate service selection
    if (selectedServices.length === 0) {
      setPackageError("Please select at least one service");
      isValid = false;
    } else {
      // Check if selected services have a package selected
      const missingPackageSelection = selectedServices.some(
        (serviceId) => !selectedPackages[serviceId]
      );

      if (missingPackageSelection) {
        setPackageError("Please select a package for each selected service");
        isValid = false;
      }
    }

    setFormFields(updatedFields);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    // Prepare selected services information for submission
    const selectedServicesInfo = selectedServices.map((serviceId) => {
      const serviceOption = packageOptions.find((p) => p.id === serviceId);
      const serviceName = serviceOption?.name || "";

      const selectedPackageId = selectedPackages[serviceId];
      const selectedPackageInfo = serviceOption?.subpackages.find(
        (sp) => sp.id === selectedPackageId
      );
      const packageName = selectedPackageInfo?.name || "";

      return {
        service: serviceName,
        package: packageName,
      };
    });

    // Prepare data for submission
    const formData = {
      name: formFields[0].value,
      email: formFields[1].value,
      message: formFields[2].value,
      selectedServices: selectedServicesInfo,
    };

    console.log("Submitting form data:", formData);

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Form animation on success
      if (formRef.current) {
        gsap.to(formRef.current, {
          y: -10,
          opacity: 0,
          duration: 0.5,
          onComplete: () => {
            setSubmitSuccess(true);
            // Reset animation
            gsap.fromTo(
              formRef.current,
              { y: 20, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.5, delay: 0.2 }
            );
          },
        });
      }
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormFields([
      { name: "name", value: "", error: "" },
      { name: "email", value: "", error: "" },
      { name: "message", value: "", error: "" },
    ]);
    setSelectedServices([]);
    setSelectedPackages({});
    setPackageError("");
    setSubmitSuccess(false);
  };

  const inputVariants = {
    focus: { scale: 1.02, boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)" },
    blur: { scale: 1, boxShadow: "0px 0px 0px rgba(0, 0, 0, 0)" },
  };

  const formFieldVariants = {
    hidden: (i: number) => ({
      opacity: 0,
      y: 20,
      transition: { duration: 0.5, delay: i * 0.1 },
    }),
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: i * 0.1 },
    }),
  };

  const serviceVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div
      ref={contactSectionRef}
      className="relative py-24 bg-transparent overflow-hidden"
      id="contact"
    >
      {/* Particles background */}
      <div
        ref={particlesRef}
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Heading text="Get in" highlightedText="Touch" className="" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Contact Form */}
          <div className="bg-slate-950/50 rounded-2xl shadow-xl p-8 md:p-10 relative z-10">
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
              {submitSuccess ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-center py-10"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                    className="w-20 h-20 bg-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <svg
                      className="w-10 h-10"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-100 mb-2">
                    Thank you!
                  </h3>
                  <p className="text-gray-300 mb-6">
                    Your message has been sent successfully. We'll get back to
                    you soon.
                  </p>
                  <MagicButton
                    title="Send Another Message"
                    icon={null}
                    position="center"
                    handleClick={resetForm}
                    otherClasses="!bg-[#161A31]"
                  />
                </motion.div>
              ) : (
                <>
                  {/* Name and Email Fields First */}
                  {formFields.slice(0, 2).map((field, index) => (
                    <motion.div
                      key={field.name}
                      custom={index}
                      initial="hidden"
                      animate="visible"
                      variants={formFieldVariants}
                      className="relative"
                    >
                      <motion.input
                        whileFocus="focus"
                        animate={formFields[index].focused ? "focus" : "blur"}
                        variants={inputVariants}
                        type={field.name === "email" ? "email" : "text"}
                        id={field.name}
                        name={field.name}
                        value={field.value}
                        onChange={(e) =>
                          handleInputChange(index, e.target.value)
                        }
                        onFocus={() => {
                          const updatedFields = [...formFields];
                          updatedFields[index].focused = true;
                          setFormFields(updatedFields);
                        }}
                        onBlur={() => {
                          const updatedFields = [...formFields];
                          updatedFields[index].focused = false;
                          setFormFields(updatedFields);
                        }}
                        className={`block w-full px-4 py-3 rounded-lg bg-slate-800/70 text-white border ${
                          field.error ? "border-red-500" : "border-slate-600"
                        } focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 placeholder:text-slate-400`}
                        placeholder={`Your ${
                          field.name.charAt(0).toUpperCase() +
                          field.name.slice(1)
                        }`}
                      />
                      {field.error && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-1 text-sm text-red-400"
                        >
                          {field.error}
                        </motion.p>
                      )}
                    </motion.div>
                  ))}

                  {/* Service Selection */}
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={serviceVariants}
                    className="relative bg-gradient-to-r from-slate-800/70 to-slate-900/70 rounded-xl p-6 shadow-inner border border-slate-700/50"
                  >
                    <div className="flex justify-between items-center mb-4 border-b border-slate-700 pb-2">
                      <h3 className="text-lg font-medium text-white">
                        Choose Your Services
                      </h3>
                      <a
                        href="/services"
                        className="text-indigo-400 rounded-2xl p-2 hover:text-indigo-300 flex items-center transition-colors duration-300 text-sm font-medium"
                      >
                        See all services
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 ml-1"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </a>
                    </div>

                    {/* Service options */}
                    <div className="space-y-5">
                      {packageOptions.map((packageOption) => (
                        <div key={packageOption.id} className="space-y-3">
                          {/* Main service checkbox - custom styled */}
                          <div
                            className={`flex items-center p-3.5 rounded-lg cursor-pointer transition-all duration-300 transform ${
                              isServiceSelected(packageOption.id)
                                ? "bg-indigo-600/30 border border-indigo-500 shadow-md scale-[1.01]"
                                : "hover:bg-slate-700/50 border border-transparent hover:border-slate-600"
                            }`}
                            onClick={() =>
                              handleServiceToggle(
                                packageOption.id,
                                !isServiceSelected(packageOption.id)
                              )
                            }
                          >
                            <div
                              className={`w-5 h-5 flex-shrink-0 rounded-md flex items-center justify-center transition-all duration-300 ${
                                isServiceSelected(packageOption.id)
                                  ? "bg-indigo-600 ring-2 ring-indigo-400 ring-opacity-50"
                                  : "border-2 border-gray-400 bg-transparent"
                              }`}
                            >
                              {isServiceSelected(packageOption.id) && (
                                <svg
                                  className="w-3 h-3 text-white"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              )}
                            </div>
                            <span className="ml-3 text-base font-medium text-white">
                              {packageOption.name}
                            </span>
                          </div>

                          {/* Package options - only show if service is selected */}
                          {isServiceSelected(packageOption.id) && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              transition={{ duration: 0.3 }}
                              className="ml-5 mt-3 grid grid-cols-1 gap-3"
                            >
                              {packageOption.subpackages.map((subpackage) => (
                                <div
                                  key={subpackage.id}
                                  className={`flex items-center p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                                    isPackageSelected(
                                      packageOption.id,
                                      subpackage.id
                                    )
                                      ? "bg-indigo-600/30 border border-indigo-500 shadow-md transform scale-[1.02]"
                                      : "hover:bg-slate-700/50 border border-slate-700/50 hover:border-slate-500"
                                  }`}
                                  onClick={() =>
                                    handlePackageSelect(
                                      packageOption.id,
                                      subpackage.id
                                    )
                                  }
                                >
                                  <div className="relative">
                                    <div
                                      className={`w-5 h-5 flex-shrink-0 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                                        isPackageSelected(
                                          packageOption.id,
                                          subpackage.id
                                        )
                                          ? "border-indigo-400"
                                          : "border-gray-500"
                                      }`}
                                    >
                                      {isPackageSelected(
                                        packageOption.id,
                                        subpackage.id
                                      ) && (
                                        <motion.div
                                          initial={{ scale: 0 }}
                                          animate={{ scale: 1 }}
                                          className="w-2.5 h-2.5 rounded-full bg-indigo-400"
                                        ></motion.div>
                                      )}
                                    </div>
                                  </div>
                                  <span
                                    className={`ml-3 block text-sm w-full ${
                                      isPackageSelected(
                                        packageOption.id,
                                        subpackage.id
                                      )
                                        ? "text-white font-medium"
                                        : "text-gray-300"
                                    }`}
                                  >
                                    {subpackage.name}
                                  </span>
                                </div>
                              ))}
                            </motion.div>
                          )}
                        </div>
                      ))}
                    </div>
                    {packageError && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-3 text-sm text-red-400 bg-red-500/10 p-2 rounded-md border border-red-500/30"
                      >
                        <div className="flex items-center">
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                          {packageError}
                        </div>
                      </motion.div>
                    )}
                  </motion.div>

                  {/* Message Field */}
                  <motion.div
                    custom={2}
                    initial="hidden"
                    animate="visible"
                    variants={formFieldVariants}
                    className="relative"
                  >
                    <motion.textarea
                      whileFocus="focus"
                      animate={formFields[2].focused ? "focus" : "blur"}
                      variants={inputVariants}
                      id={formFields[2].name}
                      name={formFields[2].name}
                      value={formFields[2].value}
                      rows={4}
                      onChange={(e) => handleInputChange(2, e.target.value)}
                      onFocus={() => {
                        const updatedFields = [...formFields];
                        updatedFields[2].focused = true;
                        setFormFields(updatedFields);
                      }}
                      onBlur={() => {
                        const updatedFields = [...formFields];
                        updatedFields[2].focused = false;
                        setFormFields(updatedFields);
                      }}
                      className={`block w-full px-4 py-3 rounded-lg bg-slate-800/70 text-white border ${
                        formFields[2].error
                          ? "border-red-500"
                          : "border-slate-600"
                      } focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 placeholder:text-slate-400`}
                      placeholder="Your Message"
                    />
                    {formFields[2].error && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-1 text-sm text-red-400"
                      >
                        {formFields[2].error}
                      </motion.p>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex justify-center"
                  >
                    <MagicButton
                      title={isSubmitting ? "Sending..." : "Send Message"}
                      icon={
                        isSubmitting ? (
                          <svg
                            className="animate-spin h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                        ) : null
                      }
                      position="center"
                      handleClick={() =>
                        isSubmitting
                          ? undefined
                          : handleSubmit(
                              new Event("submit") as unknown as React.FormEvent
                            )
                      }
                      otherClasses={`!bg-[#161A31] ${
                        isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                      }`}
                    />
                  </motion.div>
                </>
              )}
            </form>
          </div>

          {/* Map & Info */}
          <div ref={mapRef} className="space-y-8">
            <div className="overflow-hidden rounded-xl shadow-lg h-64 md:h-80 relative">
              {/* GIF display instead of map */}
              <div className="absolute inset-0 bg-gray-900/30 flex items-center justify-center">
                <img
                  src="/images/send4.gif"
                  alt="Contact us animation"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={controls}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    staggerChildren: 0.1,
                    delayChildren: 0.3,
                  },
                },
              }}
            >
              {/* Contact Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {contactInfo.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 p-6 rounded-xl border border-slate-700/50 shadow-lg hover:shadow-indigo-500/10 backdrop-blur-sm"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="rounded-lg bg-indigo-600/20 text-indigo-400 p-3 flex items-center justify-center">
                        {item.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-200 text-lg mb-1">
                          {item.title}
                        </h3>
                        <p className="text-indigo-300/90 font-medium">
                          {item.content}
                        </p>
                      </div>
                    </div>
                    <motion.div
                      className="w-full h-0.5 bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent mt-4 rounded-full"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;
