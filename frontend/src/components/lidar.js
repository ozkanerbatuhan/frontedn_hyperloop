import React from 'react';

const Lidar = ({ lidarData }) => {
  const isDataAvailable = lidarData !== null && lidarData !== undefined;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Lidar Data</h2>
      {!isDataAvailable ? (
        <div className="text-2xl font-bold text-black">No Data Available</div>
      ) : (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Distance:</span>
            <span className="text-2xl font-bold text-red-600 animate-pulse">
              {(Math.round(lidarData.dis) / 100).toFixed(2)} m
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Strength:</span>
            <span className="text-xl font-semibold text-orange-600">{lidarData.strength}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Time:</span>
            <span className="text-xl font-semibold text-indigo-600">{Math.round((lidarData.time))} ms</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Lidar;