// src/components/FinTrackTable.js
import React, { useState } from 'react';
import './FinTrackTable.css'; // Import CSS for styling

const FinTrackTable = () => {
    const [data, setData] = useState([]); // Initialize state for table data as an empty array

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
                    {data.length === 0 ? (  // Check if data is empty
                        <tr>
                            <td colSpan="5" style={{ textAlign: 'center' }}>No data available.</td>
                        </tr>
                    ) : (
                        data.map(transaction => (
                            <tr key={transaction.id}>
                                <td>{transaction.date}</td>
                                <td>{transaction.description}</td>
                                <td className={transaction.amount < 0 ? 'negative' : 'positive'}>
                                    {transaction.amount}
                                </td>
                                <td>{transaction.balance}</td>
                                <td>{transaction.category}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default FinTrackTable;