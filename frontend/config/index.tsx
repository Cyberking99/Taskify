
import { cookieStorage, createStorage, http } from '@wagmi/core'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { celoSepolia } from '@reown/appkit/networks'
import { PROJECT_ID } from '@/lib/constants'

// Get projectId from https://cloud.reown.com
export const projectId = PROJECT_ID

if (!projectId) {
    throw new Error('Project ID is not defined')
}

export const networks = [celoSepolia]

//Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
    storage: createStorage({
        storage: cookieStorage
    }),
    ssr: true,
    projectId,
    networks
})

export const config = wagmiAdapter.wagmiConfig
