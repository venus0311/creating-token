"use client";

import React, { useState } from 'react';
import TokenTypeSection from '../components/TokenTypeSection';
import ImageUpload from '../components/ImageUpload';
import { Globe, Terminal, Grid, ChevronDown } from 'lucide-react';
import { WalletAddressButton } from '@/components/ui/WalletAddressButton';

import CreateTokenContainer from '../components/CreateTokenContainer';
import ChainSelector from '../components/ChainSelector';
import ConfirmButton from '@/components/ui/ConfirmButton';

export default function ERC1155TokenPage() {
  const [expandedSections, setExpandedSections] = useState({
    tokenType: false,
    chain: true,
    multiTokenInfo: false,
    features: false
  });

  const [selectedChainId, setSelectedChainId] = useState<string | undefined>();
  const [treasuryWallet, setTreasuryWallet] = useState('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  type SectionKey = 'tokenType' | 'chain' | 'multiTokenInfo' | 'features';
  
  const toggleSection = (section: SectionKey) => {
    setExpandedSections(prev => {
      // Create a new state object with all sections closed
      const newState = {
        tokenType: false,
        chain: false,
        multiTokenInfo: false,
        features: false
      } as Record<SectionKey, boolean>;
      
      // If the section was closed, open it (toggle to open)
      if (!prev[section]) {
        newState[section] = true;
      }
      
      return newState;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted - multi-token creation data');
  };

  return (
    <CreateTokenContainer>
      <div className="py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-left">Create your ERC-1155 token...</h1>
        <p className="text-text-300 text-left mt-2">
          Choose the additional functionality you want your ERC-1155 token to have.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Token Type Section - Show as collapsible */}
        <TokenTypeSection 
          showChevron={true}
          showAsCollapsible={true}
          isExpanded={expandedSections.tokenType}
          onToggle={() => toggleSection('tokenType')}
        />
        
        <div className="border-y border-[#F2F5F8] bg-background-0 md:rounded-xl md:border-x p-6">
          <div 
            className="flex items-center justify-between mb-4 cursor-pointer"
            onClick={() => toggleSection('chain')}
          >
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center rounded-full bg-background-200 text-text-500 w-12 h-12">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-text-500">Chain</h2>
                <p className="text-text-300 text-sm">Select the chain for your multi-token project</p>
              </div>
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                toggleSection('chain');
              }}
              className="p-2 transition-transform"
            >
              <ChevronDown 
                className={`w-5 h-5 text-text-500 transition-transform duration-300 ${expandedSections.chain ? 'rotate-180' : ''}`} 
              />
            </button>
          </div>
          
          {expandedSections.chain && (
            <div className="pt-4">
              <ChainSelector
                chains={[
                  {
                    id: 'bsc',
                    name: 'BSC',
                    icon: '/chains/bsc.svg',
                    fee: '$100',
                    discountedFee: '$0',
                    isHighlighted: true,
                  },
                  {
                    id: 'opbnb',
                    name: 'opBNB',
                    icon: '/chains/bsc.svg',
                    fee: '',
                    isHighlighted: true,
                  },
                  {
                    id: 'ethereum',
                    name: 'Ethereum',
                    icon: '/chains/ethereum.png',
                  },
                ]}
                initialSelectedChainId={selectedChainId}
                onChainSelect={setSelectedChainId}
              />
            </div>
          )}
        </div>
        
        {/* Tell us about your ERC-1155 token Section */}
        <div className="border-y border-[#F2F5F8] bg-background-0 md:rounded-xl md:border-x p-6">
          <div 
            className="flex items-center justify-between mb-4 cursor-pointer"
            onClick={() => toggleSection('multiTokenInfo')}
          >
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center rounded-full bg-background-200 text-text-500 w-12 h-12">
                <Terminal className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-text-500">Tell us about your ERC-1155 token</h2>
                <p className="text-text-300 text-sm">Choose the additional functionality you want your ERC-1155 token to have.</p>
              </div>
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                toggleSection('multiTokenInfo');
              }}
              className="p-2 transition-transform"
            >
              <ChevronDown 
                className={`w-5 h-5 text-text-500 transition-transform duration-300 ${expandedSections.multiTokenInfo ? 'rotate-180' : ''}`} 
              />
            </button>
          </div>
          
          {expandedSections.multiTokenInfo && (
            <div className="pt-4 space-y-6">
              <div className="pt-6 sm:rounded-xl sm:border sm:border-background-300 sm:p-6 space-y-4">
                <h3 className="block text-lg/[1.5] text-text-500 font-medium">Information</h3>
                
                {/* Collection Logo Upload */}
                <div className="space-y-2">
                  <label data-optional={false} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="collection-logo">
                    Upload your collection logo
                  </label>
                  <ImageUpload onFileSelect={(files) => setImageFiles(files as File[])} />
                </div>
                
                <div className="space-y-2">
                  <label data-optional={false} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="token-name">
                    Choose a name for your token
                  </label>
                  <input 
                    type="text" 
                    className="flex h-10 w-full items-center rounded-[10px] border bg-bg-white-0 px-3 text-sm/[1.5] placeholder:text-text-soft-400 disabled:pointer-events-none disabled:bg-bg-weak-100 disabled:opacity-60 group-[.field]:flex-1 focus-visible:ring-2 focus-visible:ring-text-main-900/40 focus-visible:ring-offset-1 focus-visible:ring-offset-bg-white-0" 
                    placeholder="Floki" 
                    id="token-name"
                  />
                </div>
                
                <div className="space-y-2">
                  <label data-optional={false} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="token-symbol">
                    Choose a symbol for your token
                  </label>
                  <input 
                    type="text" 
                    className="flex h-10 w-full items-center rounded-[10px] border bg-bg-white-0 px-3 text-sm/[1.5] placeholder:text-text-soft-400 disabled:pointer-events-none disabled:bg-bg-weak-100 disabled:opacity-60 group-[.field]:flex-1 focus-visible:ring-2 focus-visible:ring-text-main-900/40 focus-visible:ring-offset-1 focus-visible:ring-offset-bg-white-0" 
                    placeholder="FLK" 
                    id="token-symbol"
                  />
                </div>
                
                <div className="space-y-2">
                  <label data-optional={false} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="treasury-wallet">
                    Treasury Wallet
                  </label>
                  <div className="relative">
                    <input 
                      type="text" 
                      className="flex h-10 w-full items-center rounded-[10px] border bg-bg-white-0 px-3 text-sm/[1.5] placeholder:text-text-soft-400 disabled:pointer-events-none disabled:bg-bg-weak-100 disabled:opacity-60 group-[.field]:flex-1 focus-visible:ring-2 focus-visible:ring-text-main-900/40 focus-visible:ring-offset-1 focus-visible:ring-offset-bg-white-0" 
                      placeholder="0x00000000000000000" 
                      id="treasury-wallet"
                      value={treasuryWallet}
                      onChange={(e) => setTreasuryWallet(e.target.value)}
                    />
                    <WalletAddressButton 
                      onClick={(address) => setTreasuryWallet(address)} 
                    />
                  </div>
                  <p className="text-xs text-text-soft-400">Pre-populated with user's wallet</p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Upload an Image For Your ERC-1155 Token Section */}
        <div className="border-y border-[#F2F5F8] bg-background-0 md:rounded-xl md:border-x p-6">
          <div 
            className="flex items-center justify-between mb-4 cursor-pointer"
            onClick={() => toggleSection('features')}
          >
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center rounded-full bg-background-200 text-text-500 w-12 h-12">
                <Grid className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-text-500">Upload an Image For Your ERC-1155 Token</h2>
                <p className="text-text-300 text-sm">Here you can upload the images for your ERC-1155 token.</p>
              </div>
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                toggleSection('features');
              }}
              className="p-2 transition-transform"
            >
              <ChevronDown 
                className={`w-5 h-5 text-text-500 transition-transform duration-300 ${expandedSections.features ? 'rotate-180' : ''}`} 
              />
            </button>
          </div>
          
          {expandedSections.features && (
            <div className="pt-4">
              <ImageUpload onFileSelect={() => {}} />
            </div>
          )}
        </div>
        
        <div className="mt-8">
          <ConfirmButton />
        </div>
      </form>
      </div>
    </CreateTokenContainer>
  );
}
