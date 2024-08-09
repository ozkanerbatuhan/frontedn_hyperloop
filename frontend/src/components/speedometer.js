import React from 'react'
import './speedometer.css'
import { useState, useEffect } from "react";

export default function Speedometer({speed=150.0}) {
    const [angle, setAngle] = useState(calcAngle(speed));

    useEffect(() => {
      setAngle(calcAngle(speed));
    }, [speed]);
  
    function calcAngle(speed) {
        let angle = -90;
        if (speed <= 120) {
          angle = (speed / 120) * 180 - 90;
        } else {
          angle = 90; // If speed exceeds 120, cap the angle at 90 degrees
        }
        return Math.round(angle);
      }

    return (
        <div className="min-h-screen items-center flex justify-center p-6">
          <div className="bg-white mx-auto max-w-sm shadow-lg rounded-lg overflow-hidden border-r">
            <div className="block px-4 py-2 mb-6 leading-normal bg-grey-lighter flex flex-no-shrink">
              <h3 className="pl-2 text-left m-auto align-middle text-grey-darkest w-full">Internet Speedometer</h3>
            </div>
    
            <div className="items-center flex justify-center p-4">
              <div className="">
                <div className="speedometr">
                  <div className="scale low"></div>
                  <div className="scale middle"></div>
                  <div className="scale hight"></div>
                  <div
                    id="arrow"
                    className="arrow"
                    style={{
                      transform: `rotate(${angle}deg)`,
                      WebkitTransform: `rotate(${angle}deg)`,
                      msTransform: `rotate(${angle}deg)`
                    }}
                  ></div>
                </div>
    
                <div id="counter" className="text-grey-darkest text-center text-base font-semibold pt-4 pb-0">
                  {speed.toFixed(1)} Mbps
                </div>
              </div>
            </div>
            <div className="py-4 px-8 text-sm font-medium text-grey-darker bg-grey-lighter leading-normal">
              <p>
                Internet speed is calculated by <b>Chrome Network Information API</b>. Click{' '}
                <a href="https://developer.mozilla.org/en-US/docs/Web/API/Network_Information_API" target="_blank" rel="noopener noreferrer">
                  here
                </a>{' '}
                to view the MDN docs. Note that this API is not supported by Firefox.
              </p>
            </div>
          </div>
        </div>
      );
    };