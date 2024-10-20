/**
 * FinTrackTable Component
 * 
 * This component renders a table that displays financial transaction data.
 * It dynamically generates rows based on the provided data prop.
 * 
 * Props:
 * @param {Array<Object>} data - An array of transaction objects containing 
 * information like Date, Description, Amount, Balance, and Category.
 * 
 * The component visually differentiates positive and negative amounts using 
 * specific CSS classes ('positive' for positive amounts and 'negative' for negative amounts).
 * 
 * Example usage:
 * <FinTrackTable data={tableData} />
 */

import React from 'react';
import './FinTrackTable.css';

/**
 * Renders a table displaying transaction data.
 * 
 * @param {Object} props - Component props.
 * @param {Array<Object>} props.data - An array of transaction objects to be displayed in the table.
 * @returns {JSX.Element} - The rendered FinTrackTable component.
 */
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
            // Display message when no data is available
            <tr>
              <td colSpan="5" style={{ textAlign: 'center' }}>No data available.</td>
            </tr>
          ) : (
            // Map through transaction data and render rows
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
