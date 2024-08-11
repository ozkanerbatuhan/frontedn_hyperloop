import React, { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Graphics = ({ motion }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (motion) {
      setData(prevData => {
        const newData = [...prevData, {
          time: new Date().getTime(),
          ...motion.acceleration,
          ...motion.velocity,
          ...motion.position,
          ...motion.orientation
        }];
        return newData; // Son 100 veriyi tut
      });
    }
  }, [motion]);

  const chartConfig = useMemo(() => [
    { title: "Acceleration", dataKeys: { x: "x", y: "y", z: "z" } },
    { title: "Velocity", dataKeys: { x: "x", y: "y", z: "z" } },
    { title: "Position", dataKeys: { x: "x", y: "y", z: "z" } },
    { title: "Orientation", dataKeys: { pitch: "pitch", yaw: "yaw", roll: "roll" } }
  ], []);

  const colors = useMemo(() => ({
    x: "#FF6384", y: "#36A2EB", z: "#FFCE56",
    pitch: "#4BC0C0", yaw: "#9966FF", roll: "#FF9F40"
  }), []);

  const renderChart = (config) => (
    <div key={config.title} className="bg-white p-4 rounded-lg shadow-lg mb-6">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">{config.title}</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
            <XAxis 
              dataKey="time" 
              type="number" 
              domain={['auto', 'auto']} 
              tickFormatter={(unixTime) => new Date(unixTime).toLocaleTimeString()} 
              stroke="#718096"
            />
            <YAxis stroke="#718096" />
            <Tooltip 
              labelFormatter={(label) => new Date(label).toLocaleTimeString()} 
              contentStyle={{ backgroundColor: '#F7FAFC', border: '1px solid #E2E8F0' }}
            />
            <Legend />
            {Object.entries(config.dataKeys).map(([key, value]) => (
              <Line 
                key={key} 
                type="monotone" 
                dataKey={value} 
                stroke={colors[key]} 
                dot={false} 
                strokeWidth={2}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {chartConfig.map(renderChart)}
    </div>
  );
};

export default Graphics;