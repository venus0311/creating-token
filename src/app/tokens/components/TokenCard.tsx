import { Token } from '../api/tokenTypes';
import { getChainIcon, getChainId } from '../utils/chainUtils';
import Link from 'next/link';

interface TokenCardProps {
  token: Token;
}

export default function TokenCard({ token }: TokenCardProps) {
  return (
    <div className="space-y-4 rounded-md border border-background-300 bg-white p-4">
      <div className="flex items-center gap-4">
        {token.logo ? (
          <img
            src={token.logo}
            alt={token.name}
            className="h-11 w-11 overflow-hidden rounded-md object-cover object-center"
          />
        ) : (
          <div className="flex h-11 w-11 items-center justify-center rounded-md bg-background-300 text-text-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-camera-off w-8 h-8">
              <line x1="2" x2="22" y1="2" y2="22"></line>
              <path d="M7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16"></path>
              <path d="M9.5 4h5L17 7h3a2 2 0 0 1 2 2v7.5"></path>
              <path d="M14.121 15.121A3 3 0 1 1 9.88 10.88"></path>
            </svg>
          </div>
        )}
        <div className="flex-1">
          <h2 className="block text-sm/[1.5] font-medium text-text-500">{token.name} ({token.symbol})</h2>
          <div className="flex items-center gap-2">
            <div className="relative flex size-4 items-center justify-center rounded-md bg-background-300">
              <img 
                src={getChainIcon(token.chain)} 
                alt={token.chain} 
                className="absolute inset-0 object-cover w-4 h-4" 
              />
            </div>
            <p className="block text-text-300 text-sm/[1.5] font-medium">{token.chain}</p>
          </div>
        </div>
      </div>

      <hr className="border-t border-background-300" />

      <div className="space-y-2">
        <p className="block text-sm/[1.5] font-medium text-text-500">Details</p>
        <ul className="space-y-2">
          <li className="flex items-center justify-between">
            <span className="block text-xs/[1.5] text-text-500">Contract</span>
            <span className="block text-text-300 text-sm/[1.5]">{token.type}</span>
          </li>
          <li className="flex items-center justify-between">
            <span className="block text-xs/[1.5] text-text-500">Symbol</span>
            <span className="block text-text-300 text-sm/[1.5]">{token.symbol}</span>
          </li>
          <li className="flex items-center justify-between">
            <span className="block text-xs/[1.5] text-text-500">Max Supply</span>
            <span className="block text-text-300 text-sm/[1.5]">{token.maxSupply}</span>
          </li>
        </ul>
      </div>

      <Link 
        href={`/token?type=${token.type.toLowerCase()}&address=${token.address}&chain=${getChainId(token.chain)}`}
        className="group flex truncate items-center justify-center gap-2 font-medium text-sm/[1.5] outline-none transition-all disabled:pointer-events-none disabled:opacity-60 data-[loading=true]:text-transparent relative focus-visible:ring-2 focus-visible:ring-text-main-900/40 focus-visible:ring-offset-1 focus-visible:ring-offset-bg-white-0 bg-bg-white-0 border text-text-sub-500 hover:bg-bg-weak-100 hover:border-transparent hover:text-text-main-900 h-10 px-[14px] rounded-[10px]"
      >
        View Details
      </Link>
    </div>
  );
}
