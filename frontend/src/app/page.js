"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import io from "socket.io-client";
import { socket } from "@/socket";
import appConfig from "../../config";
import CirclesProgressBar from "@/components/circlesProgressBar";
import LineProgressBar from "@/components/lineProgressBar";
import Button from "@/components/button";
import Speedometer from "@/components/speedometer";

export default function Home() {
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    socket.connect();
    socket.on("connect", () => {
      console.log("connected", socket);
    });
    socket.on("connected", (data) => {
      socket.emit("dashboard", data);
    });
  }, []);

  return (
    <main>
      <div class="w-full h-screen bg-white">
        <div>
          {/*top container*/}
          <div class="">
            {/* video */}
            <Image src="" alt="logo" width={100} height={100} />
          </div>

          <div class="flex flex-row content-center justify-center ">
            {/* circle-prgogress */}
            <CirclesProgressBar text="Levitasyon Sıcaklığı" />
            <CirclesProgressBar text="İtki Sıcaklığı" />
            <CirclesProgressBar text="Ortam Sıcaklığı" />
          </div>
        </div>
        <div class="flex flex-row">
          <div class="flex flex-row content-center justify-center">
            {/*buttons*/}
            <Button
              text="Ready"
              color="bg-blue-500"
              onPress={() => {
                setIsReady(!isReady);
                socket.emit("ready", isReady);
              }}
              isReady={isReady}
            />
            <Button text="Start" color="bg-green-700" />
            <Button text="Stop" color="bg-red-700" />
            <Button text="Brake Calibration" color="bg-purple-700" />
            <Button text="Emergency" color="bg-yellow-500" />
          </div>

          {/* bottom container */}
          <div class="w-screen content-center">
            {/* line progress */}
            <LineProgressBar />
          </div>
        </div>
        <Speedometer />
      </div>
    </main>
  );
}
