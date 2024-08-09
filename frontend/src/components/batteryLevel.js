"use client";
import React from 'react';

const BatteryLevel = ({ percent }) => {
  const getBackgroundColor = () => {
    if (percent >= 75) return 'bg-green-400';
    if (percent >= 50) return 'bg-yellow-400';
    if (percent >= 25) return 'bg-gray-400';
    return 'bg-red-400';
  };

  return (
    <div className="w-48">
      <div className="shadow w-1/2 rounded border-2 border-gray-400 flex my-1 relative">
        <div className="border-r-8 h-6 rounded-r absolute flex border-gray-400 ml-24 mt-2 z-10"></div>
        <div
          className={`cursor-default ${getBackgroundColor()} text-xs font-bold leading-none flex items-center justify-center m-1 py-4 text-center text-white`}
          style={{ width: `${percent}%` }}
        >
          <div className="absolute left-0 mx-8 text-gray-700">{`${percent}%`}</div>
        </div>
      </div>
    </div>
  );
};

export default BatteryLevel;
