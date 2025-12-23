import React, { useState } from 'react';
import { validateAddress } from '../lib/contract-utils';
import './WalletConnect.css';

interface WalletConnectProps {
  onConnect: (address: string) => void;
}

function WalletConnect({ onConnect }: WalletConnectProps) {
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = async () => {
    setError('');

    if (!address.trim()) {
      setError('Please enter a Stacks address');
      return;
    }

    if (!validateAddress(address)) {
      setError('Invalid Stacks address. Must start with SP (testnet) or SM (mainnet)');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate connection delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      onConnect(address);
    } catch (err) {
      setError('Failed to connect wallet');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleConnect();
    }
  };

  return (
    <div className="wallet-connect">
      <div className="wallet-card">
        <div className="wallet-icon">🔐</div>
        <h2>Connect Your Wallet</h2>
        <p>Enter your Stacks address to get started with Certifi</p>

        <div className="input-group">
          <input
            type="text"
            placeholder="SP... or SM..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            className="wallet-input"
          />
          {error && <p className="error-message">{error}</p>}
        </div>

        <button
          className="btn btn-primary btn-large"
          onClick={handleConnect}
          disabled={isLoading || !address.trim()}
        >
          {isLoading ? 'Connecting...' : 'Connect Wallet'}
        </button>

        <div className="wallet-info">
          <p className="info-title">📝 Address Format:</p>
          <ul>
            <li><strong>Testnet:</strong> SP followed by 32 characters</li>
            <li><strong>Mainnet:</strong> SM followed by 32 characters</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default WalletConnect;
