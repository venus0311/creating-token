import { Token } from './tokenTypes';
import { getChainNameById } from '../utils/chainUtils';

export const ERC20Tokens: Token[] = [
  {
    id: '1',
    name: 'Catmelon',
    symbol: 'CATMELON',
    type: 'ERC20',
    chain: 'Arbitrum One',
    logo: '',
    address: '0x7bABe27e50E20FadB60a4C6B87359Ce4Ec57C88F',
    maxSupply: '1000000000',
    totalSupply: '500000000',
    features: [
      { label: 'Transaction Fee', value: '(on every transfer) 5%' },
      { label: 'Buyback Liquidity', value: '(on every transfer) 5%' }
    ]
  },
  {
    id: '2',
    name: 'Genesis AI',
    symbol: 'GENAI',
    type: 'ERC20',
    chain: 'Ethereum',
    logo: '',
    address: '0x04F07636BE75CaE08605487b8C38E2a77EDD653C',
    maxSupply: '69420000000',
    totalSupply: '34710000000',
    features: [
      { label: 'AI Model', value: 'GPT-5' },
      { label: 'Training Data', value: '1.2TB' }
    ]
  },
  {
    id: '3',
    name: 'Lore Inu',
    symbol: 'LORE',
    type: 'ERC20',
    chain: 'BNB Smart Chain',
    logo: '',
    address: '0x8711A623d6aE391bE372E7Ff3d019EcE5aF4749D',
    maxSupply: '1000',
    totalSupply: '500',
    features: [
      { label: 'Meme Coin', value: 'Yes' },
      { label: 'Community Driven', value: 'Yes' }
    ]
  },
  {
    id: '4',
    name: 'Service Token',
    symbol: 'SRV',
    type: 'ERC20',
    chain: 'opBNB',
    logo: '',
    address: '0x057ba66c2109Fd4487F0781E0203B71fd77a6341',
    maxSupply: '21000000',
    totalSupply: '10500000',
    features: [
      { label: 'Service Fee', value: '2%' },
      { label: 'Rewards', value: '5%' }
    ]
  },
  {
    id: '5',
    name: 'Election Coin',
    symbol: 'ELCT',
    type: 'ERC20',
    chain: 'Base',
    logo: '',
    address: '0x7474332666DE4aaEc2A2C1C771Ec93F2d2EA132B',
    maxSupply: '1000000000',
    totalSupply: '500000000',
    features: [
      { label: 'Governance', value: 'Voting Rights' },
      { label: 'Transparency', value: 'Blockchain Based' }
    ]
  },
  {
    id: '6',
    name: 'BuySellTax',
    symbol: 'BST',
    type: 'ERC20',
    chain: 'Blast',
    logo: '',
    address: '0xA2241919498c98075887c7CeE3a3C41c8C6b9A2d',
    maxSupply: '100000000000',
    totalSupply: '50000000000',
    features: [
      { label: 'Buy Tax', value: '5%' },
      { label: 'Sell Tax', value: '10%' }
    ]
  }
];

export const ERC721Tokens: Token[] = [
  {
    id: '101',
    name: 'Example NFT 1',
    symbol: 'ENFT1',
    type: 'ERC721',
    chain: 'Base',
    logo: '',
    address: '0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB',
    maxSupply: '10000',
    features: [
      { label: 'Feature C', value: 'Value C' },
      { label: 'Feature D', value: 'Value D' }
    ]
  }
];

export const ERC1155Tokens: Token[] = [
  {
    id: '201',
    name: 'Example Multi Token',
    symbol: 'EMT',
    type: 'ERC1155',
    chain: 'Blast',
    logo: '',
    address: '0x76BE3b62873462d2142405439777e971754E8E77',
    maxSupply: '1000000',
    features: [
      { label: 'Feature E', value: 'Value E' },
      { label: 'Feature F', value: 'Value F' }
    ]
  }
];

export function getTokenByAddress(address: string, chainId: string): Token | undefined {
  const chainName = getChainNameById(chainId);
  const allTokens = [...ERC20Tokens, ...ERC721Tokens, ...ERC1155Tokens];
  return allTokens.find(token => token.address.toLowerCase() === address.toLowerCase() && token.chain === chainName);
}
