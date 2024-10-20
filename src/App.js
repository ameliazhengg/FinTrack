import './App.css';
import Header from './components/Header';
import WelcomeSection from './components/WelcomeSection';
import React from 'react';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Header />
        <WelcomeSection />
      </header>
    </div>
  );
}

export default App;
