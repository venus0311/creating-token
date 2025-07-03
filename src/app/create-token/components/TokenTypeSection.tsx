import React from 'react';
import { Layers, ChevronDown } from 'lucide-react';
import { tokenTypes } from '../tokenTypes';
import TokenTypeCard from './TokenTypeCard';

interface TokenTypeSectionProps {
  showChevron?: boolean;
  isExpanded?: boolean;
  onToggle?: () => void;
  showAsCollapsible?: boolean;
}

export default function TokenTypeSection({ 
  showChevron = false, 
  isExpanded = true,
  onToggle,
  showAsCollapsible = false
}: TokenTypeSectionProps) {
  return (
    <div className="space-y-6 rounded-md bg-background-0 p-6">
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-center gap-2.5 md:gap-6">
          <div className="flex items-center justify-center rounded-full bg-background-200 text-text-500 w-14 h-14 [&>svg]:w-5 shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="block text-lg/[1.5] font-bold text-text-500">Token Type</h2>
            <p className="block text-text-300 text-sm/[1.5]">Choose the type of token you're creating</p>
          </div>
        </div>
        
        {showChevron && (
          <button 
            onClick={onToggle}
            className="flex items-center justify-center p-2 transition-transform"
            aria-expanded={isExpanded}
          >
            <ChevronDown 
              className={`w-5 h-5 text-text-500 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
            />
          </button>
        )}
      </div>
      
      {(!showAsCollapsible || isExpanded) && (
        <div className="grid gap-6 md:grid-cols-3">
          {tokenTypes.map((type, index) => (
            <TokenTypeCard 
              key={index} 
              title={type.title} 
              description={type.description} 
              href={type.href} 
              iconName={type.iconName} 
            />
          ))}
        </div>
      )}
    </div>
  );
}
