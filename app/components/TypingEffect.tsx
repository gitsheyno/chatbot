"use client";
import React, { useState, useEffect } from "react";
import { text } from "stream/consumers";

interface TypingEffectProps {
  text: string;
  speed?: number; // Optional speed prop to control typing speed
}

const TypingEffect: React.FC<TypingEffectProps> = ({ text, speed = 50 }) => {
  console.log("effect", text);

  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentText("");
    setCurrentIndex(0);
  }, [text]);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setCurrentText((prevText) => prevText + text[currentIndex]);
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }, speed);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, speed, text]);

  return <div>{currentText}</div>;
};

export default TypingEffect;
