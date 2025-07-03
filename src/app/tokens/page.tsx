"use client";

import { useState } from 'react';
import Tabs from './components/Tabs';
import SearchFilter from './components/SearchFilter';
import TokenGrid from './components/TokenGrid';
import { ERC20Tokens, ERC721Tokens, ERC1155Tokens } from './api/mockTokens';

const tabItems = [
  { id: 'erc20', label: 'ERC20' },
  { id: 'erc721', label: 'ERC721' },
  { id: 'erc1155', label: 'ERC1155' }
];

export default function TokensPage() {
  const [activeTab, setActiveTab] = useState('erc20');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChain, setSelectedChain] = useState('');

  const getTokensForTab = () => {
    switch (activeTab) {
      case 'erc20': return ERC20Tokens;
      case 'erc721': return ERC721Tokens;
      case 'erc1155': return ERC1155Tokens;
      default: return [];
    }
  };

  const tokens = getTokensForTab().filter(token => {
    const matchesSearch = token.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          token.symbol.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesChain = selectedChain ? token.chain === selectedChain : true;
    return matchesSearch && matchesChain;
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Tokens</h1>
      <p className="text-gray-600 mb-6">
        Browse tokens created on Token Launcher
      </p>
      
      <Tabs 
        items={tabItems} 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />
      
      <div className="mt-6">
        <SearchFilter 
          onSearch={setSearchQuery}
          onChainChange={setSelectedChain}
        />
      </div>
      
      <div className="mt-6">
        <TokenGrid tokens={tokens} />
      </div>
    </div>
  );
}
