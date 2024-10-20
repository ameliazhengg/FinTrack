import './App.css';
import Header from './components/Header';
import FinTrackTable from './components/FinTrackTable'; // Import the FinTrackTable component

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Header />
      </header>
      <main>
        <FinTrackTable /> {/* Render the FinTrackTable component */}
      </main>
    </div>
  );
}

export default App;
