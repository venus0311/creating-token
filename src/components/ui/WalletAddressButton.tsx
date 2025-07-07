"use client";
import { useAccount } from "wagmi";
import { useState } from "react";

export const WalletAddressButton = ({ onClick }: { onClick: (address: string) => void }) => {
  const { address, isConnected, isConnecting } = useAccount();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!isConnected || !address) return;
    setLoading(true);
    try {
      onClick(address);
    } catch (error) {
      console.error("Failed to use connected wallet:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!isConnected || loading || isConnecting}
      data-loading={loading}
      className={`group flex truncate items-center justify-center gap-2 font-medium text-sm/[1.5] outline-none transition-all disabled:pointer-events-none disabled:opacity-60 data-[loading=true]:text-transparent relative focus-visible:ring-2 focus-visible:ring-text-main-900/40 focus-visible:ring-offset-1 focus-visible:ring-offset-bg-white-0 ${isConnected ? 'bg-[#f17b2c] text-white hover:border-transparent [--spinner-border:theme(colors.white)]' : 'bg-[#f17b2c] text-white opacity-50'} h-9 px-3 rounded-lg mt-2 w-full md:absolute md:right-1 md:top-1/2 md:mt-0 md:w-fit md:-translate-y-1/2 !disabled:cursor-not-allowed z-[100]`}
    >
      Use connected wallet
      <span className="opacity-0 pointer-events-none group-data-[loading=true]:opacity-100 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity">
        <svg className="animate-spin size-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </span>
    </button>
  );
};
