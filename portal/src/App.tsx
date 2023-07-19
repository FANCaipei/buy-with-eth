import React, { useCallback } from 'react';
import logo from './logo.svg';
import './App.css';
import { Button } from 'antd';

function App() {

  const cMetamask = useCallback(() => {
    (window as any).walletManager.connectWallet((window as any).ethereum, 'metamask');
  }, []);
  const requestTransfer = useCallback(() => {
    (window as any).walletManager.requestTransfer(0.01, '0x6978De6532Cd2C94D47430C22B1bCddb53fB23aa', '0xA02bB13E8d360E9E3A1c07C3043BE140C2D8DA59');
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <Button type='primary' onClick={cMetamask}>connect metamask</Button>
        <Button type='primary' onClick={requestTransfer}>request transfer</Button>
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
