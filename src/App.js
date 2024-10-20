import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import FinTrackTable from './components/FinTrackTable';
import WelcomeSection from './components/WelcomeSection';
import axios from 'axios';

/**
 * Main Application Component
 * 
 * This component serves as the root of the React application. It handles fetching 
 * transaction data from the backend, managing state for the transaction table, 
 * and rendering key components such as Header, WelcomeSection, and FinTrackTable.
 * 
 * Components:
 * - Header: Displays the header section with navigation links and branding.
 * - WelcomeSection: Provides the file upload feature and allows new transactions 
 *   to be added to the table data.
 * - FinTrackTable: Displays the transaction table with options to add and delete 
 *   transactions, interacting with the backend to keep data consistent.
 * 
 * State:
 * - tableData: An array of transaction objects used to populate the transaction table.
 * 
 * Example usage:
 * <App />
 */
function App() {
  // State to manage the transaction data
  const [tableData, setTableData] = useState([]);

  /**
   * useEffect hook to fetch transaction data from the backend on initial load.
   * 
   * This asynchronous function sends a GET request to the '/get_data' endpoint and 
   * updates the state with the fetched data. It runs once when the component mounts.
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Send GET request to fetch transaction data
        const response = await axios.get('/get_data');
        if (response.status === 200) {
          // Update state with the fetched data
          setTableData(response.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData(); // Call the fetch function on component mount
  }, []);

  /**
   * Appends new transaction data to the existing table data.
   * 
   * This function updates the tableData state by adding the new data to the 
   * existing data array.
   * 
   * @param {Array} newData - Array of new transaction objects to be added to the table.
   */
  const appendTableData = (newData) => {
    setTableData((prevData) => [...prevData, ...newData]);
  };

  /**
   * Renders the main application structure.
   * 
   * It includes the Header, WelcomeSection, and FinTrackTable components, passing 
   * relevant props to manage the transaction data.
   * 
   * @returns {JSX.Element} The rendered application structure.
   */
  return (
    <div className="App">
      <header className="App-header">
        {/* Render Header component */}
        <Header />

        {/* Render WelcomeSection with a prop to append new transactions */}
        <WelcomeSection setTableData={appendTableData} />
      </header>

      <main>
        {/* Render FinTrackTable with transaction data and update function */}
        <FinTrackTable data={tableData} setTableData={setTableData} />
      </main>
    </div>
  );
}

export default App;
