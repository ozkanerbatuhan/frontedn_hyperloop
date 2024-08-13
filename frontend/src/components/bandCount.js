"use client"

import React from 'react';

const BandCount = ({ passedBandCount, timeStep, position }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Band Count</h2>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Passed Bands:</span>
          <span className="text-2xl font-bold text-blue-600">{passedBandCount}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Time Step:</span>
          <span className="text-xl font-semibold text-green-600">{timeStep}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Position:</span>
          <span className="text-xl font-semibold text-purple-600">{position} m</span>
        </div>
      </div>
    </div>
  );
};

export default BandCount;