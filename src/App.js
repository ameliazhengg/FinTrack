import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import FinTrackTable from './components/FinTrackTable';
import WelcomeSection from './components/WelcomeSection';
import axios from 'axios';

function App() {
  const [tableData, setTableData] = useState([]); // Manage table data

  // Fetch existing data from the backend on initial load
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

  // Function to handle appending new data to the existing table data
  const appendTableData = (newData) => {
    setTableData((prevData) => [...prevData, ...newData]);
  };

  return (
    <div className="App">
      <header className="App-header">
        <Header />
        <WelcomeSection setTableData={appendTableData} /> {/* Pass appendTableData prop */}
      </header>
      <main>
        <FinTrackTable data={tableData} /> {/* Pass tableData to FinTrackTable */}
      </main>
    </div>
  );
}

export default App;
