import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header/Header';
import FinTrackTable from './components/FinTrackTable/FinTrackTable';
import WelcomeSection from './components/WelcomeSection/WelcomeSection';
import axios from 'axios';

/**
 * Main Application Component
 * 
 * This component serves as the root of the React application. It manages the state
 * for transaction data, fetches initial data from the backend, and renders the main
 * structure of the application including the header, welcome section, and transaction table.
 * 
 * State:
 * - tableData: An array of transaction objects used to populate the transaction table.
 * 
 * Components:
 * - Header: Displays the application header.
 * - WelcomeSection: Provides file upload functionality and allows adding new transactions.
 * - FinTrackTable: Displays the transaction data in a table format.
 * 
 * Example usage:
 * <App />
 */
function App() {
  // State to manage the transaction data
  const [tableData, setTableData] = useState([]);

  /**
   * useEffect hook to fetch initial transaction data from the backend.
   * 
   * This effect runs once when the component mounts. It sends a GET request
   * to the '/get_data' endpoint and updates the tableData state with the response.
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/get_data');
        if (response.status === 200) {
          setTableData(response.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  /**
   * Appends new transaction data to the existing table data.
   * 
   * @param {Array} newData - Array of new transaction objects to be added to the table.
   */
  const appendTableData = (newData) => {
    setTableData((prevData) => [...prevData, ...newData]);
  };

  return (
    <div className="App">
      <header className="App-header">
        {/* Render the Header component */}
        <Header />
        {/* Render the WelcomeSection component with the ability to append new data */}
        <WelcomeSection setTableData={appendTableData} />
      </header>
      <main>
        {/* Render the FinTrackTable component with current data and the ability to update it */}
        <FinTrackTable data={tableData} setTableData={setTableData} />
      </main>
    </div>
  );
}

export default App;