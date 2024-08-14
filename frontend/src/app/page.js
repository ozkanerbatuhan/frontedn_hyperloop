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
import BandCount from "@/components/bandCount";

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
  const [isReceivingData, setIsReceivingData] = useState(false);
  const [ping, setPing] = useState(0);

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

  useEffect(() => {
    let dataTimeout;

    const resetDataTimeout = () => {
      if (dataTimeout) {
        clearTimeout(dataTimeout);
      }
      dataTimeout = setTimeout(() => {
        setIsReceivingData(false);
      }, 2000); // 2 saniye boyunca veri alınmazsa disconnected yazısı görünür
    };

    socket.connect();

    const onConnect = () => {
      socket.emit("dashboard", socket.id);
      setIsConnect(true);
      resetDataTimeout();
    };

    const onLidarUpdate = (data) => {
      setLidarData(data);
      setIsReceivingData(true);
      resetDataTimeout();
    };

    const onPositionUpdate = (data) => {
      setPositionData(data);
      setIsReceivingData(true);
      resetDataTimeout();
    };

    const onMotionUpdate = (data) => {
      setState((prevState) => ({ ...prevState, motion: data }));
      setIsReceivingData(true);
      resetDataTimeout();
    };

    const onTemperatureUpdate = (temps) => {
      setState((prevState) => {
        const ambientTemp = temps.tempAmbient
          ? temps.tempAmbient.toFixed(1)
          : 0;
        const batteryTemp = temps.tempBattery
          ? temps.tempBattery.toFixed(1)
          : 0;
        const averageTemp = (
          (parseFloat(ambientTemp) + parseFloat(batteryTemp)) /
          2
        ).toFixed(1);

        return {
          ...prevState,
          ambientTemperature: ambientTemp,
          batteryTemperature: batteryTemp,
          averageTemperature: averageTemp,
        };
      });
      setIsReceivingData(true);
      resetDataTimeout();
    };

    const onSpeedUpdate = (speed) => {
      setState((prevState) => ({ ...prevState, speed: speed.speed * 3.6 }));
      setIsReceivingData(true);
      resetDataTimeout();
    };

    const onProgressUpdate = (progress) => {
      setState((prevState) => ({
        ...prevState,
        progress: progress.toFixed(1),
      }));
      setIsReceivingData(true);
      resetDataTimeout();
    };

    socket.on("connect", onConnect);
    socket.on("motionUpdate", onMotionUpdate);
    socket.on("temperatureUpdate", onTemperatureUpdate);
    socket.on("speedUpdate", onSpeedUpdate);
    socket.on("progressUpdate", onProgressUpdate);
    socket.on("lidarUpdate", onLidarUpdate);
    socket.on("positionUpdate", onPositionUpdate);
    socket.on("ping", (ping) => {
      setPing(ping);
      resetDataTimeout();
    });

    return () => {
      socket.off("connect", onConnect);
      socket.off("motionUpdate", onMotionUpdate);
      socket.off("temperatureUpdate", onTemperatureUpdate);
      socket.off("speedUpdate", onSpeedUpdate);
      socket.off("progressUpdate", onProgressUpdate);
      socket.off("lidarUpdate", onLidarUpdate);
      socket.off("positionUpdate", onPositionUpdate);
      clearTimeout(dataTimeout);
      socket.disconnect();
      setIsConnect(false);
      setIsReceivingData(false);
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

        switch (buttonType) {
          case "isReady":
            socket.emit("ready", newState.isReady);
            break;
          case "isStart":
            socket.emit("start", newState.isStart);
            break;
          case "isStop":
            socket.emit("stop", newState.isStop);
            if (newState.isStop) {
              resetAll();
            }
            break;
          case "isBrake":
            socket.emit("break_event", newState.isBrake);
            break;
          case "isBrakeOpen":
            socket.emit("break_open", newState.isBrakeOpen);
            break;
          case "isBrakeClosed":
            socket.emit("break_close", newState.isBrakeClosed);
            break;
          case "isEmergency":
            socket.emit("emergency", newState.isEmergency); // If you have an "emergen  cy" event
            break;
          default:
            break;
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
      {
        text: "Stop",
        color: "bg-red-700",
        type: "isStop",
        group: "control",
      },
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
        {isConnect && isReceivingData ? (
          <span className="text-green-500">Connected </span>
        ) : (
          <span className="text-red-500">Disconnected</span>
        )}
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
          <h2 className="text-xl font-semibold mb-2">
            Speed TimeStep: {positionData.timeStep}
          </h2>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <BandCount
              passedBandCount={positionData.passedBandCount}
              timeStep={positionData.timeStep}
              position={positionData.position}
            />
            <Lidar lidarData={lidarData} />
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
