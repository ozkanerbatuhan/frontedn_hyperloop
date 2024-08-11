"use client";
import { useState, useEffect } from "react";
import { socket } from "@/socket";
import Graphics from "@/components/graphics";

// Global veri deposu
let globalData = [];
let isDataFlowing = false;

export default function Home() {
  const [state, setState] = useState({
    motion: null,
    speed: 65,
    ambientTemperature: null,
    batteryTemperature: null,
    averageTemperature: null,
  });

  const [dataFlowState, setDataFlowState] = useState(false);

  useEffect(() => {
    const handleConnect = () => {
      socket.emit("dashboard", socket.id);
      console.log("connected", socket.id);
      isDataFlowing = true;
      setDataFlowState(true);
      // Bağlantı yeniden kurulduğunda veriyi sıfırla
      globalData = [];
    };

    const handleMotionUpdate = (data) => {
      setState((prevState) => ({ ...prevState, motion: data }));
      if (isDataFlowing) {
        globalData.push({
          time: new Date().getTime(),
          ...data.acceleration,
          ...data.velocity,
          ...data.position,
          ...data.orientation
        });
        
      }
    };

    const handleDisconnect = () => {
      isDataFlowing = false;
      setDataFlowState(false);
    };

    socket.connect();
    socket.on("connect", handleConnect);
    socket.on("motionUpdate", handleMotionUpdate);
    socket.on("disconnect", handleDisconnect);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("motionUpdate", handleMotionUpdate);
      socket.off("disconnect", handleDisconnect);
      socket.disconnect();
    };
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-white">Graphics Dashboard</h1>
      <Graphics motion={state.motion} globalData={globalData} isDataFlowing={dataFlowState} />
    </div>
  );
}