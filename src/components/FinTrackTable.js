import React from 'react';
import './FinTrackTable.css';

const FinTrackTable = ({ data }) => {
  return (
    <div className="fintrack-table-container">
      <table className="fintrack-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Balance</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center' }}>No data available.</td>
            </tr>
          ) : (
            data.map((transaction, index) => (
              <tr key={index}>
                <td>{transaction.Date}</td>
                <td>{transaction.Description}</td>
                <td className={transaction.Amount < 0 ? 'negative' : 'positive'}>
                  {transaction.Amount}
                </td>
                <td>{transaction.Balance}</td>
                <td>{transaction.Category}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default FinTrackTable;
