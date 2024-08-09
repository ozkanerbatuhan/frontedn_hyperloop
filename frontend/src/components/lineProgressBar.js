"use client";
import { useState, useEffect } from "react";

const LineProgressBar = ({percent=60}) => {
  return (
    <div class=" m-4 mb-16 w-full">
      <div class="m-12 bg-black rounded-full">
        <div class="relative h-5 w-full rounded-full ">
          <div class={`bg-blue-600 absolute top-0 left-0 h-full  rounded-full`} style={{ width: `${percent}%` }}>
            <span class="absolute -right-4 bottom-full mb-2 rounded-sm px-3.5 py-1 text-sm text-black bg-blue-400">
              <span class="absolute bottom-[-2px] left-1/2 -z-10 h-2 w-2 -translate-x-1/2 rotate-45 rounded-full"></span>
              Güncel ilerleyiş: {percent}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LineProgressBar;