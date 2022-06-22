import React, { useState } from 'react';
import './App.css';
import LivMananger, { Network } from 'livcare-js'
import { ethers } from 'ethers'
import 'bootstrap/dist/css/bootstrap.min.css';
import MainPage from './componentes/MainPage';

function App() {

  const [livManager, setLivManager] = useState<any>(null)
  const [provider, setProvider] = useState<any>(null)
  const [connected, setConnected] = useState<boolean>(false)

  async function connect() {

    if (!window.ethereum) {
      alert('MetaMask is not installed. Please consider installing it: https://metamask.io/download.html');
    } else {
      await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const livjs = new LivMananger({ network: Network.mumbai, provider: provider })
      setLivManager(livjs)
      setProvider(provider)
      setConnected(true)
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        {connected ?
          <MainPage livManager={livManager} provider={provider}/>
          :
          <button onClick={() => connect()}>
            Connect to MetaMask
          </button>
        }
      </header>
    </div>
  );
}

export default App;
