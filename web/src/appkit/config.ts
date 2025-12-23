import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { mainnet, arbitrum } from '@reown/appkit/networks'

// Vite env var: define VITE_REOWN_PROJECT_ID in your .env file
// Get your project ID from: https://dashboard.reown.com
export const projectId = import.meta.env.VITE_REOWN_PROJECT_ID as string | undefined

if (!projectId) {
  console.warn('⚠️ VITE_REOWN_PROJECT_ID is not defined. WalletConnect will not work properly.')
  console.warn('   Create a .env file in the web/ directory with: VITE_REOWN_PROJECT_ID=your_project_id')
}

export const networks = [mainnet, arbitrum]

export const wagmiAdapter = new WagmiAdapter({
  projectId,
  networks
})

export const wagmiConfig = wagmiAdapter.wagmiConfig


