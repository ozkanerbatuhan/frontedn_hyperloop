import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

const Speedometer = ({ speed = 0 }) => {
    const calcAngle = useMemo(() => (value) => {
        return -90 + (value * 1.8); // 0 -> -90 derece, 100 -> +90 derece
    }, []);

    const angle = useMemo(() => calcAngle(speed), [calcAngle, speed]);

    return (
        <div className="flex items-center justify-center">
            <div className="speedometer">
                <div className="dial"></div>
                <div className="marks">
                    {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map(mark => (
                        <div key={mark} className="mark" style={{transform: `rotate(${calcAngle(mark)}deg)`}}>
                            <div className="mark-label">{mark}</div>
                        </div>
                    ))}
                </div>
                <div 
                    className="needle" 
                    style={{ transform: `rotate(${angle}deg)` }}
                    role="meter"
                    aria-valuenow={speed}
                    aria-valuemin="0"
                    aria-valuemax="100"
                    aria-label="Current speed"
                ></div>
                <div className="center-point"></div>
                <div className="speed-value">{Math.round(speed)} km/h</div>
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
    width: 200px;
    height: 120px;
    overflow: visible;  // changed from 'hidden' to 'visible'
}

.speedometer .dial {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 200px 200px 0 0;
    border: 8px solid #f1f3f5;
    border-bottom: none;
}

.speedometer .marks {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}

.speedometer .mark {
    position: absolute;
    width: 100%;
    height: 100%;
    transform-origin: bottom center;
}

.speedometer .mark::before {
    content: '';
    position: absolute;
    top: 5px;
    left: 50%;
    width: 2px;
    height: 8px;
    background-color: #adb5bd;
    transform: translateX(-50%);
}

.speedometer .mark-label {
    position: absolute;
    top: 15px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 10px;
    color: #adb5bd;
}

.speedometer .needle {
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 3px;
    height: 90px;
    background-color: #e74c3c;
    transform-origin: bottom center;
    transition: transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1);
}

.speedometer .center-point {
    position: absolute;
    bottom: -4px;
    left: 50%;
    width: 16px;
    height: 16px;
    background-color: #e74c3c;
    border-radius: 50%;
    transform: translateX(-50%);
}

.speedometer .speed-value {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 18px;
    font-weight: bold;
    color: #2c3e50;
}

@media (max-width: 640px) {
    .speedometer {
        width: 160px;
        height: 100px;
    }
    .speedometer .needle {
        height: 70px;
    }
    .speedometer .speed-value {
        font-size: 16px;
    }
}
`;

// Inject styles
if (typeof document !== 'undefined') {
    const styleElement = document.createElement('style');
    styleElement.textContent = SpeedometerStyles;
    document.head.appendChild(styleElement);
}