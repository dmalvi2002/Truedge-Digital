"use client";
import React, { useEffect, useState, useRef } from "react";

const TypingAnimation = ({
  text = "This text keeps typing itself forever with a two-layer effect...",
  typingSpeed = 100,
  pauseBeforeRestart = 500,
  fadedOpacity = 0.1,
  typingFadeEffect = 0.3, // Opacity of already typed text (higher = less faded)
  fadeDelay = 650, // Delay in ms before characters start fading
}) => {
  const [activeText, setActiveText] = useState("");
  const [fadedText, setFadedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [charOpacities, setCharOpacities] = useState<number[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef(null);

  // Handle typing animation
  useEffect(() => {
    let timer;

    if (currentIndex < text.length) {
      // Still typing the current sentence
      timer = setTimeout(() => {
        const newText = text.substring(0, currentIndex + 1);
        setActiveText(newText);

        // Set opacity for all characters - full opacity for the newest character
        const newOpacities = Array(newText.length).fill(typingFadeEffect);
        newOpacities[newText.length - 1] = 1; // Current character is fully visible
        setCharOpacities(newOpacities);

        setCurrentIndex(currentIndex + 1);
      }, typingSpeed);
    } else {
      // Finished typing, pause then restart
      timer = setTimeout(() => {
        setFadedText(activeText); // Move current text to faded layer
        setActiveText(""); // Clear active layer
        setCharOpacities([]); // Reset opacities
        setCurrentIndex(0); // Reset index for new typing
      }, pauseBeforeRestart);
    }

    timerRef.current = timer;
    return () => clearTimeout(timer);
  }, [currentIndex, text, typingSpeed, pauseBeforeRestart, typingFadeEffect]);

  // Gradually fade characters after they've been typed
  useEffect(() => {
    if (activeText.length <= 1) return; // Nothing to fade yet

    const fadeTimer = setTimeout(() => {
      setCharOpacities((prevOpacities) => {
        // Create a new array to avoid mutating the state directly
        const newOpacities = [...prevOpacities];

        // Apply fading to all characters except the last one (which was just typed)
        for (let i = 0; i < newOpacities.length - 1; i++) {
          // Ensure opacity doesn't go below the typingFadeEffect value
          newOpacities[i] = Math.max(typingFadeEffect, prevOpacities[i] * 0.98);
        }

        return newOpacities;
      });
    }, fadeDelay);

    return () => clearTimeout(fadeTimer);
  }, [activeText, charOpacities, fadeDelay, typingFadeEffect]);

  // Render active text with character-by-character opacity
  const renderActiveTextWithFading = () => {
    if (activeText.length === 0) return null;

    return activeText.split("").map((char, index) => (
      <span
        key={`${index}-${char}`}
        style={{
          opacity: charOpacities[index] || 1,
          transition: `opacity ${fadeDelay}ms ease-out`,
        }}
      >
        {char}
      </span>
    ));
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-full overflow-hidden p-4 md:p-6 bg-transparent text-white"
      style={{
        minHeight: "8rem",
        height: "auto",
      }}
    >
      {/* Container for text content with responsive font sizing */}
      <div className="w-full relative">
        {/* Faded background layer */}
        <div
          className="absolute top-0 left-0 w-full break-words"
          style={{
            opacity: fadedOpacity,
            fontSize: "clamp(1.26rem, 5.1vw, 2.6rem)",
            lineHeight: "1.3",
            fontWeight: "800",
          }}
        >
          {fadedText}
        </div>

        {/* Active typing layer */}
        <div
          className="absolute top-0 left-0 w-full break-words"
          style={{
            fontSize: "clamp(1.26rem, 5.1vw, 2.6rem)",
            lineHeight: "1.3",
            fontWeight: "800",
          }}
        >
          {renderActiveTextWithFading()}
          <span
            className="inline-block bg-white ml-1 animate-pulse"
            style={{
              width: "0.125rem",
              height: "clamp(1rem, 4vw, 1.75rem)",
              marginBottom: "-0.1em",
            }}
          ></span>
        </div>

        {/* Invisible text to ensure proper height calculation */}
        <div
          className="invisible w-full break-words"
          style={{
            fontSize: "clamp(1.25rem, 5vw, 2.5rem)",
            lineHeight: "1.3",
            fontWeight: "800",
          }}
        >
          {text}
        </div>
      </div>
    </div>
  );
};

export default TypingAnimation;
