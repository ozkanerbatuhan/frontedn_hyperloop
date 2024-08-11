"use client";
import React from 'react';

const BatteryLevel = ({ percent, label }) => {
  const getBackgroundColor = () => {
    if (percent >= 75) return 'bg-green-400';
    if (percent >= 50) return 'bg-yellow-400';
    if (percent >= 25) return 'bg-orange-400';
    return 'bg-red-400';
  };

  return (
    <div className="w-full">
      <div className="text-sm text-gray-600 font-semibold mb-1">{label}</div>
      <div className="shadow w-full rounded border-2 border-gray-400 flex my-1 relative">
        <div className="border-r-4 h-4 rounded-r absolute flex border-gray-400 right-0 mt-1 z-10"></div>
        <div
          className={`cursor-default ${getBackgroundColor()} text-xs font-bold leading-none flex items-center justify-end pr-2 py-2 text-center text-white`}
          style={{ width: `${percent}%` }}
        >
          {`${percent}%`}
        </div>
      </div>
    </div>
  );
};

export default BatteryLevel;