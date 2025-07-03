import TokenCard from './TokenCard';
import { Token } from '../api/tokenTypes';

interface TokenGridProps {
  tokens: Token[];
}

export default function TokenGrid({ tokens }: TokenGridProps) {
  if (tokens.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500">No tokens found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {tokens.map(token => (
        <TokenCard key={token.id} token={token} />
      ))}
    </div>
  );
}
