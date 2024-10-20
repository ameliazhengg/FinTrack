/**
 * Main React Application Component.
 * 
 * This component is the entry point of the React application and is responsible 
 * for rendering the header, welcome section, and financial data table. It manages 
 * the state of table data and fetches existing data from the backend on initial load.
 * 
 * State:
 * - tableData (array): Stores the table data fetched from the backend and updated upon file upload.
 * 
 * Props:
 * - None
 * 
 * Related components: Header, WelcomeSection, FinTrackTable
 * 
 * Example usage:
 * <App />
 */

import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import FinTrackTable from './components/FinTrackTable';
import WelcomeSection from './components/WelcomeSection';
import axios from 'axios';

/**
 * App component: The main component for the React application.
 * 
 * This function defines the main app structure, fetches initial data from the backend,
 * and handles the state of table data, which is passed to other components.
 * 
 * @returns {JSX.Element} - The rendered App component.
 */
function App() {
  // State to manage table data
  const [tableData, setTableData] = useState([]);

  /**
   * Fetches existing data from the backend upon initial component mount.
   * 
   * This useEffect hook runs once on mount and sends a GET request to the '/get_data' 
   * endpoint to retrieve previously uploaded data. If the request is successful, 
   * it updates the table data state.
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

    fetchData(); // Call fetchData function
  }, []); // Empty dependency array ensures this runs once on component mount

  /**
   * Appends new data to the existing table data.
   * 
   * This function is used as a callback prop to update the tableData state 
   * with new data received from the EnhancedFileUpload component.
   * 
   * @param {Array} newData - An array of new data records to be added to tableData.
   */
  const appendTableData = (newData) => {
    setTableData((prevData) => [...prevData, ...newData]);
  };

  return (
    <div className="App">
      {/* Header component for displaying the application header */}
      <header className="App-header">
        <Header />

        {/* WelcomeSection component for file upload and data update */}
        <WelcomeSection setTableData={appendTableData} />
      </header>

      {/* Main section displaying the financial data table */}
      <main>
        <FinTrackTable data={tableData} />
      </main>
    </div>
  );
}

export default App;
