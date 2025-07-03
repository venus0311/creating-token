import React from 'react';

interface ChainCardProps {
  id: string;
  name: string;
  icon: string;
  isHighlighted?: boolean;
  fee?: string;
  discountedFee?: string;
  isSelected?: boolean;
  onClick?: () => void;
}

const ChainCard: React.FC<ChainCardProps> = ({ 
  id, 
  name, 
  icon, 
  isHighlighted = false, 
  fee, 
  discountedFee, 
  isSelected = false,
  onClick 
}) => {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={isSelected}
      data-state={isSelected ? 'checked' : 'unchecked'}
      className={`group flex items-center gap-4 rounded-lg border border-[#F2F5F8] p-4 text-start transition-colors data-[state=checked]:border-[#f17b2c] w-full`}
      onClick={onClick}
    >
      <div className="flex size-12 shrink-0 items-center justify-center rounded-full border border-[#F2F5F8]">
        <img src={icon} alt={name} className="size-6 rounded-full" />
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex flex-wrap items-center gap-1">
          <strong className="block font-medium tracking-[-0.006em] text-[14px]/[1.42]">{name}</strong>
          {isHighlighted && (
            <span className="block font-medium tracking-normal text-[12px]/[1.33] rounded-full bg-[#CBF5E5] px-2 py-0.5 uppercase text-[#176448]">Highlighted</span>
          )}
        </div>
        {fee && (
          <span className="font-normal tracking-normal text-[12px]/[1.33] flex items-center gap-1">
            Fee: 
            {discountedFee ? (
              <>
                <span className="line-through">{fee}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-3">
                  <line x1="5" x2="19" y1="12" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
                <span>{discountedFee}</span>
              </>
            ) : (
              <span>{fee}</span>
            )}
          </span>
        )}
      </div>
      <div className="relative flex size-4 items-center justify-center rounded-full border border-[#aaaaaa] transition-colors group-data-[state=checked]:border-[#f17b2c] group-data-[state=checked]:bg-primary-base group-data-[state=checked]:border-[5px]">
        <div className="absolute size-1.5 rounded-full bg-transparent group-data-[state=checked]:bg-white"></div>
      </div>
    </button>
  );
};

export default ChainCard;
