"use client";
import React from "react";
import PropTypes from 'prop-types';

const CirclesProgressBar = React.memo(({ temperature = 100, text = "test" }) => {
  return (
    <div className="flex flex-col items-center">
      <div 
        className="h-24 w-8 overflow-hidden rounded-full bg-green-200"
        role="progressbar"
        aria-valuenow={temperature}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-label={`${text} temperature`}
      >
        <div
          className="h-full bg-gradient-to-t from-green-200 via-red-400 to-red-600 transition-all duration-300 ease-in-out"
          style={{height: `${temperature}%`}}
        ></div>
      </div>
      <span className="mt-1 text-lg text-gray-600">{temperature}°</span>
      <span className="text-x text-black">{text}</span>
    </div>
  );
});

CirclesProgressBar.propTypes = {
  temperature: PropTypes.number,
  text: PropTypes.string
};

CirclesProgressBar.displayName = 'CirclesProgressBar';

export default CirclesProgressBar;