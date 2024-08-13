"use client";
import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";

const Button = React.memo(
  ({
    text = "test",
    color = "blue",
    onPress = () => {},
    data,
    addingData = false,
    reset = false,
  }) => {
    const [isHighlighted, setIsHighlighted] = useState(false);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
      if (reset) {
        setIsActive(false);
      }
    }, [reset]);

    const handlePress = useCallback(() => {
      if (text === "Start" && !addingData) {
        alert("Önce Ready butonunu etkinleştirmelisiniz!");
        return;
      }

      // Send data to backend
      

      onPress();

      setIsActive((prevActive) => {
        if (text === "Start" || text === "Ready") {
          return true;
        } else if (text === "Stop") {
          return false;
        }
        return prevActive;
      });

      


    }, [text, addingData, onPress]);

    // ... diğer importlar ve component logic'i aynı kalacak

    return (
      <button
        type="button"
        className={`text-white ${color} rounded-lg h-10 m-1 py-1 px-2 text-sm transition-shadow duration-300 ${
          isHighlighted ? "shadow-lg" : ""
        } ${isActive ? "border-2 border-black" : ""}`}
        onClick={handlePress}
        onMouseEnter={() => setIsHighlighted(true)}
        onMouseLeave={() => setIsHighlighted(false)}
        aria-pressed={isActive}
      >
        {text}
      </button>
    );

    // ... geri kalan kod aynı kalacak
  }
);

Button.propTypes = {
  text: PropTypes.string,
  color: PropTypes.string,
  onPress: PropTypes.func,
  data: PropTypes.any,
  addingData: PropTypes.bool,
  reset: PropTypes.bool,
};

Button.displayName = "Button";

export default Button;
