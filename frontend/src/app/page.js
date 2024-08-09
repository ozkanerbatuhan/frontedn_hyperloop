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
    ambientTemperature: 0,
    batteryTemperature: 0,
    averageTemperature: 0,
    speed: 100,
    progress: 0,
  });

  useEffect(() => {
    socket.connect();

    const onConnect = () => {
      socket.emit("dashboard", socket.id);
      console.log("connected", socket.id);
    };

    const onMotionUpdate = (data) => {
      setState((prevState) => ({ ...prevState, motion: data }));
      console.log("motionUpdate", data);
    };

    const onTemperatureUpdate = (temps) => {
      setState((prevState) => ({
        ...prevState,
        ambientTemperature: temps.ambient,
        batteryTemperature: temps.battery,
        averageTemperature: temps.average,
      }));
    };

    const onSpeedUpdate = (speed) => {
      setState((prevState) => ({ ...prevState, speed }));
    };

    const onProgressUpdate = (progress) => {
      setState((prevState) => ({ ...prevState, progress }));
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
    setState((prevState) => ({
      ...prevState,
      isReady: false,
      isStart: false,
      isStop: false,
      reset: true,
    }));
    setTimeout(
      () => setState((prevState) => ({ ...prevState, reset: false })),
      0
    );
  }, []);

  const handleButtonPress = useCallback(
    (buttonType) => {
      setState((prevState) => {
        const newState = { ...prevState, [buttonType]: !prevState[buttonType] };
        socket.emit(buttonType, newState[buttonType]);

        if (buttonType === "isStop") {
          resetAll();
        }

        return newState;
      });
    },
    [resetAll]
  );

  const buttons = useMemo(
    () => [
      { text: "Ready", color: "bg-blue-500", type: "isReady" },
      { text: "Start", color: "bg-green-700", type: "isStart" },
      { text: "Stop", color: "bg-red-700", type: "isStop" },
      { text: "Brake Calibration", color: "bg-purple-700", type: "isBrake" },
      { text: "Emergency", color: "bg-yellow-500", type: "isEmergency" },
    ],
    []
  );

  // ... diğer importlar ve state yönetimi aynı kalacak

  return (
    <div className="container mx-auto px-2 py-4">
      <h1 className="text-2xl font-bold mb-4">Hyperloop Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Temperatures</h2>
          <div className="flex justify-between space-x-4">
            <CirclesProgressBar
              temperature={state.ambientTemperature}
              text="Ambient"
            />
            <CirclesProgressBar
              temperature={state.batteryTemperature}
              text="Battery"
            />
            <CirclesProgressBar
              temperature={state.averageTemperature}
              text="Average"
            />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Speed</h2>
          <Speedometer speed={state.speed} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Progress</h2>
          <LineProgressBar percent={state.progress} />
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Controls</h2>
          <div className="flex flex-wrap justify-center gap-2">
            {buttons.map((button) => (
              <Button
                key={button.type}
                text={button.text}
                color={button.color}
                onPress={() => handleButtonPress(button.type)}
                data={state[button.type]}
                addingData={button.type === "isStart" ? state.isReady : true}
                reset={state.reset}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-2">Motion Data</h2>
        {state.motion ? (
          <pre className="bg-gray-100 p-2 rounded overflow-auto text-sm">
            {JSON.stringify(state.motion, null, 2)}
          </pre>
        ) : (
          <p className="text-gray-500 italic">No Data</p>
        )}
      </div>
    </div>
  );
}
