import { useState } from 'react';
import { getChainIcon } from '../utils/chainUtils';

const CHAIN_OPTIONS = [
  'Arbitrum One',
  'BNB Smart Chain',
  'Blast',
  'Ethereum',
  'opBNB',
  'Base'
];

interface SearchFilterProps {
  onSearch: (query: string) => void;
  onChainChange: (chain: string) => void;
  hideChainFilter?: boolean; // New prop to hide chain filter
}

export default function SearchFilter({ 
  onSearch, 
  onChainChange,
  hideChainFilter = false // Default to false
}: SearchFilterProps) {
  const [searchValue, setSearchValue] = useState('');
  const [selectedChain, setSelectedChain] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div className={`grid ${hideChainFilter ? 'grid-cols-1' : 'grid-cols-[1fr_200px]'} gap-2.5`}>
      <div className="relative flex-1">
        <input
          type="search"
          placeholder="Search by token name"
          className="flex h-10 w-full items-center rounded-[10px] border bg-white px-3 text-sm placeholder:text-gray-400 disabled:pointer-events-none disabled:bg-gray-100 disabled:opacity-60 pl-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={searchValue}
          onChange={handleSearchChange}
        />
        <svg 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" 
          fill="currentColor" 
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168ZM16.0247 15.8748C17.2475 14.6146 18 12.8956 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18C12.8956 18 14.6146 17.2475 15.8748 16.0247L16.0247 15.8748Z" />
        </svg>
      </div>
      
      {!hideChainFilter && (
        <div className="relative">
          <button
            type="button"
            className="flex h-10 w-full items-center justify-between rounded-[10px] border bg-white px-3 text-sm focus:ring-2 focus:ring-blue-500"
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className="flex items-center gap-2">
              {selectedChain ? (
                <>
                  <img 
                    src={getChainIcon(selectedChain)} 
                    alt={selectedChain} 
                    className="w-4 h-4" 
                  />
                  <span>{selectedChain}</span>
                </>
              ) : (
                <span>Select a chain</span>
              )}
            </div>
            <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.9999 13.1714L16.9497 8.22168L18.3639 9.63589L11.9999 15.9999L5.63599 9.63589L7.0502 8.22168L11.9999 13.1714Z" />
            </svg>
          </button>
          {isOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
              {CHAIN_OPTIONS.map(chain => (
                <button
                  key={chain}
                  className="flex items-center gap-2 w-full text-left px-3 py-2 hover:bg-gray-100"
                  onClick={() => {
                    setSelectedChain(chain);
                    onChainChange(chain);
                    setIsOpen(false);
                  }}
                >
                  <img 
                    src={getChainIcon(chain)} 
                    alt={chain} 
                    className="w-4 h-4" 
                  />
                  <span>{chain}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
