import React, { useState, useEffect } from 'react';
import './FinTrackTable.css';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ReactComponent as FilterIcon } from '../../assets/icons/filter.svg';

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


  // State to manage sorting
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // State for search and date filtering
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({ start: null, end: null });


  /**
   * Fetches transaction data from the backend and updates the table.
   * 
   * @async
   */
  const fetchData = async () => {
    try {
      const response = await axios.get('/get_data');
      if (response.status === 200) {
        setTableData(response.data); // Update table data with fetched data
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Failed to fetch data. Please try again.');
    }
  };

  /**
   * Resets all filters and refetches the table data.
   */
  const resetFilters = async () => {
    // Clear all filters
    setSearchTerm('');
    setDateRange({ start: null, end: null });
    setTransactionRange({ min: null, max: null });

    // Reset sorting configuration
    setSortConfig({ key: null, direction: 'asc' });

    // Refetch data from the backend
    await fetchData();
  };

  React.useEffect(() => {
    fetchData(); 
  }, []);

  /**
   * State to manage transaction range for advanced filtering.
   */
  const [transactionRange, setTransactionRange] = useState({ min: null, max: null });

  
  /**
   * Filters data based on search term and date range.
   * 
   * This function filters the table data by checking if the description contains 
   * the search term and if the date falls within the specified date range.
   */
  const filterData = () => {
    let filteredData = data;

    // Apply search term filter
    if (searchTerm) {
      filteredData = filteredData.filter(transaction =>
        transaction.Description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply date range filter
    if (dateRange.start && dateRange.end) {
      filteredData = filteredData.filter(transaction => {
        const transactionDate = new Date(transaction.Date);
        return transactionDate >= dateRange.start && transactionDate <= dateRange.end;
      });
    }

    return filteredData;
  };

  /**
   * Handles sorting of the table data based on the selected column.
   * 
   * @param {string} key - The column key to sort by.
   */
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
  
    setSortConfig({ key, direction });
  
    const sortedData = [...data].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    
    setTableData(sortedData);
  };

  /**
   * Handles search input change.
   * 
   * @param {Object} e - Event object from the search input field.
   */
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  /**
   * Handles date range change from the DatePicker component.
   * 
   * @param {Array<Date>} dates - The selected date range from the date picker.
   */
  const handleDateRangeChange = (dates) => {
    const [start, end] = dates;
    setDateRange({ start, end });
  };


  /**
   * Handles input changes for new transaction fields.
   * 
   * It updates the state based on the input field's name and value.
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
    <div className="fintrack-wrapper">
      {/* Search and Filter Row */}
      <div className="filter-row">
          <input
            type="text"
            className="search-input"
            placeholder="Search Transactions"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <DatePicker
            selectsRange
            startDate={dateRange.start}
            endDate={dateRange.end}
            onChange={handleDateRangeChange}
            dateFormat="MM/dd/yyyy"
            placeholderText="Select Date Range"
            className="date-picker"
          />
          <button onClick={resetFilters} className="reset-button">Reset Filters</button>
      </div>
      {dateRange.start && dateRange.end && (
        <div className="date-range-display">
          Showing results from {dateRange.start.toLocaleDateString()} to {dateRange.end.toLocaleDateString()}
        </div>
      )}
      <div className="fintrack-table-container">
      <table className="fintrack-table">
          <thead>
            <tr>
              <th
                className={`sortable ${sortConfig.key === 'Date' ? (sortConfig.direction === 'asc' ? 'sorted-asc' : 'sorted-desc') : ''}`}
                onClick={() => handleSort('Date')}
              >
                Date
                {sortConfig.key === 'Date' ? (
                  sortConfig.direction === 'asc' ? ' ▲' : ' ▼'
                ) : (
                  <span className="sort-icon unsorted">&#9650;&#9660;</span>
                )}
              </th>

              <th>Description</th>

              <th
                className={`sortable ${sortConfig.key === 'Amount' ? (sortConfig.direction === 'asc' ? 'sorted-asc' : 'sorted-desc') : ''}`}
                onClick={() => handleSort('Amount')}
              >
                Amount
                {sortConfig.key === 'Amount' ? (
                  sortConfig.direction === 'asc' ? ' ▲' : ' ▼'
                ) : (
                  <span className="sort-icon unsorted">&#9650;&#9660;</span>
                )}
              </th>

              <th>Balance</th>

              <th
                className={`sortable ${sortConfig.key === 'Category' ? (sortConfig.direction === 'asc' ? 'sorted-asc' : 'sorted-desc') : ''}`}
                onClick={() => handleSort('Category')}
              >
                Category
                {sortConfig.key === 'Category' ? (
                  sortConfig.direction === 'asc' ? ' ▲' : ' ▼'
                ) : (
                  <span className="sort-icon unsorted">&#9650;&#9660;</span>
                )}
              </th>

              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filterData().length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center' }}>No data available.</td>
              </tr>
            ) : (
              filterData().map((transaction, index) => (
                <tr key={index}>
                  <td>{new Date(transaction.Date).toLocaleDateString()}</td>
                  <td>{transaction.Description}</td>
                  <td className={transaction.Amount < 0 ? 'negative' : 'positive'}>
                    {transaction.Amount}
                  </td>
                  <td>{transaction.Balance}</td>
                  <td>{transaction.Category}</td>
                  <td>
                    <button className="delete-button" onClick={() => handleDeleteTransaction(index)}>Delete</button>
                  </td>
                </tr>
              ))
            )}
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
                <button className="add-button" onClick={handleAddTransaction}>Add</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );  
};

export default FinTrackTable;