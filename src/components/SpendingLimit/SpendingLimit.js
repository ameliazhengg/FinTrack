import React, { useState, useEffect } from 'react';
import './SpendingLimit.css';

const SpendingLimit = () => {
  const [limit, setLimit] = useState(1200);
  const [spent, setSpent] = useState(0);
  const [loading, setLoading] = useState(true);

  // Function to fetch and calculate spending
  const fetchTransactions = async () => {
    try {
      const response = await fetch('http://localhost:5005/get_data');
      const data = await response.json();
      
      // Calculate total spent by summing negative amounts
      const totalSpent = data
        .filter(transaction => parseFloat(transaction.Amount) < 0)
        .reduce((sum, transaction) => sum + Math.abs(parseFloat(transaction.Amount)), 0);
      
      setSpent(totalSpent);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setLoading(false);
    }
  };

  // Set up polling interval when component mounts
  useEffect(() => {
    // Initial fetch
    fetchTransactions();

    // Set up polling
    const intervalId = setInterval(fetchTransactions, 500);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array means this runs once on component mount

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

  // Add a subtle animation for the spent amount
  const AnimatedAmount = ({ value }) => {
    const [displayValue, setDisplayValue] = useState(value);

    useEffect(() => {
      setDisplayValue(value);
    }, [value]);

    return (
      <span className="amount" style={{ transition: 'color 0.3s ease' }}>
        ${displayValue.toFixed(2)}
      </span>
    );
  };

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
            {/* Progress semicircle with smooth transition */}
            <path
              d="M5,50 A45,45 0 1,1 95,50"
              fill="none"
              stroke={getColor()}
              strokeWidth="8"
              strokeDasharray={`${circumference}`}
              strokeDashoffset={strokeDashoffset}
              className="progress-ring-circle"
              style={{ transition: 'stroke-dashoffset 0.3s ease, stroke 0.3s ease' }}
            />
          </svg>
          <div className="progress-text">
            {loading ? (
              <span className="amount">Loading...</span>
            ) : (
              <>
                <AnimatedAmount value={spent} />
                <span className="limit">of ${limit}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpendingLimit;