import React from "react";

const RiskMeter = ({ score }) => {
  const radius = 60;
  const stroke = 10;
  const normalizedRadius = radius - stroke * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;

  const strokeDashoffset = circumference - score * circumference;

  // Risk zones
  let color = "#10b981"; // green
  let label = "HUMAN VERIFIED";

  if (score > 0.7) {
    color = "#ef4444"; // red
    label = "SPOOF DETECTED";
  } else if (score > 0.4) {
    color = "#f59e0b"; // yellow
    label = "SUSPICIOUS";
  }

  return (
    <div
      className="p-6 rounded-3xl border border-slate-800 bg-slate-900 flex flex-col items-center justify-center transition-all duration-500"
      style={{
        boxShadow: `0 0 ${20 + score * 50}px ${color}40`,
        transform: `scale(${1 + score * 0.05})`,
      }}
    >
      <h3 className="text-slate-400 text-xs font-bold uppercase mb-4">
        Threat Level
      </h3>

      <div className="relative flex items-center justify-center">
        {/* Background Circle */}
        <svg height={radius * 2} width={radius * 2}>
          <circle
            stroke="#1e293b"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />

          {/* Animated Progress */}
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <circle
            stroke={color}
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={`${circumference} ${circumference}`}
            style={{
              strokeDashoffset,
              transition: "stroke-dashoffset 0.4s ease",
            }}
            filter="url(#glow)"
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </svg>

        {/* Center Text */}
        <div className="absolute text-center">
          <div className="text-2xl font-mono">{(score * 100).toFixed(1)}%</div>
        </div>
      </div>

      {/* Status */}
      <div
        className="mt-4 px-4 py-2 rounded-lg text-sm font-bold transition-all"
        style={{
          backgroundColor: color + "20",
          color: color,
        }}
      >
        {label}
      </div>
    </div>
  );
};

export default RiskMeter;
