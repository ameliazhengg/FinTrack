import React, { useState } from 'react';
import './FinTrackTable.css';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

/**
 * FinTrackTable Component
 * 
 * This component renders a table that displays financial transaction data. 
 * It provides functionalities for adding and deleting transactions and 
 * includes a date picker for date input when adding new transactions.
 * 
 * Props:
 * @param {Array<Object>} data - An array of transaction objects containing 
 * information like Date, Description, Amount, Balance, and Category.
 * @param {Function} setTableData - A function to update the transaction data 
 * in the parent component state.
 * 
 * The component visually differentiates positive and negative amounts using 
 * specific CSS classes ('positive' for positive amounts and 'negative' for 
 * negative amounts).
 * 
 * Example usage:
 * <FinTrackTable data={tableData} setTableData={setTableData} />
 */
const FinTrackTable = ({ data, setTableData }) => {
  // State to manage a new transaction entry
  const [newTransaction, setNewTransaction] = useState({
    Date: null,
    Description: '',
    Amount: '',
    Balance: '',
    Category: ''
  });

  /**
   * Handles input changes for new transaction fields.
   * 
   * It updates the state based on the input field's name and value, ensuring that
   * the state is updated correctly for each transaction field.
   * 
   * @param {Object} e - Event object from the input field.
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTransaction((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  /**
   * Handles the date change for the DatePicker component.
   * 
   * It updates the 'Date' field in the new transaction state when the user selects 
   * a date from the date picker.
   * 
   * @param {Date} date - The selected date from the date picker.
   */
  const handleDateChange = (date) => {
    setNewTransaction((prev) => ({
      ...prev,
      Date: date
    }));
  };

  /**
   * Adds a new transaction to the table.
   * 
   * This function validates that all fields are filled, converts the date to string format, 
   * and sends a POST request to the backend to add the transaction. If the addition is 
   * successful, it updates the table data in the parent component state.
   * 
   * @async
   * @function
   */
  const handleAddTransaction = async () => {
    // Check if all fields are filled
    if (!newTransaction.Date || !newTransaction.Description || !newTransaction.Amount || 
        !newTransaction.Balance || !newTransaction.Category) {
      alert('Please fill in all fields before adding a transaction.');
      return;
    }

    // Prepare transaction object for the backend
    const transactionToAdd = {
      ...newTransaction,
      Date: newTransaction.Date.toISOString().split('T')[0]
    };

    try {
      // Send a POST request to add the transaction
      const response = await axios.post('/add_transaction', transactionToAdd);
      if (response.status === 200) {
        // Update table data on successful addition
        setTableData((prevData) => [...prevData, transactionToAdd]);
        // Reset new transaction input fields
        setNewTransaction({ Date: null, Description: '', Amount: '', Balance: '', Category: '' });
      }
    } catch (error) {
      console.error('Error adding transaction:', error);
      alert('Failed to add transaction. Please try again.');
    }
  };

  /**
   * Deletes a transaction from the table.
   * 
   * This function sends a DELETE request to the backend to remove a transaction 
   * based on its index. If the deletion is successful, it updates the local state 
   * to reflect the removal.
   * 
   * @async
   * @function
   * @param {number} index - The index of the transaction to be deleted.
   */
  const handleDeleteTransaction = async (index) => {
    try {
      // Send a DELETE request to remove the transaction
      const response = await axios.delete(`/delete_transaction?index=${index}`);
      if (response.status === 200) {
        // Update table data on successful deletion
        setTableData((prevData) => prevData.filter((_, i) => i !== index));
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
      alert('Failed to delete transaction. Please try again.');
    }
  };

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
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center' }}>No data available.</td>
            </tr>
          ) : (
            data.map((transaction, index) => (
              <tr key={index}>
                <td>{new Date(transaction.Date).toLocaleDateString()}</td>
                <td>{transaction.Description}</td>
                <td className={transaction.Amount < 0 ? 'negative' : 'positive'}>
                  {transaction.Amount}
                </td>
                <td>{transaction.Balance}</td>
                <td>{transaction.Category}</td>
                <td>
                  <button onClick={() => handleDeleteTransaction(index)}>Delete</button>
                </td>
              </tr>
            ))
          )}
          {/* Row for adding a new transaction */}
          <tr>
            <td>
              <DatePicker
                selected={newTransaction.Date}
                onChange={handleDateChange}
                dateFormat="yyyy-MM-dd"
                placeholderText="Select date"
                popperPlacement="bottom-start"
                popperProps={{ strategy: 'fixed' }}
              />
            </td>
            <td>
              <input
                type="text"
                name="Description"
                value={newTransaction.Description}
                onChange={handleInputChange}
                placeholder="Description"
              />
            </td>
            <td>
              <input
                type="number"
                name="Amount"
                value={newTransaction.Amount}
                onChange={handleInputChange}
                placeholder="Amount"
              />
            </td>
            <td>
              <input
                type="number"
                name="Balance"
                value={newTransaction.Balance}
                onChange={handleInputChange}
                placeholder="Balance"
              />
            </td>
            <td>
              <input
                type="text"
                name="Category"
                value={newTransaction.Category}
                onChange={handleInputChange}
                placeholder="Category"
              />
            </td>
            <td>
              <button onClick={handleAddTransaction}>Add</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default FinTrackTable;
