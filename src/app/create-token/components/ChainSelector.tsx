import React, { useState } from 'react';
import ChainCard from './ChainCard';

interface Chain {
  id: string;
  name: string;
  icon: string;
  isHighlighted?: boolean;
  fee?: string;
  discountedFee?: string;
}

interface ChainSelectorProps {
  chains: Chain[];
  initialSelectedChainId?: string;
  onChainSelect: (chainId: string) => void;
}

const ChainSelector: React.FC<ChainSelectorProps> = ({
  chains,
  initialSelectedChainId,
  onChainSelect,
}) => {
  const [selectedChainId, setSelectedChainId] = useState<string | undefined>(initialSelectedChainId);
  const [showAll, setShowAll] = useState<boolean>(false);

  const visibleChains = showAll ? chains : chains.slice(0, 3);

  const handleSelect = (chainId: string) => {
    setSelectedChainId(chainId);
    onChainSelect(chainId);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {visibleChains.map((chain) => (
          <ChainCard
            key={chain.id}
            id={chain.id}
            name={chain.name}
            icon={chain.icon}
            isHighlighted={chain.isHighlighted}
            fee={chain.fee}
            discountedFee={chain.discountedFee}
            isSelected={selectedChainId === chain.id}
            onClick={() => handleSelect(chain.id)}
          />
        ))}
      </div>

      {chains.length > 3 && (
        <button
          type="button"
          className="group relative flex w-full items-center justify-center after:absolute after:inset-x-0 after:top-1/2 after:h-px after:-translate-y-1/2 after:bg-[#ccc] after:content-['']"
          onClick={() => setShowAll(!showAll)}
          data-active={showAll}
        >
          <span className="font-medium tracking-[-0.006em] text-[14px]/[1.42] relative z-[2] flex h-8 items-center gap-1 rounded-md border bg-white px-3">
            {showAll ? 'Show less' : 'Show more'}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4 transition-all group-data-[active=true]:rotate-180">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </span>
        </button>
      )}
    </div>
  );
};

export default ChainSelector;
