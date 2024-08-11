"use client";
import { useState, useEffect } from "react";
import { socket } from "@/socket";
import Graphics from "@/components/graphics";

export default function Home() {
  const [state, setState] = useState({
    motion: null,
    speed: 65,
    ambientTemperature: null,
    batteryTemperature: null,
    averageTemperature: null,
  });

  useEffect(() => {
    const handleConnect = () => {
      socket.emit("dashboard", socket.id);
      console.log("connected", socket.id);
    };

    const handleMotionUpdate = (data) => {
      setState((prevState) => ({ ...prevState, motion: data }));
    };

    const handleTemperatureUpdate = (temps) => {
      setState((prevState) => ({
        ...prevState,
        ambientTemperature: temps.tempAmbient.toFixed(1),
        batteryTemperature: temps.tempBattery.toFixed(1),
        averageTemperature: ((parseFloat(temps.tempAmbient) + parseFloat(temps.tempBattery)) / 2).toFixed(1),
      }));
    };

    const handleSpeedUpdate = (speed) => {
      setState((prevState) => ({ ...prevState, speed }));
    };

    socket.connect();
    socket.on("connect", handleConnect);
    socket.on("motionUpdate", handleMotionUpdate);
    socket.on("temperatureUpdate", handleTemperatureUpdate);
    socket.on("speedUpdate", handleSpeedUpdate);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("motionUpdate", handleMotionUpdate);
      socket.off("temperatureUpdate", handleTemperatureUpdate);
      socket.off("speedUpdate", handleSpeedUpdate);
      socket.disconnect();
    };
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-white">Graphics Dashboard</h1>
      <Graphics motion={state.motion} />
    </div>
  );
}