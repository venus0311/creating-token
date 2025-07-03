export interface Token {
  id: string;
  name: string;
  symbol: string;
  type: 'ERC20' | 'ERC721' | 'ERC1155';
  chain: string;
  logo: string;
  address: string;
  maxSupply: string;
  totalSupply?: string;
  features?: Array<{ label: string; value: string }>;
}
