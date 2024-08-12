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
    isActive = false,
    group = null,
  }) => {
    const [isHighlighted, setIsHighlighted] = useState(false);
    const [localIsActive, setLocalIsActive] = useState(isActive);

    useEffect(() => {
      if (reset) {
        setLocalIsActive(false);
      }
    }, [reset]);

    useEffect(() => {
      setLocalIsActive(isActive);
    }, [isActive]);

    const handlePress = useCallback(() => {
      if (text === "Start" && !addingData) {
        alert("Önce Ready butonunu etkinleştirmelisiniz!");
        return;
      }

      onPress();

      if (group === "brake") {
        setLocalIsActive(true);
      } else {
        setLocalIsActive((prevActive) => {
          if (text === "Start" || text === "Ready") {
            return true;
          } else if (text === "Stop") {
            return false;
          }
          return !prevActive;
        });
      }
    }, [text, addingData, onPress, group]);

    return (
      <button
        type="button"
        className={`text-white ${color} rounded-lg h-10 m-1 py-1 px-4 text-sm transition-all duration-300 ${
          isHighlighted ? "shadow-lg" : ""
        } ${localIsActive ? "border-2 border-black" : ""} hover:opacity-80`}
        onClick={handlePress}
        onMouseEnter={() => setIsHighlighted(true)}
        onMouseLeave={() => setIsHighlighted(false)}
        aria-pressed={localIsActive}
      >
        {text}
      </button>
    );
  }
);

Button.propTypes = {
  text: PropTypes.string,
  color: PropTypes.string,
  onPress: PropTypes.func,
  data: PropTypes.any,
  addingData: PropTypes.bool,
  reset: PropTypes.bool,
  isActive: PropTypes.bool,
  group: PropTypes.string,
};

export default Button;
