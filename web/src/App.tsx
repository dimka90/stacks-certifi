import React, { useState, useEffect } from 'react';
import { useConnect } from '@stacks/connect-react';
import Dashboard from './components/Dashboard';
import IssueCredential from './components/IssueCredential';
import VerifyCredential from './components/VerifyCredential';
import Statistics from './components/Statistics';
import ConnectEvmButton from './components/ConnectEvmButton';
import './App.css';

function App() {
  const { isUserSignedIn, userData } = useConnect();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userAddress, setUserAddress] = useState<string>('');

  useEffect(() => {
    if (isUserSignedIn && userData?.profile?.stxAddress) {
      setUserAddress(userData.profile.stxAddress.testnet);
    }
  }, [isUserSignedIn, userData]);

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1>🎓 Certifi</h1>
          <p>Blockchain-Powered Credential Verification</p>
        </div>
        <div className="header-status">
          <div className="stacks-status">
            {isUserSignedIn ? (
              <div className="user-info">
                <span className="address">{userAddress.slice(0, 10)}...</span>
                <span className="status">✅ Stacks Connected</span>
              </div>
            ) : (
              <span className="status">⚠️ Stacks Not Connected</span>
            )}
          </div>
          <div className="evm-status">
            <ConnectEvmButton />
          </div>
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
        {!isUserSignedIn ? (
          <div className="connect-prompt">
            <h2>Connect Your Wallet</h2>
            <p>Please connect your Stacks wallet to use Certifi</p>
          </div>
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
