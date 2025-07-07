"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function WalletButton() {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus ||
            authenticationStatus === 'authenticated');

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              'style': {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button onClick={openConnectModal}
                    type="button"
                    style={{
                      color: 'white',              // foreground color
                      backgroundColor: '#f17b2c',  // button bg color
                      borderRadius: '8px',
                      padding: '8px 16px',
                      border: 'none',
                    }}
                  >
                    Select Wallet
                  </button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button onClick={openChainModal}
                    type="button"
                    style={{
                      color: 'white',              // foreground color
                      backgroundColor: '#f17b2c',  // button bg color
                      borderRadius: '8px',
                      padding: '8px 16px',
                      border: 'none',
                    }}
                  >
                    Wrong network
                  </button>
                );
              }

              return (
                <div style={{ display: 'flex',
                  gap: 12,
                  color: 'white',              // foreground color
                  backgroundColor: '#f17b2c',  // button bg color
                  borderRadius: '8px',
                  padding: '8px 16px',
                  border: 'none', }}
                >
                  <button onClick={openAccountModal} type="button">
                    {account.displayName}
                    {account.displayBalance
                      ? ` (${account.displayBalance})`
                      : ''}
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}
