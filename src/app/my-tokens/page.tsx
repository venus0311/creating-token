"use client";

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import WalletButton from '@/components/WalletButton';
import SearchFilter from '@/app/tokens/components/SearchFilter';
import TokenGrid from '@/app/tokens/components/TokenGrid';
import { ERC20Tokens } from '@/app/tokens/api/mockTokens';

// Debug variable to simulate user having created tokens
const user_has_created_tokens = true;

export default function MyTokensPage() {
  const { connected } = useWallet();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter user's tokens based on search query
  const myTokens = ERC20Tokens.slice(0, 3); // First 3 tokens as mock data
  const filteredTokens = myTokens.filter(token => 
    token.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4">
      <h1 className="block text-2xl/[1.5] font-bold text-text-500">My Tokens</h1>
      <p className="block text-text-300 text-sm/[1.5]">
        Here is an overview of tokens you created.
      </p>
      
      {/* Conditional section */}
      {connected ? (
        user_has_created_tokens ? (
          <>
            <div className="mt-6">
              <SearchFilter 
                onSearch={setSearchQuery}
                onChainChange={() => {}} // Not used in this view
                hideChainFilter={true} // Hide chain filter for My Tokens
              />
            </div>
            <div className="mt-6">
              <TokenGrid tokens={filteredTokens} />
            </div>
          </>
        ) : (
          <div className="relative rounded-md bg-white p-6 mt-6 text-center">
            <p className="py-10 text-text-500 text-lg">
              You have not created any tokens yet!
            </p>
          </div>
        )
      ) : (
        <div className="relative rounded-md bg-white p-6 mt-6">
          <div className="flex items-center justify-center">
            <div className="flex flex-col items-center gap-5 py-10">
              {/* Wallet icon */}
              <div className="flex items-center justify-center rounded-full bg-gray-200 text-gray-500 w-14 h-14">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-wallet">
                  <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"></path>
                  <path d="M4 6v12c0 1.1.9-2 2-2h14v-4"></path>
                  <path d="M18 12a2 2 0 0 0-2 2c0 1.1.9-2 2-2h4v-4h-4z"></path>
                </svg>
              </div>
              
              {/* Text content */}
              <div className="flex max-w-[360px] flex-col items-center gap-2 text-center">
                <h2 className="block text-2xl/[1.5] font-bold text-text-500">Please connect your wallet</h2>
                <p className="block text-text-300 text-sm/[1.5]">
                  After connecting your wallet you will be able to see all tokens you have created.
                </p>
              </div>
              
              {/* Wallet button */}
              <WalletButton />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
