import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header/Header';
import FinTrackTable from './components/FinTrackTable/FinTrackTable';
import WelcomeSection from './components/WelcomeSection/WelcomeSection';
import SpendingLimit from './components/SpendingLimit/SpendingLimit';
import PieChart from './components/PieChart/PieChart';
import axios from 'axios';
import ChatBot from './components/ChatBot/ChatBot';
import { ReactComponent as ChatIcon } from './assets/icons/chat-icon.svg'; 
import { ReactComponent as CloseIcon } from './assets/icons/close-icon.svg';

/**
 * App Component
 * 
 * The `App` component serves as the central hub of this React application, providing a 
 * cohesive interface for financial tracking. It manages and passes down the application's 
 * core state (`tableData`), which contains transaction data fetched from a backend API. 
 * 
 * Key Features:
 * - Floating Chat Button: Introduced a floating button that toggles the visibility of the
 *   chatbot. The button's position and icon dynamically change based on the chatbot's state.
 * - ChatBot Integration: The `ChatBot` component appears at the bottom right of the screen
 *   when activated by the floating button.
 * 
 * This component integrates the following child components:
 * - Header: Displays the application header.
 * - WelcomeSection: Handles user-uploaded data and passes it to `tableData`.
 * - FinTrackTable: Displays transaction data in a scrollable table.
 * - SpendingLimit: Allows users to set a spending limit.
 * - PieChart: Visualizes spending categories.
 * - ChatBot: Provides a chatbot interface for user interaction.
 */
function App() {
  const [tableData, setTableData] = useState([]);
  const [isChatOpen, setIsChatOpen] = useState(false); // State to toggle chatbot visibility

  /**
   * useEffect Hook
   * 
   * Fetches transaction data from the backend (`/get_data`) on component mount. The fetched 
   * data is stored in `tableData`, ensuring the application displays the latest transactions.
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
   * Appends new transaction entries to `tableData` dynamically. Used by the `WelcomeSection` 
   * component to update the table and chart data in real-time.
   */
  const appendTableData = (newData) => {
    setTableData((prevData) => [...prevData, ...newData]);
  };

  /**
   * toggleChat Function
   * 
   * Toggles the state of the `isChatOpen` variable. When `isChatOpen` is true, the chatbot 
   * becomes visible, and the floating button changes its icon and position.
   */
  const toggleChat = () => {
    setIsChatOpen((prev) => !prev);
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
          {isChatOpen && (
            <div className="chatbot-wrapper">
              <ChatBot transactions={tableData} />
            </div>
          )}
        </div>
      </div>
      <div
        className={`chat-toggle-button ${isChatOpen ? 'active' : ''}`}
        onClick={toggleChat}
      >
        {isChatOpen ? <CloseIcon /> : <ChatIcon />}
      </div>
    </div>
  );
}

export default App;
