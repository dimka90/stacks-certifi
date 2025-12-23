import React, { useState } from 'react';
import { useConnect } from '@stacks/connect-react';
import { StacksTestnet } from '@stacks/network';

const ConnectStacksButton: React.FC = () => {
  const { isOpen, openConnectModal, isAuthenticated, disconnect, userData } = useConnect();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      await openConnectModal({
        appDetails: {
          name: 'Certifi',
          icon: window.location.origin + '/favicon.ico',
        },
        network: StacksTestnet,
        onFinish: () => {
          setIsConnecting(false);
        },
        onCancel: () => {
          setIsConnecting(false);
        },
      });
    } catch (error) {
      console.error('Error connecting Stacks wallet:', error);
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
    } catch (error) {
      console.error('Error disconnecting Stacks wallet:', error);
    }
  };

  if (isAuthenticated && userData) {
    const address = userData.profile?.stxAddress?.testnet || userData.profile?.stxAddress?.mainnet || '';
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '12px', color: '#666' }}>
          {address.slice(0, 6)}...{address.slice(-4)}
        </span>
        <button
          onClick={handleDisconnect}
          style={{
            padding: '8px 16px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          Disconnect Stacks
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleConnect}
      disabled={isConnecting || isOpen}
      style={{
        padding: '8px 16px',
        backgroundColor: isConnecting ? '#ccc' : '#5546FF',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: isConnecting ? 'not-allowed' : 'pointer',
        fontSize: '14px',
      }}
    >
      {isConnecting ? 'Connecting...' : 'Connect Stacks'}
    </button>
  );
};

export default ConnectStacksButton;

