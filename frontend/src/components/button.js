"use client";
import React, { useState, useEffect, useCallback } from "react";
import PropTypes from 'prop-types';

const Button = React.memo(({
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

    onPress();

    setIsActive(prevActive => {
      if (text === "Start" || text === "Ready") {
        return true;
      } else if (text === "Stop") {
        return false;
      }
      return prevActive;
    });
  }, [text, addingData, onPress]);

  return (
    <button
      type="button"
      className={`text-white ${color} rounded-lg h-14 m-4 py-2 px-4 transition-shadow duration-300 ${
        isHighlighted ? 'shadow-lg' : ''
      } ${isActive ? 'border-4 border-black' : ''}`}
      onClick={handlePress}
      onMouseEnter={() => setIsHighlighted(true)}
      onMouseLeave={() => setIsHighlighted(false)}
      aria-pressed={isActive}
    >
      {text}
    </button>
  );
});

Button.propTypes = {
  text: PropTypes.string,
  color: PropTypes.string,
  onPress: PropTypes.func,
  data: PropTypes.any,
  addingData: PropTypes.bool,
  reset: PropTypes.bool,
};

Button.displayName = 'Button';

export default Button;