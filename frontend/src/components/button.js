"use client";
import { useState, useEffect } from "react";

const Button = ({ text="test", color="blue", onPress=() => {} , isReady}) => {
  return (
    <div>
      <button
          type="button"
          class={`text-white ${color} rounded size-24 h-14 m-4 py-0 `}
          style={{
          }}
          onClick={onPress}
        >
          {text}
        </button>
    </div>
  );
};

export default Button;
