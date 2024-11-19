import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header/Header';
import FinTrackTable from './components/FinTrackTable/FinTrackTable';
import WelcomeSection from './components/WelcomeSection/WelcomeSection';
import SpendingLimit from './components/SpendingLimit/SpendingLimit';
import LoginPage from './components/LoginPage/LoginPage';
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
 * - SpendingLimit: Incrementally displays negative transactions as a proportion of a total set spending limit.
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

  const appendTableData = (newData) => {
    setTableData((prevData) => [...prevData, ...newData]);
  };

  return (
    <div className="App">
      <header className="App-header">
        <Header />
      </header>
      <div className="content-wrapper">
        {/* Main content area */}
        <div className="main-section">
          <WelcomeSection setTableData={appendTableData} />
          <FinTrackTable data={tableData} setTableData={setTableData} />
        </div>
        
        {/* Spending limit section */}
        <div className="sidebar-section">
          <SpendingLimit />
        </div>
      </div>
    </div>
  );
}

export default App;