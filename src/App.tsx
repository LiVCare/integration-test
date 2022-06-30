import React, { useState } from 'react';
import './App.css';
import LivMananger, { Network } from 'livcare-js'
import { ethers } from 'ethers'
import 'bootstrap/dist/css/bootstrap.min.css';
import MainPage from './componentes/MainPage';
import { Navbar, Container, Nav } from 'react-bootstrap';


function App() {

  const [livManager, setLivManager] = useState<any>(null)
  const [provider, setProvider] = useState<any>(null)
  const [connected, setConnected] = useState<boolean>(false)
  const [key, setKey] = useState<any>('home');


  const updateView = (e: any) => {
    setKey(e.target.id)
  }

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
    <>
      <Navbar bg="dark" variant="dark" onClick={updateView}>
        <Container>
          <Navbar.Brand href="#home">LivCare</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link id="home">Home</Nav.Link>
            <Nav.Link id="dashboard">Dashboard</Nav.Link>
            <Nav.Link id="profile">Profile</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      {connected ?
        <MainPage livManager={livManager} provider={provider} view={key} />
        :
        <button onClick={() => connect()}>
          Connect to MetaMask
        </button>
      }
    </>
  );
}

export default React.memo(App);
