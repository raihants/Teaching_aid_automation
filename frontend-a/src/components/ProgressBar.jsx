import React from "react";

const ProgressBar = ({ value, target, label }) => {
  const percentage = Math.round((value / target) * 100);

  return (
    <div style={{ width: "100%" }}>
      
      {/* Value */}
      <div style={{ fontSize: "24px", fontWeight: "600", color: "#333" }}>
        {value.toLocaleString()} Pcs Collected
      </div>

      {/* Progress Bar */}
      <div
        style={{
          width: "100%",
          height: "14px",
          backgroundColor: "#767575",
          borderRadius: "10px",
          overflow: "hidden",
          marginTop: "8px",
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: "100%",
            backgroundColor: "#0629a6",
            borderRadius: "10px",
          }}
        />
      </div>

      {/* Footer */}
      <div
        style={{
          marginTop: "6px",
          fontSize: "14px",
          color: "#555",
        }}
      >
        <b>{percentage}%</b> {label} &nbsp;&nbsp;
        {target.toLocaleString()} Pcs Target
      </div>
    </div>
  );
};

export default ProgressBar;