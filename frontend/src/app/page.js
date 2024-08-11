"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { socket } from "@/socket";
import CirclesProgressBar from "@/components/circlesProgressBar";
import LineProgressBar from "@/components/lineProgressBar";
import Button from "@/components/button";
import Speedometer from "@/components/speedometer";
import BatteryLevel from "@/components/batteryLevel";
import MotionDataDisplay from "@/components/motionDataDisplay";
import Train3D from "@/components/train3D";

export default function Home() {
  const [state, setState] = useState({
    isReady: false,
    isStart: false,
    isStop: false,
    isBrake: false,
    isEmergency: false,
    reset: false,
    motion: null,
    ambientTemperature: 22,
    batteryTemperature: 69,
    averageTemperature: 40,
    speed: 65,
    progress: 20,
    percent: 85,
    bandCount: 0,
    batteryLevels: {
      battery1: 85,
      battery2: 70,
      battery3: 60,
      battery4: 45,
    },
  });

  useEffect(() => {
    socket.connect();

    const onConnect = () => {
      socket.emit("dashboard", socket.id);
      console.log("connected", socket.id);
    };

    const onMotionUpdate = (data) => {
      setState((prevState) => ({ ...prevState, motion: data }));
    };

    const onTemperatureUpdate = (temps) => {
      setState((prevState) => ({
        ...prevState,
        ambientTemperature: temps.tempAmbient.toFixed(1),
        batteryTemperature: temps.tempBattery.toFixed(1),
        averageTemperature: (
          (parseFloat(temps.tempAmbient) + parseFloat(temps.tempBattery)) /
          2
        ).toFixed(1),
      }));
    };

    const onSpeedUpdate = (speed) => {
      setState((prevState) => ({ ...prevState, speed }));
    };

    const onProgressUpdate = (progress) => {
      setState((prevState) => ({
        ...prevState,
        progress: progress.toFixed(1),
      }));
    };

    const onBand = (data) => {
      setState((prevState) => ({ ...prevState, bandCount: data }));
    };

    socket.on("connect", onConnect);
    socket.on("motionUpdate", onMotionUpdate);
    socket.on("temperatureUpdate", onTemperatureUpdate);
    socket.on("speedUpdate", onSpeedUpdate);
    socket.on("progressUpdate", onProgressUpdate);
    socket.on("band", onBand);

    return () => {
      socket.off("connect", onConnect);
      socket.off("motionUpdate", onMotionUpdate);
      socket.off("temperatureUpdate", onTemperatureUpdate);
      socket.off("speedUpdate", onSpeedUpdate);
      socket.off("progressUpdate", onProgressUpdate);
      socket.off("band", onBand);
      socket.disconnect();
    };
  }, []);

  const resetAll = useCallback(() => {
    setState((prevState) => ({
      ...prevState,
      isReady: false,
      isStart: false,
      isStop: false,
      isBrakeOpen: false,
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
      { text: "Brake Open", color: "bg-purple-700", type: "isBrakeOpen" },
      { text: "Brake Closed", color: "bg-purple-700", type: "isBrakeClosed" },
      { text: "Emergency", color: "bg-yellow-500", type: "isEmergency" },
    ],
    []
  );

  return (
    <div className="container mx-auto px-2 py-4">
      <h1 className="text-2xl font-bold mb-4">Hyperloop Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
          <h2 className="text-xl font-semibold mb-2">Batteries</h2>
          <div className="grid grid-cols-2 gap-4">
            <BatteryLevel
              percent={state.batteryLevels.battery1}
              label="Elektronik Bataryası"
            />
            <BatteryLevel
              percent={state.batteryLevels.battery2}
              label="İtki Bataryası"
            />
            <BatteryLevel
              percent={state.batteryLevels.battery3}
              label="Motor Sürücü Bataryası"
            />
            <BatteryLevel
              percent={state.batteryLevels.battery4}
              label="Levitasyon Bataryası"
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
          <LineProgressBar progressData={state.progress} />
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Band Count</h2>
          <p className="text-8xl text-gray-900 ">{state.bandCount}</p>
        </div>
        <div>
          <MotionDataDisplay motion={state.motion} />
        </div>
      </div>

      {/* 3D Tren Animasyonu */}
      <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-3xl mx-auto">
        <h2 className="text-xl font-semibold mb-2">3D Train Animation</h2>
        <Train3D motion={state.motion} />
      </div>
    </div>
  );
}
