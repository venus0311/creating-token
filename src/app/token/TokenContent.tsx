'use client';

import { useSearchParams } from 'next/navigation';
import TokenDetails from '../tokens/components/TokenDetails';
import { getTokenByAddress } from '../tokens/api/mockTokens';

export default function TokenContent() {
  const searchParams = useSearchParams();
  const address = searchParams.get('address');
  const chainId = searchParams.get('chain');

  if (!address || !chainId) {
    return <div>Token not found</div>;
  }

  const token = getTokenByAddress(address, chainId);
  
  if (!token) {
    return <div>Token not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <TokenDetails token={token} />
    </div>
  );
}
