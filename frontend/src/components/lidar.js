"use client"
import React from 'react';

const Lidar = ({ lidarData }) => {
  const isDataAvailable = lidarData !== null && lidarData !== undefined;

  return (
    <div className="flex flex-col items-center">
      {!isDataAvailable && (<div className="text-2xl font-bold text-black">
        {isDataAvailable ? lidarData : "40<"}
      </div>)}
      {isDataAvailable && (
        <div className="text-red-500 font-bold animate-pulse">
          LAST {lidarData} METER
        </div>
      )}
    </div>
  );
};

export default Lidar;