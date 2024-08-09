"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { socket } from "@/socket";
import CirclesProgressBar from "@/components/circlesProgressBar";
import LineProgressBar from "@/components/lineProgressBar";
import Button from "@/components/button";
import Speedometer from "@/components/speedometer";

export default function Home() {
  const [state, setState] = useState({
    isReady: false,
    isStart: false,
    isStop: false,
    isBrake: false,
    isEmergency: false,
    reset: false,
    motion: null,
    temperature: 0,
    speed: 0,
    progress: 0,
  });

  useEffect(() => {
    socket.connect();
    
    const onConnect = () => {
      socket.emit("dashboard", socket.id);
      console.log("connected", socket.id);
    };

    const onMotionUpdate = (data) => {
      setState(prevState => ({ ...prevState, motion: data }));
      console.log("motionUpdate", data);
    };

    const onTemperatureUpdate = (temp) => {
      setState(prevState => ({ ...prevState, temperature: temp }));
    };

    const onSpeedUpdate = (speed) => {
      setState(prevState => ({ ...prevState, speed }));
    };

    const onProgressUpdate = (progress) => {
      setState(prevState => ({ ...prevState, progress }));
    };

    socket.on("connect", onConnect);
    socket.on("motionUpdate", onMotionUpdate);
    socket.on("temperatureUpdate", onTemperatureUpdate);
    socket.on("speedUpdate", onSpeedUpdate);
    socket.on("progressUpdate", onProgressUpdate);

    return () => {
      socket.off("connect", onConnect);
      socket.off("motionUpdate", onMotionUpdate);
      socket.off("temperatureUpdate", onTemperatureUpdate);
      socket.off("speedUpdate", onSpeedUpdate);
      socket.off("progressUpdate", onProgressUpdate);
      socket.disconnect();
    };
  }, []);

  const resetAll = useCallback(() => {
    setState(prevState => ({
      ...prevState,
      isReady: false,
      isStart: false,
      isStop: false,
      reset: true,
    }));
    setTimeout(() => setState(prevState => ({ ...prevState, reset: false })), 0);
  }, []);

  const handleButtonPress = useCallback((buttonType) => {
    setState(prevState => {
      const newState = { ...prevState, [buttonType]: !prevState[buttonType] };
      socket.emit(buttonType, newState[buttonType]);
      
      if (buttonType === 'isStop') {
        resetAll();
      }
      
      return newState;
    });
  }, [resetAll]);

  const buttons = useMemo(() => [
    { text: "Ready", color: "bg-blue-500", type: "isReady" },
    { text: "Start", color: "bg-green-700", type: "isStart" },
    { text: "Stop", color: "bg-red-700", type: "isStop" },
    { text: "Brake Calibration", color: "bg-purple-700", type: "isBrake" },
    { text: "Emergency", color: "bg-yellow-500", type: "isEmergency" },
  ], []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Hyperloop Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Temperature</h2>
          <CirclesProgressBar temperature={state.temperature} text="Average Temperature" />
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Speed</h2>
          <Speedometer speed={state.speed} />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4">Progress</h2>
        <LineProgressBar percent={state.progress} />
      </div>

      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {buttons.map((button) => (
          <Button
            key={button.type}
            text={button.text}
            color={button.color}
            onPress={() => handleButtonPress(button.type)}
            data={state[button.type]}
            addingData={button.type === 'isStart' ? state.isReady : true}
            reset={state.reset}
          />
        ))}
      </div>

      {state.motion && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Motion Data</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(state.motion, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}