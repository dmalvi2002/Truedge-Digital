"use client";
import React, { useEffect } from "react";
import { motion, useAnimate, stagger } from "framer-motion";
// Modified AnimatedLogoText component with drawing effect
const AnimatedLogoText = () => {
  const [scope, animate] = useAnimate();

  // Run animation when component mounts
  useEffect(() => {
    const animateLogo = async () => {
      // Drawing animation for each letter
      await animate(
        ".letter-path",
        {
          pathLength: [0, 1],
          opacity: [0, 1],
        },
        {
          duration: 2,
          delay: stagger(0.1),
          ease: "easeOut",
        }
      );

      // Fill in the text after drawing
      await animate(
        ".letter",
        {
          fillOpacity: [0, 1],
        },
        {
          duration: 1,
          delay: stagger(0.05),
          ease: "easeInOut",
        }
      );

      // Continuous floating animation
      animate(
        scope.current,
        { y: [0, -8, 0] },
        {
          duration: 4,
          ease: "easeInOut",
          repeat: Infinity,
        }
      );

      // Continuous subtle glow animation
      animate(
        ".letter",
        {
          filter: [
            "drop-shadow(0 0 2px rgba(111, 134, 245, 0.5))",
            "drop-shadow(0 0 8px rgba(111, 134, 245, 0.8))",
            "drop-shadow(0 0 2px rgba(111, 134, 245, 0.5))",
          ],
        },
        {
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }
      );
    };

    animateLogo();
  }, [animate]);

  return (
    <motion.div
      ref={scope}
      className="flex justify-center absolute top-full left-1/2 transform -translate-x-1/2 mt-4 px-6 py-2 rounded-full bg-black/20 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <svg
        width="180"
        height="28"
        viewBox="0 0 180 28"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
      >
        <defs>
          <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#a78bfa" />
            <stop offset="50%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>

        {/* T */}
        <motion.path
          d="M10 5 L20 5 L20 8 L17 8 L17 22 L13 22 L13 8 L10 8 Z"
          className="letter-path"
          stroke="url(#textGradient)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="url(#textGradient)"
          fillOpacity="0"
          initial={{ pathLength: 0, opacity: 0 }}
        />
        <motion.path
          d="M10 5 L20 5 L20 8 L17 8 L17 22 L13 22 L13 8 L10 8 Z"
          className="letter"
          fill="url(#textGradient)"
          fillOpacity="0"
        />

        {/* r */}
        <motion.path
          d="M24 12 L24 22 L28 22 L28 12 C28 10 30 9 32 10 L32 12.5 C30 11.5 28 12 28 14"
          className="letter-path"
          stroke="url(#textGradient)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="url(#textGradient)"
          fillOpacity="0"
          initial={{ pathLength: 0, opacity: 0 }}
        />
        <motion.path
          d="M24 12 L24 22 L28 22 L28 12 C28 10 30 9 32 10 L32 12.5 C30 11.5 28 12 28 14"
          className="letter"
          fill="url(#textGradient)"
          fillOpacity="0"
        />

        {/* u */}
        <motion.path
          d="M36 12 L36 20 C36 21 37 22 38 22 C39 22 40 21 40 20 L40 12 L44 12 L44 22 L40 22 L40 20 C39 22 37 23 35 22 C33 21 32 20 32 17 L32 12 Z"
          className="letter-path"
          stroke="url(#textGradient)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="url(#textGradient)"
          fillOpacity="0"
          initial={{ pathLength: 0, opacity: 0 }}
        />
        <motion.path
          d="M36 12 L36 20 C36 21 37 22 38 22 C39 22 40 21 40 20 L40 12 L44 12 L44 22 L40 22 L40 20 C39 22 37 23 35 22 C33 21 32 20 32 17 L32 12 Z"
          className="letter"
          fill="url(#textGradient)"
          fillOpacity="0"
        />

        {/* e */}
        <motion.path
          d="M48 17 L56 17 C56 19 54 20 52 20 C50 20 48 19 48 17 C48 15 50 14 52 14 C54 14 56 15 56 17 L56 18 C56 21 54 23 51 23 C48 23 46 21 46 18 C46 15 48 13 51 13 C54 13 56 15 56 18"
          className="letter-path"
          stroke="url(#textGradient)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="url(#textGradient)"
          fillOpacity="0"
          initial={{ pathLength: 0, opacity: 0 }}
        />
        <motion.path
          d="M48 17 L56 17 C56 19 54 20 52 20 C50 20 48 19 48 17 C48 15 50 14 52 14 C54 14 56 15 56 17 L56 18 C56 21 54 23 51 23 C48 23 46 21 46 18 C46 15 48 13 51 13 C54 13 56 15 56 18"
          className="letter"
          fill="url(#textGradient)"
          fillOpacity="0"
        />

        {/* d */}
        <motion.path
          d="M70 5 L70 22 L66 22 L66 20 C65 22 63 23 61 22 C59 21 58 19 58 17 C58 15 59 13 61 12 C63 11 65 12 66 14 L66 5 Z M62 19 C64 19 66 17 66 15 C66 13 64 11 62 11 C60 11 58 13 58 15 C58 17 60 19 62 19 Z"
          className="letter-path"
          stroke="url(#textGradient)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="url(#textGradient)"
          fillOpacity="0"
          initial={{ pathLength: 0, opacity: 0 }}
        />
        <motion.path
          d="M70 5 L70 22 L66 22 L66 20 C65 22 63 23 61 22 C59 21 58 19 58 17 C58 15 59 13 61 12 C63 11 65 12 66 14 L66 5 Z M62 19 C64 19 66 17 66 15 C66 13 64 11 62 11 C60 11 58 13 58 15 C58 17 60 19 62 19 Z"
          className="letter"
          fill="url(#textGradient)"
          fillOpacity="0"
        />

        {/* g */}
        <motion.path
          d="M82 14 L82 22 L78 22 L78 14 C78 13 77 12 76 12 C75 12 74 13 74 14 L74 22 L70 22 L70 14 C70 11 72 8 76 8 C80 8 82 11 82 14 Z M78 24 C78 26 75 28 72 28 C69 28 66 26 66 24 L70 24 C70 25 71 26 72 26 C73 26 74 25 74 24 Z"
          className="letter-path"
          stroke="url(#textGradient)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="url(#textGradient)"
          fillOpacity="0"
          initial={{ pathLength: 0, opacity: 0 }}
        />
        <motion.path
          d="M82 14 L82 22 L78 22 L78 14 C78 13 77 12 76 12 C75 12 74 13 74 14 L74 22 L70 22 L70 14 C70 11 72 8 76 8 C80 8 82 11 82 14 Z M78 24 C78 26 75 28 72 28 C69 28 66 26 66 24 L70 24 C70 25 71 26 72 26 C73 26 74 25 74 24 Z"
          className="letter"
          fill="url(#textGradient)"
          fillOpacity="0"
        />

        {/* e */}
        <motion.path
          d="M88 17 L96 17 C96 19 94 20 92 20 C90 20 88 19 88 17 C88 15 90 14 92 14 C94 14 96 15 96 17 L96 18 C96 21 94 23 91 23 C88 23 86 21 86 18 C86 15 88 13 91 13 C94 13 96 15 96 18"
          className="letter-path"
          stroke="url(#textGradient)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="url(#textGradient)"
          fillOpacity="0"
          initial={{ pathLength: 0, opacity: 0 }}
        />
        <motion.path
          d="M88 17 L96 17 C96 19 94 20 92 20 C90 20 88 19 88 17 C88 15 90 14 92 14 C94 14 96 15 96 17 L96 18 C96 21 94 23 91 23 C88 23 86 21 86 18 C86 15 88 13 91 13 C94 13 96 15 96 18"
          className="letter"
          fill="url(#textGradient)"
          fillOpacity="0"
        />

        {/* Space (no path needed) */}

        {/* D */}
        <motion.path
          d="M106 5 L112 5 C116 5 120 9 120 13.5 C120 18 116 22 112 22 L106 22 Z M110 9 L110 18 L112 18 C114 18 116 16 116 13.5 C116 11 114 9 112 9 Z"
          className="letter-path"
          stroke="url(#textGradient)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="url(#textGradient)"
          fillOpacity="0"
          initial={{ pathLength: 0, opacity: 0 }}
        />
        <motion.path
          d="M106 5 L112 5 C116 5 120 9 120 13.5 C120 18 116 22 112 22 L106 22 Z M110 9 L110 18 L112 18 C114 18 116 16 116 13.5 C116 11 114 9 112 9 Z"
          className="letter"
          fill="url(#textGradient)"
          fillOpacity="0"
        />

        {/* i */}
        <motion.path
          d="M124 9 A2 2 0 1 1 124 5 A2 2 0 1 1 124 9 Z M122 12 L126 12 L126 22 L122 22 Z"
          className="letter-path"
          stroke="url(#textGradient)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="url(#textGradient)"
          fillOpacity="0"
          initial={{ pathLength: 0, opacity: 0 }}
        />
        <motion.path
          d="M124 9 A2 2 0 1 1 124 5 A2 2 0 1 1 124 9 Z M122 12 L126 12 L126 22 L122 22 Z"
          className="letter"
          fill="url(#textGradient)"
          fillOpacity="0"
        />

        {/* g */}
        <motion.path
          d="M138 14 L138 22 L134 22 L134 14 C134 13 133 12 132 12 C131 12 130 13 130 14 L130 22 L126 22 L126 14 C126 11 128 8 132 8 C136 8 138 11 138 14 Z M134 24 C134 26 131 28 128 28 C125 28 122 26 122 24 L126 24 C126 25 127 26 128 26 C129 26 130 25 130 24 Z"
          className="letter-path"
          stroke="url(#textGradient)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="url(#textGradient)"
          fillOpacity="0"
          initial={{ pathLength: 0, opacity: 0 }}
        />
        <motion.path
          d="M138 14 L138 22 L134 22 L134 14 C134 13 133 12 132 12 C131 12 130 13 130 14 L130 22 L126 22 L126 14 C126 11 128 8 132 8 C136 8 138 11 138 14 Z M134 24 C134 26 131 28 128 28 C125 28 122 26 122 24 L126 24 C126 25 127 26 128 26 C129 26 130 25 130 24 Z"
          className="letter"
          fill="url(#textGradient)"
          fillOpacity="0"
        />

        {/* i */}
        <motion.path
          d="M144 9 A2 2 0 1 1 144 5 A2 2 0 1 1 144 9 Z M142 12 L146 12 L146 22 L142 22 Z"
          className="letter-path"
          stroke="url(#textGradient)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="url(#textGradient)"
          fillOpacity="0"
          initial={{ pathLength: 0, opacity: 0 }}
        />
        <motion.path
          d="M144 9 A2 2 0 1 1 144 5 A2 2 0 1 1 144 9 Z M142 12 L146 12 L146 22 L142 22 Z"
          className="letter"
          fill="url(#textGradient)"
          fillOpacity="0"
        />

        {/* t */}
        <motion.path
          d="M148 8 L152 8 L152 12 L156 12 L156 16 L152 16 L152 19 C152 20 153 20 154 20 L156 20 L156 23 C155 24 151 24 150 23 C149 22 148 21 148 19 L148 16 L146 16 L146 12 L148 12 Z"
          className="letter-path"
          stroke="url(#textGradient)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="url(#textGradient)"
          fillOpacity="0"
          initial={{ pathLength: 0, opacity: 0 }}
        />
        <motion.path
          d="M148 8 L152 8 L152 12 L156 12 L156 16 L152 16 L152 19 C152 20 153 20 154 20 L156 20 L156 23 C155 24 151 24 150 23 C149 22 148 21 148 19 L148 16 L146 16 L146 12 L148 12 Z"
          className="letter"
          fill="url(#textGradient)"
          fillOpacity="0"
        />

        {/* a */}
        <motion.path
          d="M158 18 C158 15 160 13 163 13 C166 13 168 15 168 18 L168 22 L164 22 L164 20 C163 22 161 23 159 22 C157 21 156 19 157 17 C158 15 160 14 162 14 C163 14 164 15 164 16 C164 14 162 13 160 14 C158 15 158 17 160 18 C162 19 166 18 166 16"
          className="letter-path"
          stroke="url(#textGradient)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="url(#textGradient)"
          fillOpacity="0"
          initial={{ pathLength: 0, opacity: 0 }}
        />
        <motion.path
          d="M158 18 C158 15 160 13 163 13 C166 13 168 15 168 18 L168 22 L164 22 L164 20 C163 22 161 23 159 22 C157 21 156 19 157 17 C158 15 160 14 162 14 C163 14 164 15 164 16 C164 14 162 13 160 14 C158 15 158 17 160 18 C162 19 166 18 166 16"
          className="letter"
          fill="url(#textGradient)"
          fillOpacity="0"
        />

        {/* l */}
        <motion.path
          d="M170 5 L174 5 L174 22 L170 22 Z"
          className="letter-path"
          stroke="url(#textGradient)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="url(#textGradient)"
          fillOpacity="0"
          initial={{ pathLength: 0, opacity: 0 }}
        />
        <motion.path
          d="M170 5 L174 5 L174 22 L170 22 Z"
          className="letter"
          fill="url(#textGradient)"
          fillOpacity="0"
        />
      </svg>
    </motion.div>
  );
};
