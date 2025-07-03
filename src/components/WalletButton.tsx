"use client";

import dynamic from "next/dynamic";
import React from "react";
import { BaseWalletMultiButton } from "@solana/wallet-adapter-react-ui";

const CUSTOM_LABELS = {
  "no-wallet": "Connect Wallet",
  "has-wallet": "Connect",
  "select-wallet": "Connect Wallet",
  "change-wallet": "Change Wallet",
  connecting: "Connecting...",
  "copy-address": "Copy Address",
  copied: "Copied!",
  disconnect: "Disconnect",
};

const WalletButton = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

interface CustomWalletButtonProps {
  disabled?: boolean;
  onDisabledClick?: () => void;
}

const CustomWalletButton = dynamic(
  () =>
    Promise.resolve(
      ({
        disabled = false,
        onDisabledClick,
      }: CustomWalletButtonProps) => (
        <div
          className={`flex items-center wallet-wrapper`}>
          <BaseWalletMultiButton
            labels={CUSTOM_LABELS}
            disabled={disabled}
          />
        </div>
      )
    ),
  { ssr: false }
);

export { CustomWalletButton, WalletButton };
export default WalletButton;
