"use client";

import { TokenType } from '../tokenTypes';
import { Layers, Image, Boxes } from 'lucide-react';

const iconComponents: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  Layers: Layers,
  Image: Image,
  Grid: Boxes
};
import { usePathname } from 'next/navigation';

export default function TokenTypeCard({ 
  title, 
  description, 
  href,
  iconName 
}: TokenType) {
  const Icon = iconComponents[iconName];
  const pathname = usePathname();
  const isActive = pathname === href;
  
  return (
    <a
      href={href}
      className={`block space-y-2 rounded-xl border bg-background-0 p-6 transition-colors hover:border-primary-300 ${
        isActive 
          ? 'border-primary-300' 
          : 'border-background-300'
      }`}
    >
      <h3 className="block text-sm/[1.5] font-bold text-text-500">{title}</h3>
      <p className="block text-text-300 text-sm/[1.5]">{description}</p>
    </a>
  );
}
