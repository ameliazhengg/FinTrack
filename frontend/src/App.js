import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header/Header';
import FinTrackTable from './components/FinTrackTable/FinTrackTable';
import WelcomeSection from './components/WelcomeSection/WelcomeSection';
import SpendingLimit from './components/SpendingLimit/SpendingLimit';
import PieChart from './components/PieChart/PieChart';
import axios from 'axios';
import ChatBot from './components/ChatBot/ChatBot';

/**
 * App Component
 * 
 * The `App` component serves as the central hub of this React application, providing a 
 * cohesive interface for financial tracking. It manages and passes down the application's 
 * core state (`tableData`), which contains transaction data fetched from a backend API. 
 * The `App` component integrates several child components, organizing the application's 
 * structure and data flow for an interactive user experience in managing transactions.
 * 
 * This component makes use of the following libraries and modules:
 * - React: Core library for building UI, specifically `useState` for state management 
 *   and `useEffect` for handling side effects like data fetching.
 * - Axios: A promise-based HTTP client used here to fetch initial transaction data 
 *   from a backend endpoint (`/get_data`). `axios.get()` is leveraged to perform an 
 *   asynchronous HTTP GET request, with a try-catch block to handle errors.
 * - Header, WelcomeSection, FinTrackTable, SpendingLimit, and PieChart components:
 *   Imported from local component directories, each child component is responsible 
 *   for specific functionalities, including rendering UI elements and handling user interactions.
 * 
 * Key Features:
 * - Data Fetching: On initial render, `useEffect` executes `fetchData` to retrieve transaction
 *   data, which is stored in `tableData`. This state is passed down to components that need
 *   access to it, like `FinTrackTable` and `PieChart`.
 * - State Update: The `appendTableData` function appends new transactions to `tableData`, 
 *   providing a seamless way to update the table and chart without re-fetching data.
 * 
 * Props Passed to Child Components:
 * - `setTableData`: Passed to `WelcomeSection` for adding new transaction data.
 * - `data`: Passed to `FinTrackTable` for table rendering.
 * - `transactions`: Passed to `PieChart` to visualize spending categories.
 * 
 * Example usage:
 * <App />
 */
function App() {
  const [tableData, setTableData] = useState([]);

  /**
   * useEffect Hook
   * 
   * This `useEffect` hook runs once upon component mount, triggering the `fetchData` function.
   * `fetchData` performs an HTTP GET request to the `/get_data` endpoint using Axios. Upon 
   * successful data retrieval, it populates `tableData` with the fetched data, updating the
   * application's main state to reflect current transaction data.
   * 
   * Key Functions:
   * - `axios.get`: Sends a GET request to the specified backend endpoint. If the request is 
   *   successful and status code is 200, the response data is stored in `tableData` for display.
   * - `try-catch` Error Handling: Ensures the application does not crash if the data fetch fails;
   *   errors are logged to the console, preserving UX continuity.
   * 
   * Dependencies:
   * - `[]`: Empty dependency array ensures this hook runs only once on initial render.
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
   * appendTableData Function
   * 
   * This function updates `tableData` by appending new entries to the existing data. 
   * `appendTableData` is passed down to the `WelcomeSection` component, which utilizes 
   * it to add user-uploaded transactions directly to `tableData`, providing a dynamic
   * user experience with live updates.
   * 
   * Parameters:
   * - `newData` (Array): An array of transaction objects to be appended to `tableData`.
   * 
   * Usage:
   * - `setTableData` is used to update `tableData` by taking the previous data and 
   *   concatenating `newData` onto it, allowing state to change incrementally without 
   *   overwriting existing entries.
   */
  const appendTableData = (newData) => {
    setTableData((prevData) => [...prevData, ...newData]);
  };

  return (
    <div className="App">
      <header className="App-header">
        <Header />
      </header>
      <div className="content-wrapper">
        <div className="main-section">
          <WelcomeSection setTableData={appendTableData} />
          <FinTrackTable data={tableData} setTableData={setTableData} />
        </div>
        <div className="sidebar-section">
          <SpendingLimit />
          <PieChart transactions={tableData} />
          <ChatBot transactions={tableData} />
        </div>
      </div>
    </div>
  );
}

export default App;