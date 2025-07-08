"use client";

import React, { useState } from "react";
import TokenTypeSection from "../components/TokenTypeSection";
import { Globe, Terminal, Grid, ChevronDown } from "lucide-react";
import ImageUpload from "../components/ImageUpload";
import IPFSUpload from "../components/IPFSUpload";
import ConfirmButton from "@/components/ui/ConfirmButton";
import { WalletAddressButton } from "@/components/ui/WalletAddressButton";

import CreateTokenContainer from "../components/CreateTokenContainer";
import ChainSelector from "../components/ChainSelector";
import { getContractAddress } from "@/constants/constants";

export default function ERC721TokenPage() {
  const [expandedSections, setExpandedSections] = useState({
    tokenType: false,
    chain: true,
    collectionInfo: false,
    features: false,
  });

  const [selectedChainId, setSelectedChainId] = useState<string | undefined>();
  const [activeImageTab, setActiveImageTab] = useState<"local" | "ipfs">(
    "local"
  );
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [ipfsUrl, setIpfsUrl] = useState("");
  const [treasuryWallet, setTreasuryWallet] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [totalSupply, setTotalSupply] = useState("");

  const feeSettings = {
    reflectionFeeBps: 0,
    applyReflectionFeeToAll: false,
    liquidityFeeBps: 0,
    applyLiquidityFeeToAll: false,
    treasuryFeeBps: 0,
    applyTreasuryFeeToAll: false,
    burnFeeBps: 0,
    applyBurnFeeToAll: false,
  };

  // Move SectionKey type above toggleSection for proper scoping
  type SectionKey = "tokenType" | "chain" | "collectionInfo" | "features";

  const toggleSection = (section: SectionKey) => {
    setExpandedSections((prev) => {
      // Create a new state object with all sections closed
      const newState = {
        tokenType: false,
        chain: false,
        collectionInfo: false,
        features: false,
      } as Record<SectionKey, boolean>;

      // If the section was closed, open it (toggle to open)
      if (!prev[section]) {
        newState[section] = true;
      }

      return newState;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted - NFT collection creation data");
  };

  return (
    <CreateTokenContainer>
      <div className="py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-left">Create Your NFT...</h1>
          <p className="text-text-300 text-left mt-2">
            Choose the additional functionality you want your NFT to have.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Token Type Section - Show as collapsible */}
          <TokenTypeSection
            showChevron={true}
            showAsCollapsible={true}
            isExpanded={expandedSections.tokenType}
            onToggle={() => toggleSection("tokenType")}
          />

          <div className="border-y border-[#F2F5F8] bg-background-0 md:rounded-xl md:border-x p-6">
            <div
              className="flex items-center justify-between mb-4 cursor-pointer"
              onClick={() => toggleSection("chain")}
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center rounded-full bg-background-200 text-text-500 w-12 h-12">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-text-500">Chain</h2>
                  <p className="text-text-300 text-sm">
                    Select the chain for your NFT collection
                  </p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSection("chain");
                }}
                className="p-2 transition-transform"
              >
                <ChevronDown
                  className={`w-5 h-5 text-text-500 transition-transform duration-300 ${expandedSections.chain ? "rotate-180" : ""
                    }`}
                />
              </button>
            </div>

            {expandedSections.chain && (
              <div className="pt-4">
                <ChainSelector
                  chains={[
                    {
                      id: "bsc",
                      name: "BSC",
                      icon: "/chains/bsc.svg",
                      fee: "$100",
                      discountedFee: "$0",
                      isHighlighted: true,
                    },
                    {
                      id: 'opbnb',
                      name: 'opBNB',
                      icon: '/chains/bsc.svg',
                      fee: '',
                      isHighlighted: true,
                    },
                    {
                      id: "ethereum",
                      name: "Ethereum",
                      icon: "/chains/ethereum.png",
                      isHighlighted: true,
                    },
                  ]}
                  initialSelectedChainId={selectedChainId}
                  onChainSelect={setSelectedChainId}
                />
              </div>
            )}
          </div>

          <div className="border-y border-[#F2F5F8] bg-background-0 md:rounded-xl md:border-x p-6">
            <div
              className="flex items-center justify-between mb-4 cursor-pointer"
              onClick={() => toggleSection("collectionInfo")}
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center rounded-full bg-background-200 text-text-500 w-12 h-12">
                  <Terminal className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-text-500">
                    Upload your NFT images
                  </h2>
                  <p className="text-text-300 text-sm">
                    Here you can upload the images for your NFT collection
                  </p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSection("collectionInfo");
                }}
                className="p-2 transition-transform"
              >
                <ChevronDown
                  className={`w-5 h-5 text-text-500 transition-transform duration-300 ${expandedSections.collectionInfo ? "rotate-180" : ""
                    }`}
                />
              </button>
            </div>

            {expandedSections.collectionInfo && (
              <div className="pt-4">
                <div className="space-y-6">
                  <div
                    role="tablist"
                    aria-orientation="horizontal"
                    className="flex items-center gap-4"
                  >
                    <button
                      type="button"
                      role="tab"
                      aria-selected={activeImageTab === "local"}
                      className={`flex h-10 items-center justify-center rounded-md border border-background-300 px-2 text-sm font-medium text-text-500 shadow-sm transition-colors hover:bg-background-200 ${activeImageTab === "local"
                        ? "border-primary-100/50 bg-primary-300 text-white hover:border-transparent"
                        : ""
                        }`}
                      onClick={() => setActiveImageTab("local")}
                    >
                      Upload Files
                    </button>
                    <button
                      type="button"
                      role="tab"
                      aria-selected={activeImageTab === "ipfs"}
                      className={`flex h-10 items-center justify-center rounded-md border border-background-300 px-2 text-sm font-medium text-text-500 shadow-sm transition-colors hover:bg-background-200 ${activeImageTab === "ipfs"
                        ? "border-primary-100/50 bg-primary-300 text-white hover:border-transparent"
                        : ""
                        }`}
                      onClick={() => setActiveImageTab("ipfs")}
                    >
                      Import from IPFS
                    </button>
                  </div>

                  {activeImageTab === "local" ? (
                    <ImageUpload
                      multiple={true}
                      onFileSelect={(files) => setImageFiles(files as File[])}
                    />
                  ) : (
                    <IPFSUpload value={ipfsUrl} onChange={setIpfsUrl} />
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="border-y border-[#F2F5F8] bg-background-0 md:rounded-xl md:border-x p-6">
            <div
              className="flex items-center justify-between mb-4 cursor-pointer"
              onClick={() => toggleSection("features")}
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center rounded-full bg-background-200 text-text-500 w-12 h-12">
                  <Grid className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-text-500">
                    Tell us about your NFT
                  </h2>
                  <p className="text-text-300 text-sm">
                    Provide the basic information required to launch your NFT
                  </p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSection("features");
                }}
                className="p-2 transition-transform"
              >
                <ChevronDown
                  className={`w-5 h-5 text-text-500 transition-transform duration-300 ${expandedSections.features ? "rotate-180" : ""
                    }`}
                />
              </button>
            </div>

            {expandedSections.features && (
              <div className="pt-4 space-y-6">
                <div className="space-y-4">
                  <h2 className="block text-lg/[1.5] text-text-500 font-medium">
                    Information
                  </h2>

                  {/* Collection Logo Upload */}
                  <div className="space-y-2">
                    <label
                      data-optional={false}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      htmlFor="collection-logo"
                    >
                      Upload your collection logo
                    </label>
                    <ImageUpload
                      onFileSelect={(files) => setImageFiles(files as File[])}
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      data-optional={false}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      htmlFor="treasury-wallet"
                    >
                      Treasury Wallet
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        className="flex h-10 w-full items-center rounded-[10px] border bg-bg-white-0 px-3 text-sm/[1.5] placeholder:text-text-soft-400 disabled:pointer-events-none disabled:bg-bg-weak-100 disabled:opacity-60 group-[.field]:flex-1 focus-visible:ring-2 focus-visible:ring-text-main-900/40 focus-visible:ring-offset-1 focus-visible:ring-offset-bg-white-0"
                        placeholder="0x00000000000000000"
                        id="treasury-wallet"
                        value={treasuryWallet}
                        onChange={(e) => setTreasuryWallet(e.target.value)}
                      />
                      <WalletAddressButton
                        onClick={(address) => setTreasuryWallet(address)}
                      />
                    </div>
                    <p className="text-xs text-text-soft-400">
                      Pre-populated with user's wallet
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none flex items-baseline gap-1">
                      Max Supply
                      <p className="block text-text-300 text-xs/[1.5] font-normal">
                        (The max supply is the number of images you uploaded in
                        the previous step.)
                      </p>
                    </label>
                    <input
                      type="text"
                      className="flex h-10 w-full items-center rounded-[10px] border bg-bg-white-0 px-3 text-sm/[1.5] placeholder:text-text-soft-400 disabled:pointer-events-none disabled:bg-bg-weak-100 disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-text-main-900/40 focus-visible:ring-offset-1 focus-visible:ring-offset-bg-white-0"
                      placeholder="0"
                      value={totalSupply}
                      onChange={(e) => setTotalSupply(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">
                      Who can mint NFT's from your collection?
                    </label>

                    <div className="space-y-2 mb-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="peer h-4 w-4 rounded border disabled:cursor-not-allowed disabled:opacity-60 data-[state=checked]:border-transparent data-[state=checked]:bg-primary-base data-[state=checked]:text-white focus-visible:ring-2 focus-visible:ring-text-main-900/40 focus-visible:ring-offset-1 focus-visible:ring-offset-bg-white-0 shrink-0"
                        />
                        <label className="text-sm font-medium leading-none flex flex-col items-baseline gap-1 sm:flex-row">
                          Admin
                          <span className="block text-text-300 text-xs/[1.5] font-normal">
                            (Selecting this option allows you, the Admin, to
                            mint NFT's free of charge, bypassing the Mint Price)
                          </span>
                        </label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="peer h-4 w-4 rounded border disabled:cursor-not-allowed disabled:opacity-60 data-[state=checked]:border-transparent data-[state=checked]:bg-primary-base data-[state=checked]:text-white focus-visible:ring-2 focus-visible:ring-text-main-900/40 focus-visible:ring-offset-1 focus-visible:ring-offset-bg-white-0 shrink-0"
                        />
                        <label className="text-sm font-medium leading-none flex flex-col items-baseline gap-1 sm:flex-row">
                          Public
                          <span className="block text-text-300 text-xs/[1.5] font-normal">
                            (Any user can mint and be charged the Mint Price
                            specified below)
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">
                      Mint Price
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        className="flex h-10 w-full items-center rounded-[10px] border bg-bg-white-0 px-3 text-sm/[1.5] placeholder:text-text-soft-400 disabled:pointer-events-none disabled:bg-bg-weak-100 disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-text-main-900/40 focus-visible:ring-offset-1 focus-visible:ring-offset-bg-white-0"
                        placeholder="Enter Price"
                        disabled
                      />
                      <div className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center gap-0.5">
                        <p className="block text-text-300 text-xs/[1.5]">USD</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8">
            <ConfirmButton
              name={tokenName}
              symbol={tokenSymbol}
              totalSupply={totalSupply}
              router={getContractAddress(selectedChainId || 'ethereum')?.router}
              treasuryAddress={treasuryWallet}
              feeSettings={feeSettings}
              serviceFeeReceiver={getContractAddress(selectedChainId || 'ethereum')?.serviceFeeReceiver}
            />
          </div>
        </form>
      </div>
    </CreateTokenContainer>
  );
}
