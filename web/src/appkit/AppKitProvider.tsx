import React, { type ReactNode } from 'react'
import { WagmiProvider, type Config } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createAppKit } from '@reown/appkit/react'
import { mainnet, arbitrum } from '@reown/appkit/networks'
import { wagmiAdapter, projectId } from './config'

const queryClient = new QueryClient()

const metadata = {
  name: 'Certifi',
  description: 'Blockchain-Powered Credential Verification',
  url: 'https://certifi.app', // TODO: replace with real URL
  icons: ['https://avatars.githubusercontent.com/u/179229932']
}

// Initialize AppKit modal once on module load
createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [mainnet, arbitrum],
  defaultNetwork: mainnet,
  metadata,
  features: {
    analytics: true
  }
})

type Props = {
  children: ReactNode
}

export function AppKitProvider({ children }: Props) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as Config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}


