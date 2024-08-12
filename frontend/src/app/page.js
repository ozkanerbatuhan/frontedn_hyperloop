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
import Lidar from "@/components/lidar";

export default function Home() {
  const [state, setState] = useState({
    isReady: false,
    isStart: false,
    isStop: false,
    isBrake: false,
    isBrakeOpen: false,
    isBrakeClosed: false,
    isEmergency: false,
    reset: false,
    motion: null,
    ambientTemperature: 0,
    batteryTemperature: 0,
    averageTemperature: 0,
    speed: 0,
    progress: 0,
    percent: 0,
    bandCount: 0,

    batteryLevels: {
      battery1: 100,
      battery2: 100,
      battery3: 100,
      battery4: 100,
    },
  });
  const [isConnect, setIsConnect] = useState(false);

  const [lidarData, setLidarData] = useState({
    dis: 0,
    strength: 0,
    temp: 0,
    time: 0,
  });

  const [positionData, setPositionData] = useState({
    passedBandCount: 0,
    position: 0,
    timeStep: 0,
  });

  console.log(positionData);

  useEffect(() => {
    socket.connect();

    const onConnect = () => {
      socket.emit("dashboard", socket.id);
      console.log("connected", socket.id);
      setIsConnect(true);
    };

    const onLidarUpdate = (data) => {
      setLidarData(data);
    };

    const onPositionUpdate = (data) => {
      console.log("onPositionUpdate", data);
      setPositionData(data);
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
          (parseFloat(temps.tempAmbient.toFixed(1)) +
            parseFloat(temps.tempBattery.toFixed(1))) /
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

    socket.on("connect", onConnect);
    socket.on("motionUpdate", onMotionUpdate);
    socket.on("temperatureUpdate", onTemperatureUpdate);
    socket.on("speedUpdate", onSpeedUpdate);
    socket.on("progressUpdate", onProgressUpdate);
    socket.on("lidarUpdate", onLidarUpdate);
    socket.on("positionUpdate", onPositionUpdate);

    return () => {
      socket.off("connect", onConnect);
      socket.off("motionUpdate", onMotionUpdate);
      socket.off("temperatureUpdate", onTemperatureUpdate);
      socket.off("speedUpdate", onSpeedUpdate);
      socket.off("progressUpdate", onProgressUpdate);
      socket.off("lidarUpdate", onLidarUpdate);
      socket.off("positionUpdate", onPositionUpdate);
      socket.disconnect();
      setIsConnect(false);
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

        if (buttonType === "isBrakeOpen" || buttonType === "isBrakeClosed") {
          newState.isBrakeOpen = buttonType === "isBrakeOpen";
          newState.isBrakeClosed = buttonType === "isBrakeClosed";
        }

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
      {
        text: "Ready",
        color: "bg-blue-500",
        type: "isReady",
        group: "control",
      },
      {
        text: "Start",
        color: "bg-green-700",
        type: "isStart",
        group: "control",
      },
      { text: "Stop", color: "bg-red-700", type: "isStop", group: "control" },
      {
        text: "Brake Calibration",
        color: "bg-purple-700",
        type: "isBrake",
        group: "brake",
      },
      {
        text: "Brake Open",
        color: "bg-purple-700",
        type: "isBrakeOpen",
        group: "brake",
      },
      {
        text: "Brake Closed",
        color: "bg-purple-700",
        type: "isBrakeClosed",
        group: "brake",
      },
      {
        text: "Emergency",
        color: "bg-yellow-500",
        type: "isEmergency",
        group: "emergency",
      },
    ],
    []
  );

  return (
    <div className="container mx-auto px-2 py-4">
      <p1 className="text-2xl font-bold mb-4">
        Hyperloop Dashboard{" "}
        {isConnect ? (
          <h1 className="text-2xl font-bold mb-4">Connected</h1>
        ) : null}
      </p1>

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
          <h2 className="text-xl font-semibold mb-2">Speed TimeStep: {positionData.timeStep}</h2>
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
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap justify-center gap-2">
              {buttons
                .filter((b) => b.group === "control")
                .map((button) => (
                  <Button
                    key={button.type}
                    text={button.text}
                    color={button.color}
                    onPress={() => handleButtonPress(button.type)}
                    data={state[button.type]}
                    addingData={
                      button.type === "isStart" ? state.isReady : true
                    }
                    reset={state.reset}
                    isActive={state[button.type]}
                    group={button.group}
                  />
                ))}
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {buttons
                .filter((b) => b.group === "brake")
                .map((button) => (
                  <Button
                    key={button.type}
                    text={button.text}
                    color={button.color}
                    onPress={() => handleButtonPress(button.type)}
                    data={state[button.type]}
                    addingData={true}
                    reset={state.reset}
                    isActive={state[button.type]}
                    group={button.group}
                  />
                ))}
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {buttons
                .filter((b) => b.group === "emergency")
                .map((button) => (
                  <Button
                    key={button.type}
                    text={button.text}
                    color={button.color}
                    onPress={() => handleButtonPress(button.type)}
                    data={state[button.type]}
                    addingData={true}
                    reset={state.reset}
                    isActive={state[button.type]}
                    group={button.group}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Band Count and Lidar</h2>
            <div className="flex justify-between items-center">
              <p className="text-xl text-gray-900">
                Passed Band: {positionData.passedBandCount} Timestep:{" "}
                {positionData.timeStep} Position: {positionData.position}
              </p>
              <Lidar lidarData={lidarData} />
            </div>
          </div>
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
