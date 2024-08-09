import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

const Speedometer = ({ speed = 0 }) => {
    const calcAngle = useMemo(() => (value) => {
        let angle = -90;
        if (value <= 20) {
            angle = (value / 20) * 60 - 90;
        } else if (value > 20 && value <= 80) {
            angle = ((value - 20) / 60) * 90 - 30;
        } else {
            angle = ((value - 80) / 40) * 30 + 60;
        }
        return Math.round(angle);
    }, []);

    const angle = useMemo(() => calcAngle(speed), [calcAngle, speed]);

    return (
        <div className="mt-12 flex items-center justify-center p-6">
            <div className="bg-white mx-auto max-w-sm shadow-lg rounded-lg overflow-hidden border-r">
                <div className="px-4 py-2 mb-6 bg-gray-100 flex">
                    <h3 className="text-left text-gray-800 font-semibold">Speedometer</h3>
                </div>
                <div className="flex flex-col items-center justify-center p-4">
                    <div className="speedometer">
                        <div className="scale low"></div>
                        <div className="scale middle"></div>
                        <div className="scale high"></div>
                        <div 
                            className="arrow" 
                            style={{ transform: `rotate(${angle}deg)` }}
                            role="meter"
                            aria-valuenow={speed}
                            aria-valuemin="0"
                            aria-valuemax="200"
                            aria-label="Current speed"
                        ></div>
                    </div>
                    <div className="text-gray-800 text-center text-2xl font-semibold mt-4">{speed} km/h</div>
                </div>
            </div>
        </div>
    );
};

Speedometer.propTypes = {
    speed: PropTypes.number
};

export default React.memo(Speedometer);

// Styles
const SpeedometerStyles = `
.speedometer {
    position: relative;
    height: 150px;
    width: 300px;
}

.speedometer .scale {
    position: absolute;
    border: 3px solid;
    width: 100px;
    height: 25px;
    border-radius: 100% 100% 0 0;
    border-bottom: none;
    transform-origin: bottom center;
}

.speedometer .scale.low {
    top: 15px;
    left: -45px;
    border-color: #e74c3c;
    transform: rotate(-60deg);
}

.speedometer .scale.middle {
    top: 0;
    left: calc(50% - 50px);
    border-color: #f1c40f;
}

.speedometer .scale.high {
    top: 15px;
    right: -45px;
    border-color: #2ecc71;
    transform: rotate(60deg);
}

.speedometer .arrow {
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 4px;
    height: 110px;
    background-color: #2c3e50;
    transform-origin: bottom center;
    transition: transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1);
}

.speedometer .arrow::after {
    content: '';
    position: absolute;
    bottom: -6px;
    left: -6px;
    width: 16px;
    height: 16px;
    background-color: #2c3e50;
    border-radius: 50%;
}

@media (max-width: 640px) {
    .speedometer {
        height: 120px;
        width: 240px;
    }
    .speedometer .scale {
        width: 80px;
        height: 20px;
    }
    .speedometer .arrow {
        height: 88px;
    }
}
`;

// Inject styles
if (typeof document !== 'undefined') {
    const styleElement = document.createElement('style');
    styleElement.textContent = SpeedometerStyles;
    document.head.appendChild(styleElement);
}