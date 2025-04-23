import React, { useEffect, useState, useRef } from "react";

const TypingAnimation = ({
  text = "This text keeps typing itself forever with a two-layer effect...",
  typingSpeed = 100,
  pauseBeforeRestart = 500,
  fadedOpacity = 0.3,
  typingFadeEffect = 0.7, // Opacity of already typed text (higher = less faded)
  fadeDelay = 150, // Delay in ms before characters start fading
}) => {
  const [activeText, setActiveText] = useState("");
  const [fadedText, setFadedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [charOpacities, setCharOpacities] = useState<number[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

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
    <div className="text-4xl max-w-[540px] font-extrabold p-4 bg-transparent text-white h-24 relative overflow-hidden">
      {/* Faded background layer */}
      <div className="absolute top-4 left-4" style={{ opacity: fadedOpacity }}>
        {fadedText}
      </div>

      {/* Active typing layer */}
      <div className="absolute top-4 left-4">
        {renderActiveTextWithFading()}
        <span className="inline-block w-2 h-5 bg-white ml-1 animate-pulse"></span>
      </div>
    </div>
  );
};

export default TypingAnimation;
