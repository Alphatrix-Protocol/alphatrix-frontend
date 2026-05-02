'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { toSolanaWalletConnectors } from '@privy-io/react-auth/solana';
import { createSolanaRpc, createSolanaRpcSubscriptions } from '@solana/kit';

const RPC_URL = process.env.NEXT_PUBLIC_SOLANA_RPC_URL ?? 'https://api.mainnet-beta.solana.com';
const WSS_URL = RPC_URL.replace(/^https/, 'wss');

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        loginMethods: ['email', 'wallet'],
        appearance: {
          walletList: [
            'phantom',
            'solflare',
            'backpack',
            'jupiter',
            'metamask',
            'wallet_connect_qr_solana',
            'detected_solana_wallets',
          ],
        },
        embeddedWallets: {
          solana: {
            createOnLogin: 'users-without-wallets',
          },
        },
        // Required in v3 for Solana embedded wallets to initialise correctly
        solana: {
          rpcs: {
            'solana:mainnet': {
              rpc:              createSolanaRpc(RPC_URL),
              rpcSubscriptions: createSolanaRpcSubscriptions(WSS_URL),
            },
          },
        },
        externalWallets: {
          solana: {
            connectors: toSolanaWalletConnectors(),
          },
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
