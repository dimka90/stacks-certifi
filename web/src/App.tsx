import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import IssueCredential from './components/IssueCredential';
import VerifyCredential from './components/VerifyCredential';
import Statistics from './components/Statistics';
import WalletConnect from './components/WalletConnect';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userAddress, setUserAddress] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Check if wallet is connected from localStorage
    const savedAddress = localStorage.getItem('userAddress');
    if (savedAddress) {
      setUserAddress(savedAddress);
      setIsConnected(true);
    }
  }, []);

  const handleWalletConnect = (address: string) => {
    setUserAddress(address);
    setIsConnected(true);
    localStorage.setItem('userAddress', address);
  };

  const handleDisconnect = () => {
    setUserAddress('');
    setIsConnected(false);
    localStorage.removeItem('userAddress');
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1>🎓 Certifi</h1>
          <p>Blockchain-Powered Credential Verification</p>
        </div>
        <div className="header-status">
          {isConnected ? (
            <div className="user-info">
              <span className="address">{userAddress.slice(0, 10)}...</span>
              <span className="status">✅ Connected</span>
            </div>
          ) : (
            <span className="status">⚠️ Not Connected</span>
          )}
        </div>
      </header>

      <nav className="nav">
        <button
          className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          📊 Dashboard
        </button>
        <button
          className={`nav-btn ${activeTab === 'issue' ? 'active' : ''}`}
          onClick={() => setActiveTab('issue')}
        >
          🎓 Issue Credential
        </button>
        <button
          className={`nav-btn ${activeTab === 'verify' ? 'active' : ''}`}
          onClick={() => setActiveTab('verify')}
        >
          ✔️ Verify Credential
        </button>
        <button
          className={`nav-btn ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          📈 Statistics
        </button>
      </nav>

      <main className="main">
        {!isConnected ? (
          <WalletConnect onConnect={handleWalletConnect} />
        ) : (
          <>
            {activeTab === 'dashboard' && <Dashboard userAddress={userAddress} />}
            {activeTab === 'issue' && <IssueCredential userAddress={userAddress} />}
            {activeTab === 'verify' && <VerifyCredential />}
            {activeTab === 'stats' && <Statistics />}
          </>
        )}
      </main>

      <footer className="footer">
        <p>Certifi © 2024 | Restoring Global Trust in Academic Credentials</p>
      </footer>
    </div>
  );
}

export default App;
