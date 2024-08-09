"use client";
import { useState, useEffect } from "react";
const CirclesProgressBar = ({percent=10, text="test"}) => {
  return (
    <div class="relative size-40 mx-16 mb-16">
      <svg
        class="size-full"
        width="36"
        height="36"
        viewBox="0 0 36 36"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="18"
          cy="18"
          r="16"
          fill="none"
          class="stroke-current text-gray-200 dark:text-gray-700"
          stroke-width="2"
        ></circle>
        <g class="origin-center -rotate-90 transform">
          <circle
            cx="18"
            cy="18"
            r="16"
            fill="none"
            class="stroke-current text-blue-600 dark:text-blue-500"
            stroke-width="2"
            stroke-dasharray="100"
            stroke-dashoffset={(100-percent).toString()}
          ></circle>
        </g>
      </svg>
      <div class="absolute top-1/2 start-1/2 transform -translate-y-1/2 -translate-x-1/2">
        <span class="text-center text-2xl font-bold text-black">
          {text}: {percent}%
        </span>
      </div>
    </div>
  );
};

export default CirclesProgressBar;

