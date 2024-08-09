"use client";
import React from "react";
import PropTypes from 'prop-types';

const LineProgressBar = React.memo(({ progressData = 60 }) => {
  return (
    <div className="w-full px-4">
      <div className="relative pt-1">
        <div className="flex mb-2 items-center justify-between">
          <div>
            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
              Progress
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold inline-block text-blue-600">
              {progressData}%
            </span>
          </div>
        </div>
        <div className="overflow-hidden h-4 mb-4 text-xs flex rounded bg-blue-200 relative">
          <div 
            style={{ width: `${progressData}%` }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-500 ease-out"
            role="progressbar"
            aria-valuenow={progressData}
            aria-valuemin="0"
            aria-valuemax="100"
            aria-label="Progress bar"
          ></div>
          <div 
            className="absolute top-0 left-0 h-full flex items-center transition-all duration-500 ease-out"
            style={{ left: `${progressData}%` }}
          >
            <svg className="w-4 h-4 text-blue-700" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5.41 5.41L10 0.83L14.59 5.41L20 0L20 9.17L14.59 14.59L10 19.17L5.41 14.59L0 20L0 10.83L5.41 5.41Z"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
});




export default LineProgressBar;