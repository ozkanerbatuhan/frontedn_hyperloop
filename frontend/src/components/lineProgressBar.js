"use client";
import React from "react";
import PropTypes from 'prop-types';

const LineProgressBar = React.memo(({ percent = 60 }) => {
  return (
    <div className="mt-12 w-full px-4">
      <div className="mx-auto max-w-3xl bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="relative h-5 w-full rounded-full"
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin="0"
          aria-valuemax="100"
          aria-label="İlerleme çubuğu"
        >
          <div 
            className="bg-blue-600 absolute top-0 left-0 h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${percent}%` }}
          >
            <span className="absolute -right-4 -top-8 bg-blue-400 text-white text-sm rounded px-2 py-1">
              Güncel ilerleyiş: {percent}%
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-blue-400"></span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});

LineProgressBar.propTypes = {
  percent: PropTypes.number
};

LineProgressBar.displayName = 'LineProgressBar';

export default LineProgressBar;