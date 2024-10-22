import React, { useState } from 'react';
import './SpendingLimit.css';

const SpendingLimit = () => {
  const [limit, setLimit] = useState(1200); // Default limit of $1200
  const spent = 300; // Hardcoded spent amount

  // Calculate percentage for progress bar
  const percentage = Math.min((spent / limit) * 100, 100);
  
  // Determine color based on spending percentage
  const getColor = () => {
    if (percentage >= 90) return '#ef4444';
    if (percentage >= 75) return '#f97316';
    return '#22c55e';
  };

  // Calculate SVG properties for semicircle
  const radius = 45;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference * (1 - percentage / 100);

  return (
    <div className="spending-limit-container">
      <div className="spending-limit-header">
        <h2 className="spending-title">Spending Limit</h2>
        <div className="limit-input">
          <label htmlFor="limit">Set Limit: $</label>
          <input
            type="number"
            id="limit"
            value={limit}
            onChange={(e) => setLimit(Math.max(0, Number(e.target.value)))}
            className="limit-input-field"
          />
        </div>
      </div>

      <div className="progress-container">
        <div className="progress-semicircle">
          <svg viewBox="0 0 100 50" className="progress-ring">
            {/* Background semicircle */}
            <path
              d="M5,50 A45,45 0 1,1 95,50"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="8"
              className="progress-ring-background"
            />
            {/* Progress semicircle */}
            <path
              d="M5,50 A45,45 0 1,1 95,50"
              fill="none"
              stroke={getColor()}
              strokeWidth="8"
              strokeDasharray={`${circumference}`}
              strokeDashoffset={strokeDashoffset}
              className="progress-ring-circle"
            />
          </svg>
          <div className="progress-text">
            <span className="amount">${spent}</span>
            <span className="limit">of ${limit}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpendingLimit;
