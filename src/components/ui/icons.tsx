import { LucideProps } from 'lucide-react';
import dynamic from 'next/dynamic';

export const Icons = {
  // Transaction Fee (Zap icon)
  transactionFee: dynamic(() => import('lucide-react').then((mod) => mod.Zap), {
    ssr: false,
  }),
  // Burn Fee (Flame icon)
  burnFee: dynamic(() => import('lucide-react').then((mod) => mod.Flame), {
    ssr: false,
  }),
  // Reflection (GitBranch icon)
  reflection: dynamic(() => import('lucide-react').then((mod) => mod.GitBranch), {
    ssr: false,
  }),
  // Buyback Liquidity (Wallet icon)
  buybackLiquidity: dynamic(() => import('lucide-react').then((mod) => mod.Wallet), {
    ssr: false,
  }),
};
