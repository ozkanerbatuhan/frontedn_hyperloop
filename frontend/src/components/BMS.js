"use client"

import React, { useState, useEffect } from 'react';

const VoltageDisplay = () => {
  const minVoltage = 14;
  const maxVoltage = 16;

  const [voltageData, setVoltageData] = useState({});

  useEffect(() => {
    const generateRandomVoltage = () => {
      return Number((Math.random() * (maxVoltage - minVoltage) + minVoltage).toFixed(2));
    };

    const generateVoltageData = () => {
      const newVoltageData = {
        wheelsMotorBattery1: {
          wire1: generateRandomVoltage(),
          wire2: generateRandomVoltage(),
          wire3: generateRandomVoltage(),
          wire4: generateRandomVoltage(),
          wire5: generateRandomVoltage(),
          wire6: generateRandomVoltage()
        },
        wheelsMotorBattery2: {
          wire1: generateRandomVoltage(),
          wire2: generateRandomVoltage(),
          wire3: generateRandomVoltage(),
          wire4: generateRandomVoltage(),
          wire5: generateRandomVoltage(),
          wire6: generateRandomVoltage()
        },
        wheelsMotorBattery3: {
          wire1: generateRandomVoltage(),
          wire2: generateRandomVoltage(),
          wire3: generateRandomVoltage(),
          wire4: generateRandomVoltage(),
          wire5: generateRandomVoltage(),
          wire6: generateRandomVoltage()
        },
        brakesMotorBattery: {
          wire1: generateRandomVoltage(),
          wire2: generateRandomVoltage()
        },
        levitationBattery: {
          wire1: generateRandomVoltage(),
          wire2: generateRandomVoltage(),
          wire3: generateRandomVoltage(),
          wire4: generateRandomVoltage()
        },
        current: {
          current1: Number((Math.random() * 10).toFixed(2)),
          current2: Number((Math.random() * 10).toFixed(2)),
          current3: Number((Math.random() * 10).toFixed(2))
        }
      };

      setVoltageData(newVoltageData);
    };

    // İlk veri oluşturma
    generateVoltageData();

    // 2 saniyede bir veri güncelleme
    const intervalId = setInterval(generateVoltageData, 2000);

    // Temizleme fonksiyonu
    return () => clearInterval(intervalId);
  }, []);

  

  const renderBatteryVoltages = (batteryData, title) => (
    <div className="mb-4">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <div className="grid grid-cols-3 gap-2">
        {Object.entries(batteryData).map(([wire, voltage], index) => (
          <div key={index} className="bg-gray-100 p-2 rounded">
            <p className="font-semibold">{wire}:</p>
            <p className={`text-lg font-bold text-black`}>
              {voltage.toFixed(2)}V
            </p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mb-4">
      <h2 className="text-2xl font-bold mb-4">Voltaj ve Akım Değerleri</h2>
      
      {voltageData.wheelsMotorBattery1 && renderBatteryVoltages(voltageData.wheelsMotorBattery1, "Teker Motor Bataryası (1)")}
      {voltageData.wheelsMotorBattery2 && renderBatteryVoltages(voltageData.wheelsMotorBattery2, "Teker Motor Bataryası (2)")}
      {voltageData.wheelsMotorBattery3 && renderBatteryVoltages(voltageData.wheelsMotorBattery3, "Teker Motor Bataryası (3)")}
      {voltageData.brakesMotorBattery && renderBatteryVoltages(voltageData.brakesMotorBattery, "Fren Motor Bataryası")}
      {voltageData.levitationBattery && renderBatteryVoltages(voltageData.levitationBattery, "Levitasyon Bataryası")}

      {voltageData.current && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Akım Değerleri</h3>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(voltageData.current).map(([currentName, currentValue], index) => (
              <div key={index} className="bg-gray-100 p-2 rounded">
                <p className="font-semibold">{currentName}:</p>
                <p className="text-lg font-bold text-blue-500">{currentValue.toFixed(2)}A</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VoltageDisplay;