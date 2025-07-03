export function getChainIcon(chainName: string): string {
  const icons: Record<string, string> = {
    'Arbitrum One': '/chains/arbitrum.svg',
    'BNB Smart Chain': '/chains/bsc.svg',
    'Blast': '/chains/blast.png',
    'Ethereum': '/chains/ethereum.png',
    'opBNB': '/chains/bsc.svg',
    'Base': '/chains/base.svg'
  };
  
  return icons[chainName] || '/chains/default.svg';
}

export function getChainId(chainName: string): string {
  const chainIds: Record<string, string> = {
    'Arbitrum One': '42161',
    'BNB Smart Chain': '56',
    'Blast': '81457',
    'Ethereum': '1',
    'opBNB': '204',
    'Base': '8453'
  };
  
  return chainIds[chainName] || '';
}

export function getChainNameById(chainId: string): string {
  const chainMap: Record<string, string> = {
    '42161': 'Arbitrum One',
    '56': 'BNB Smart Chain',
    '81457': 'Blast',
    '1': 'Ethereum',
    '204': 'opBNB',
    '8453': 'Base'
  };
  
  return chainMap[chainId] || '';
}

export function getBlockExplorerUrl(chainName: string): string {
  const explorers: Record<string, string> = {
    'Arbitrum One': 'https://arbiscan.io',
    'BNB Smart Chain': 'https://bscscan.com',
    'Blast': 'https://blastscan.io',
    'Ethereum': 'https://etherscan.io',
    'opBNB': 'https://opbnbscan.com',
    'Base': 'https://basescan.org'
  };
  
  return explorers[chainName] || '';
}
