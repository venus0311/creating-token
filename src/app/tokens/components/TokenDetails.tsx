import { Token } from '../api/tokenTypes';
import { getChainIcon, getBlockExplorerUrl } from '../utils/chainUtils';
import { toast } from '@/components/ui/toast';
import { copyToClipboard } from '@/utils/copyToClipboard';
import Link from 'next/link';
function truncateAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

interface TokenDetailsProps {
  token: Token;
}

export default function TokenDetails({ token }: TokenDetailsProps) {
  return (
    <div>
      <header className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-md bg-background-300 text-text-200">
            {token.logo ? (
              <img 
                src={token.logo} 
                alt={token.name} 
                className="h-full w-full object-cover object-center" 
              />
            ) : (
              <div className="flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-camera-off">
                  <line x1="2" x2="22" y1="2" y2="22"></line>
                  <path d="M7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16"></path>
                  <path d="M9.5 4h5L17 7h3a2 2 0 0 1 2 2v7.5"></path>
                  <path d="M14.121 15.121A3 3 0 1 1 9.88 10.88"></path>
                </svg>
              </div>
            )}
          </div>
          <div>
            <h1 className="text-2xl/[1.5] font-bold text-text-500 flex items-center gap-2">
              {token.name} ({token.symbol})
              <button 
              className="flex h-6 w-6 items-center justify-center rounded-md text-text-300 hover:bg-background-300"
              onClick={() => {
                copyToClipboard(token.address);
                toast({
                  title: 'Copied!',
                  description: 'Address copied to clipboard.',
                });
              }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-copy">
                  <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
                  <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
                </svg>
              </button>
            </h1>
            <div className="mt-0.5 flex items-center gap-2">
              <span className="block text-text-300 text-sm/[1.5] font-medium">{token.type}</span>
              <div className="flex items-center gap-2">
                <div className="flex h-4 w-4 items-center justify-center rounded-md bg-background-300 p-0.5">
                  <img 
                    src={getChainIcon(token.chain)} 
                    alt={token.chain} 
                    className="h-full w-full object-contain" 
                  />
                </div>
                <span className="block text-text-300 text-sm/[1.5] font-medium">{token.chain}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-0.5">
          <span className="block text-text-300 text-sm/[1.5] font-medium">Contract</span>
          <Link 
            href={`${getBlockExplorerUrl(token.chain)}/token/${token.address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm/[1.5] flex items-center gap-2 rounded-md px-2 py-1 text-text-500 hover:bg-background-300"
          >
            {truncateAddress(token.address)}
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-external-link">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" x2="21" y1="14" y2="3"></line>
            </svg>
          </Link>
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-2 mt-6">
        <div className="space-y-4 rounded-md bg-white p-6">
          <h2 className="block text-sm/[1.5] font-medium text-text-500">Supply</h2>
          <ul className="space-y-2">
            <li className="flex items-center justify-between">
              <span className="block text-text-300 text-sm/[1.5]">Total Supply</span>
              <strong className="block text-sm/[1.5] font-normal text-text-500">{token.totalSupply || 'N/A'}</strong>
            </li>
            <li className="flex items-center justify-between">
              <span className="block text-text-300 text-sm/[1.5]">Max Supply</span>
              <strong className="block text-sm/[1.5] font-normal text-text-500">{token.maxSupply}</strong>
            </li>
          </ul>
        </div>
        
        <div className="space-y-4 rounded-md bg-white p-6">
          <h2 className="block text-sm/[1.5] font-medium text-text-500">Features</h2>
          <ul className="space-y-2">
            {token.features?.map((feature, index) => (
              <li key={index} className="flex items-center justify-between">
                <span className="block text-text-300 text-sm/[1.5]">{feature.label}</span>
                <strong className="block text-sm/[1.5] font-normal text-text-500">{feature.value}</strong>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="relative rounded-md bg-white p-6 mt-6">
        <div className="mb-6">
          <h2 className="block text-lg/[1.5] font-bold text-text-500">Liquidity Pools</h2>
        </div>
        <div className="space-y-4">
          <p className="block text-text-300 text-sm/[1.5] my-5 text-center">We didn't find any pool.</p>
        </div>
      </div>
    </div>
  );
}
