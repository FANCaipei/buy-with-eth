import React, { useCallback } from 'react';
import logo from './logo.svg';
import './App.css';
import { Button } from 'antd';

function App() {

  const cMetamask = useCallback(() => {
    (window as any).walletManager.connectWallet((window as any).ethereum);
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <Button type='primary' onClick={cMetamask}>connect metamask</Button>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
