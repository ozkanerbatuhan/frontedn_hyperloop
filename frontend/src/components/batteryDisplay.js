import React from 'react';

const BatteryDisplay = ({ batteryData }) => {
  const batteries = Object.keys(batteryData);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {batteries.map((battery) => (
        <div key={battery} className="bg-gray-100 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">{battery}</h3>
          <div className="flex justify-between items-center">
            <div className="text-left">
              <p className="text-sm text-gray-600">Voltage</p>
              <p className="text-xl font-bold">{parseFloat(batteryData[battery].voltage).toFixed(2)} V</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Current</p>
              <p className="text-xl font-bold">{parseFloat(batteryData[battery].current).toFixed(2)} A</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BatteryDisplay;