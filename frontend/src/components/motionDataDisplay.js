import React from 'react';

const MotionDataDisplay = ({ motion }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Motion Data</h2>
      {motion ? (
        <div className="space-y-4">
          <div className="flex justify-between space-x-8">
            <div>
              <h3 className="text-lg font-semibold text-black">Acceleration</h3>
              <p className="text-sm text-gray-900">X: {motion.acceleration.x.toFixed(3)}</p>
              <p className="text-sm text-gray-900">Y: {motion.acceleration.y.toFixed(3)}</p>
              <p className="text-sm text-gray-900">Z: {motion.acceleration.z.toFixed(3)}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-black">Velocity</h3>
              <p className="text-sm text-gray-900">X: {motion.velocity.x.toFixed(3)}</p>
              <p className="text-sm text-gray-900">Y: {motion.velocity.y.toFixed(3)}</p>
              <p className="text-sm text-gray-900">Z: {motion.velocity.z.toFixed(3)}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-black">Position</h3>
              <p className="text-sm text-gray-900">X: {motion.position.x.toFixed(3)}</p>
              <p className="text-sm text-gray-900">Y: {motion.position.y.toFixed(3)}</p>
              <p className="text-sm text-gray-900">Z: {motion.position.z.toFixed(3)}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-black">Orientation</h3>
              <p className="text-sm text-gray-900">Pitch: {motion.orientation.pitch.toFixed(3)}</p>
              <p className="text-sm text-gray-900">Yaw: {motion.orientation.yaw.toFixed(3)}</p>
              <p className="text-sm text-gray-900">Roll: {motion.orientation.roll.toFixed(3)}</p>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-gray-500 italic">No Data</p>
      )}
    </div>
  );
};

export default MotionDataDisplay;
