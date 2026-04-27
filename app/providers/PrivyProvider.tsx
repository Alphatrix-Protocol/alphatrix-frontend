'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import AuthSync from './AuthSync';

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
      }}
    >
      <AuthSync />
      {children}
    </PrivyProvider>
  );
}