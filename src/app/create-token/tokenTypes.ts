import React from 'react';
import { Layers, Image, Boxes } from 'lucide-react';

export interface TokenType {
  title: string;
  description: string;
  href: string;
  iconName: string;
}

export const tokenTypes: TokenType[] = [
  {
    title: "Launch a Fungible Token (ERC-20)",
    description: "Select this option to launch your own cryptocurrency, like FLOKI.",
    href: "/create-token/erc20",
    iconName: "Layers",
  },
  {
    title: "Launch an NFT project (ERC-721)",
    description: "A non-fungible token (NFT) is a special type of crypto asset that can represent collectibles such as art, music, and game items",
    href: "/create-token/erc721",
    iconName: "Image",
  },
  {
    title: "Launch a Multi-Token Project (ERC-1155)",
    description: "The ERC-1155 standard allows you to create multiple token types, both fungible and non-fungible, in one contract.",
    href: "/create-token/erc1155",
    iconName: "Grid",
  },
];
