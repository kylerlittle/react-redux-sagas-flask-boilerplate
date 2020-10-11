import React from 'react';
import logo from './resources/thinking.png';
import './App.css';
import JournalContainer from './containers/JournalContainer';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <JournalContainer />
      </header>
    </div>
  );
}

export default App;
