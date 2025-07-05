"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useInView, useAnimation } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import Heading from "../ui/Heading";
import MagicButton from "../ui/MagicButton";
import emailjs from "@emailjs/browser";

// Enable ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// EmailJS configuration
const EMAILJS_SERVICE_ID = "service_wkz2val";
const EMAILJS_TEMPLATE_ID = "template_jnsd323";
const EMAILJS_PUBLIC_KEY = "F3dlBGHsu_Lo6I1RG";

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
      name: "Web Design & Development",
      subpackages: [
        { id: "web-basic", name: "1 Page Website" },
        { id: "web-standard", name: "Business Essential" },
        { id: "web-premium", name: "Business Professional" },
        { id: "web-custom", name: "Custom Package Inquiries" },
      ],
    },
    {
      id: "seo-marketing",
      name: "SEO & Digital Marketing",
      subpackages: [
        { id: "seo-basic", name: "Business Essential" },
        { id: "seo-premium", name: "Business Professional" },
        { id: "seo-custom", name: "Custom Plan Inquiries" },
      ],
    },
  ];

  // Form state
  const [formFields, setFormFields] = useState<FormField[]>([
    { name: "name", value: "", error: "" },
    { name: "email", value: "", error: "" },
    { name: "phone", value: "", error: "" }, // Added phone field
    { name: "message", value: "", error: "" },
  ]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedPackages, setSelectedPackages] = useState<SelectedPackages>(
    {}
  );
  const [packageError, setPackageError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string>("");

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
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M20.52 3.48A11.83 11.83 0 0 0 3.5 20.5l-1.38 4.5 4.64-1.34A11.84 11.84 0 1 0 20.52 3.48Zm-4.67 13.37c-.4.53-1.1.77-1.73.52-1.93-.78-4.07-2.84-4.83-4.86a1.38 1.38 0 0 1 .34-1.54c.27-.26.54-.54.8-.81.24-.25.3-.6.17-.91a14.16 14.16 0 0 0-.75-1.61c-.21-.42-.74-.56-1.14-.32a8.76 8.76 0 0 0-1.8 1.57c-.94 1.07-1.03 2.59-.24 4.31 1.12 2.56 3.85 5.08 6.48 5.9 1.38.45 2.66.26 3.62-.51.59-.48 1.16-1 1.7-1.55.33-.35.3-.91-.07-1.22-.33-.28-.7-.56-1.1-.83-.4-.26-.97-.17-1.27.22Z" />
        </svg>
      ),
      title: "Whatsapp",
      content: "+44 7907 901171",
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

  // Format services for EmailJS
  const formatSelectedServices = () => {
    let servicesText = "";

    selectedServices.forEach((serviceId) => {
      const serviceOption = packageOptions.find((p) => p.id === serviceId);
      if (!serviceOption) return;

      const serviceName = serviceOption.name;
      const selectedPackageId = selectedPackages[serviceId];
      const selectedPackage = serviceOption.subpackages.find(
        (p) => p.id === selectedPackageId
      );
      const packageName = selectedPackage
        ? selectedPackage.name
        : "No package selected";

      servicesText += `${serviceName}: ${packageName}\n`;
    });

    return servicesText.trim();
  };

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

  // Function to handle phone number input validation
  const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Allow only numbers and the "+" sign, and limit to 15 characters
    const sanitizedValue = value.replace(/[^0-9+]/g, "").slice(0, 15);

    handleInputChange(2, sanitizedValue);
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

    // Validate phone (optional but must be valid if provided)
    // Validate phone (required)
    const phoneRegex = /^\+?[0-9]{0,15}$/;
    if (!updatedFields[2].value.trim()) {
      updatedFields[2].error = "Phone number is required";
      isValid = false;
    } else if (!/^[0-9+\s()-]+$/.test(updatedFields[2].value)) {
      updatedFields[2].error =
        "Phone number can only contain digits and +()- characters";
      isValid = false;
    } else if (updatedFields[2].value.replace(/[^0-9]/g, "").length > 15) {
      updatedFields[2].error = "Phone number is too long (max 15 digits)";
      isValid = false;
    } else if (
      !phoneRegex.test(updatedFields[2].value.replace(/[\s()-]/g, ""))
    ) {
      updatedFields[2].error = "Please enter a valid phone number";
      isValid = false;
    }

    // Validate message
    if (!updatedFields[3].value.trim()) {
      updatedFields[3].error = "Message is required";
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
    setSubmitError("");

    // Prepare services information for EmailJS
    const servicesText = formatSelectedServices();

    // Prepare data for EmailJS
    const emailjsParams = {
      name: formFields[0].value,
      email: formFields[1].value,
      number: formFields[2].value, // Phone number
      services: servicesText,
      message: formFields[3].value,
    };

    console.log("Submitting form data:", emailjsParams);

    try {
      // Send email using EmailJS
      if (!EMAILJS_PUBLIC_KEY) {
        throw new Error(
          "EmailJS public key is missing. Please configure it properly."
        );
      }

      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        emailjsParams,
        EMAILJS_PUBLIC_KEY
      );

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
      setSubmitError(
        "There was an error sending your message. Please try again later."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormFields([
      { name: "name", value: "", error: "" },
      { name: "email", value: "", error: "" },
      { name: "phone", value: "", error: "" },
      { name: "message", value: "", error: "" },
    ]);
    setSelectedServices([]);
    setSelectedPackages({});
    setPackageError("");
    setSubmitSuccess(false);
    setSubmitError("");
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
      className="relative pt-16 pb-10 bg-transparent overflow-hidden"
      id="contact"
    >
      {/* Particles background */}
      <div
        ref={particlesRef}
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <Heading text="Get in" highlightedText="Touch" className="mb-4" />
          <p
            ref={subtitleRef}
            className="text-gray-300 max-w-xl mx-auto items-center text-lg md:text-xl font-normal mb-6 glow-text"
          >
            Your message matters to us. A dedicated team member will respond
            within{" "}
            <span className="text-indigo-400 font-semibold">30 minutes.</span>
          </p>

          <style jsx>{`
            .glow-text {
              text-shadow: 0 0 8px rgba(186, 85, 211, 0.4),
                0 0 16px rgba(186, 85, 211, 0.3);
            }
          `}</style>
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
                  {/* Name, Email, and Phone Fields First */}
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
                        type={
                          field.name === "email"
                            ? "email"
                            : field.name === "phone"
                            ? "tel"
                            : "text"
                        }
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
                        }${field.name === "phone" ? " " : ""}`}
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

                  {/* Phone Field */}
                  <motion.div
                    custom={2}
                    initial="hidden"
                    animate="visible"
                    variants={formFieldVariants}
                    className="relative"
                  >
                    <motion.input
                      whileFocus="focus"
                      animate={formFields[2].focused ? "focus" : "blur"}
                      variants={inputVariants}
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formFields[2].value}
                      onChange={handlePhoneInput} // Use the custom handler for phone input
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
                      placeholder="Your Phone"
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
                    custom={3}
                    initial="hidden"
                    animate="visible"
                    variants={formFieldVariants}
                    className="relative"
                  >
                    <motion.textarea
                      whileFocus="focus"
                      animate={formFields[3].focused ? "focus" : "blur"}
                      variants={inputVariants}
                      id={formFields[3].name}
                      name={formFields[3].name}
                      value={formFields[3].value}
                      rows={4}
                      onChange={(e) => handleInputChange(3, e.target.value)}
                      onFocus={() => {
                        const updatedFields = [...formFields];
                        updatedFields[3].focused = true;
                        setFormFields(updatedFields);
                      }}
                      onBlur={() => {
                        const updatedFields = [...formFields];
                        updatedFields[3].focused = false;
                        setFormFields(updatedFields);
                      }}
                      className={`block w-full px-4 py-3 rounded-lg bg-slate-800/70 text-white border ${
                        formFields[3].error
                          ? "border-red-500"
                          : "border-slate-600"
                      } focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 placeholder:text-slate-400`}
                      placeholder="Your Message"
                    />
                    {formFields[3].error && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-1 text-sm text-red-400"
                      >
                        {formFields[3].error}
                      </motion.p>
                    )}
                  </motion.div>

                  {/* Display form submission error if any */}
                  {submitError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-500/10 p-3 rounded-md border border-red-500/30 text-red-400 text-sm"
                    >
                      <div className="flex items-center">
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293-1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                        {submitError}
                      </div>
                    </motion.div>
                  )}

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
                            className="animate-spin h-5 w-5 text-white mr-2"
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
                      type="submit"
                      disabled={isSubmitting}
                      otherClasses={`bg-[#161A31] ${
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
              initial={{ opacity: 1, y: 20 }}
              animate={controls}
              variants={{
                hidden: { opacity: 1, y: 20 },
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
                {contactInfo.map((item, index) => {
                  const isWhatsApp = item.title === "Whatsapp";
                  const Wrapper = isWhatsApp ? "a" : "div";
                  const wrapperProps = isWhatsApp
                    ? {
                        href: "https://wa.me/447907901171",
                        target: "_blank",
                        rel: "noopener noreferrer",
                        className: "block", // Ensures display block
                      }
                    : {};

                  return (
                    <Wrapper key={index} {...wrapperProps}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        whileHover={{ y: -5 }}
                        className={`bg-gradient-to-br from-slate-800/80 to-slate-900/80 p-5 rounded-xl border border-slate-700/50 shadow-lg hover:shadow-indigo-500/10 backdrop-blur-sm flex flex-col h-full ${
                          isWhatsApp ? "cursor-pointer" : ""
                        }`}
                      >
                        <div className="flex items-start space-x-3 flex-1">
                          <div className="rounded-lg bg-indigo-600/20 text-indigo-400 p-2 flex-shrink-0 w-10 h-10 flex items-center justify-center">
                            {item.icon}
                          </div>
                          <div className="flex flex-col justify-center min-w-0 flex-1">
                            <h3 className="font-bold text-gray-200 text-base mb-0.5 truncate">
                              {item.title}
                            </h3>
                            <p className="text-indigo-300/90 font-medium text-sm overflow-hidden text-ellipsis">
                              {item.content}
                            </p>
                          </div>
                        </div>
                        <motion.div
                          className="w-full h-0.5 bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent mt-3 rounded-full"
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: 0.6, delay: 0.2 }}
                        />
                      </motion.div>
                    </Wrapper>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;
