"use client";

import React, { useState } from "react";
import ImageUpload from "../components/ImageUpload";
import TokenTypeSection from "../components/TokenTypeSection";
import {
  Globe,
  Terminal,
  Grid,
  ChevronDown,
  Zap,
  Flame,
  GitBranch,
  Wallet,
} from "lucide-react";

import CreateTokenContainer from "../components/CreateTokenContainer";
import ChainSelector from "../components/ChainSelector";
import FeatureCard from "../components/FeatureCard";
import TransactionFeeForm from "../components/TransactionFeeForm";
import BurnFeeForm from "../components/BurnFeeForm";
import ReflectionForm from "../components/ReflectionForm";
import BuybackLiquidityForm from "../components/BuybackLiquidityForm";
import ConfirmButton from "@/components/ui/ConfirmButton";
import { WalletAddressButton } from "@/components/ui/WalletAddressButton";
import { FeeSettings } from "@/types/feesetting";

export default function ERC20TokenPage() {
  const [expandedSections, setExpandedSections] = useState({
    tokenType: false,
    chain: true,
    tokenInfo: false,
    features: false,
  });

  const [selectedChainId, setSelectedChainId] = useState<string | undefined>(
    "bsc"
  );

  // State for form fields
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [decimalPrecision, setDecimalPrecision] = useState("");
  const [treasuryWallet, setTreasuryWallet] = useState("");
  const [initialSupply, setInitialSupply] = useState("");
  const [maxSupply, setMaxSupply] = useState("");

  // State for selected features
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  const [transactionFee, setTransactionFee] = useState<{
    feeType?: string;
    taxPercentage?: string;
  }>({});
  const feeSettings: FeeSettings = {
    treasuryFeeBps: 0,
    applyTreasuryFeeToAll: false,

    burnFeeBps: 0,
    applyBurnFeeToAll: false,

    reflectionFeeBps: 0,
    applyReflectionFeeToAll: false,

    liquidityFeeBps: 0,
    applyLiquidityFeeToAll: false
  }

  type SectionKey = "tokenType" | "chain" | "tokenInfo" | "features";

  const toggleSection = (section: SectionKey) => {
    setExpandedSections((prev) => {
      // Close all sections first
      const newState: Record<SectionKey, boolean> = {
        tokenType: false,
        chain: false,
        tokenInfo: false,
        features: false,
      };

      // If the section was closed, open it (toggle to open)
      if (!prev[section]) {
        newState[section] = true;
      }

      return newState;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted - token creation data");
  };

  return (
    <CreateTokenContainer>
      <div className="py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-left">Create a Token...</h1>
          <p className="text-text-300 text-left mt-2">
            Choose the additional functionality you want your token to have.
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

          {/* Chain Section */}
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
                    Select the chain for your token
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
                      discountedFee: "$50",
                      isHighlighted: true,
                    },
                    {
                      id: "opbnb",
                      name: "opBNB",
                      icon: "/chains/bsc.svg",
                      fee: "",
                      isHighlighted: true,
                    },
                    {
                      id: "ethereum",
                      name: "Ethereum",
                      icon: "/chains/ethereum.png",
                    },
                    // {
                    //   id: 'base',
                    //   name: 'Base',
                    //   icon: '/chains/base.svg',
                    // },
                  ]}
                  initialSelectedChainId={selectedChainId}
                  onChainSelect={setSelectedChainId}
                />
              </div>
            )}
          </div>

          {/* Tell us about your token Section */}
          <div className="border-y border-[#F2F5F8] bg-background-0 md:rounded-xl md:border-x p-6">
            <div
              className="flex items-center justify-between mb-4 cursor-pointer"
              onClick={() => toggleSection("tokenInfo")}
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center rounded-full bg-background-200 text-text-500 w-12 h-12">
                  <Terminal className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-text-500">
                    Tell us about your token
                  </h2>
                  <p className="text-text-300 text-sm">
                    Provide basic information about the token you want to
                    create.
                  </p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSection("tokenInfo");
                }}
                className="p-2 transition-transform"
              >
                <ChevronDown
                  className={`w-5 h-5 text-text-500 transition-transform duration-300 ${expandedSections.tokenInfo ? "rotate-180" : ""
                    }`}
                />
              </button>
            </div>

            {expandedSections.tokenInfo && (
              <div className="pt-4 space-y-6">
                <div className="pt-6 sm:rounded-xl sm:border sm:border-background-300 sm:p-6 space-y-4">
                  <h3 className="block text-lg/[1.5] text-text-500 font-medium">
                    Information
                  </h3>

                  {/* Image Upload */}
                  <ImageUpload onFileSelect={() => { }} />

                  <div className="space-y-2">
                    <label
                      data-optional={false}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      htmlFor="token-name"
                    >
                      Choose a name for your token
                    </label>
                    <input
                      type="text"
                      className="flex h-10 w-full items-center rounded-[10px] border bg-bg-white-0 px-3 text-sm/[1.5] placeholder:text-text-soft-400 disabled:pointer-events-none disabled:bg-bg-weak-100 disabled:opacity-60 group-[.field]:flex-1 focus-visible:ring-2 focus-visible:ring-text-main-900/40 focus-visible:ring-offset-1 focus-visible:ring-offset-bg-white-0"
                      placeholder="Floki"
                      id="token-name"
                      value={tokenName}
                      onChange={(e) => setTokenName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      data-optional={false}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      htmlFor="token-symbol"
                    >
                      Choose a symbol for your token
                    </label>
                    <input
                      type="text"
                      className="flex h-10 w-full items-center rounded-[10px] border bg-bg-white-0 px-3 text-sm/[1.5] placeholder:text-text-soft-400 disabled:pointer-events-none disabled:bg-bg-weak-100 disabled:opacity-60 group-[.field]:flex-1 focus-visible:ring-2 focus-visible:ring-text-main-900/40 focus-visible:ring-offset-1 focus-visible:ring-offset-bg-white-0"
                      placeholder="FLK"
                      id="token-symbol"
                      value={tokenSymbol}
                      onChange={(e) => setTokenSymbol(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      data-optional={false}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      htmlFor="decimal-precision"
                    >
                      Decimal precision of your token
                    </label>
                    <input
                      type="text"
                      className="flex h-10 w-full items-center rounded-[10px] border bg-bg-white-0 px-3 text-sm/[1.5] placeholder:text-text-soft-400 disabled:pointer-events-none disabled:bg-bg-weak-100 disabled:opacity-60 group-[.field]:flex-1 focus-visible:ring-2 focus-visible:ring-text-main-900/40 focus-visible:ring-offset-1 focus-visible:ring-offset-bg-white-0"
                      placeholder="Enter a number"
                      id="decimal-precision"
                      value={decimalPrecision}
                      onChange={(e) => setDecimalPrecision(e.target.value)}
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
                </div>

                <div className="pt-6 sm:rounded-xl sm:border sm:border-background-300 sm:p-6 space-y-4">
                  <h3 className="block text-lg/[1.5] text-text-500 font-medium">
                    Token Supply
                  </h3>

                  <div className="space-y-2">
                    <label
                      data-optional={false}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      htmlFor="initial-supply"
                    >
                      Initial Supply
                    </label>
                    <input
                      type="text"
                      className="flex h-10 w-full items-center rounded-[10px] border bg-bg-white-0 px-3 text-sm/[1.5] placeholder:text-text-soft-400 disabled:pointer-events-none disabled:bg-bg-weak-100 disabled:opacity-60 group-[.field]:flex-1 focus-visible:ring-2 focus-visible:ring-text-main-900/40 focus-visible:ring-offset-1 focus-visible:ring-offset-bg-white-0"
                      placeholder="Eg. 0"
                      id="initial-supply"
                      value={initialSupply}
                      onChange={(e) => setInitialSupply(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      data-optional={false}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      htmlFor="max-supply"
                    >
                      Max Supply
                    </label>
                    <input
                      type="text"
                      className="flex h-10 w-full items-center rounded-[10px] border bg-bg-white-0 px-3 text-sm/[1.5] placeholder:text-text-soft-400 disabled:pointer-events-none disabled:bg-bg-weak-100 disabled:opacity-60 group-[.field]:flex-1 focus-visible:ring-2 focus-visible:ring-text-main-900/40 focus-visible:ring-offset-1 focus-visible:ring-offset-bg-white-0"
                      placeholder="Eg. 0"
                      id="max-supply"
                      value={maxSupply}
                      onChange={(e) => setMaxSupply(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Features Section */}
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
                    Features and tokenomics
                  </h2>
                  <p className="text-text-300 text-sm">
                    Use this section to add advance features to your token e.g.
                    burn or reflection functionality. This is optional.
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
              <div className="pt-4">
                <div className="z-[1] grid gap-6 bg-white pb-4 sm:grid-cols-2 md:grid-cols-3 lg:sticky lg:top-0 lg:grid-cols-4">
                  <FeatureCard
                    title="Transaction Fee"
                    description="Add a fee on every transaction"
                    icon={<Zap className="w-5 h-5" />}
                    selected={selectedFeatures.includes("transactionFee")}
                    onToggle={() => {
                      if (selectedFeatures.includes("transactionFee")) {
                        setTransactionFee({});
                        setSelectedFeatures(
                          selectedFeatures.filter((f) => f !== "transactionFee")
                        );
                      } else {
                        setSelectedFeatures([
                          ...selectedFeatures,
                          "transactionFee",
                        ]);
                      }
                    }}
                  />
                  <FeatureCard
                    title="Burn Fee"
                    description="Burn a percentage of every transaction"
                    icon={<Flame className="w-5 h-5" />}
                    selected={selectedFeatures.includes("burnFee")}
                    onToggle={() => {
                      if (selectedFeatures.includes("burnFee")) {
                        setSelectedFeatures(
                          selectedFeatures.filter((f) => f !== "burnFee")
                        );
                      } else {
                        setSelectedFeatures([...selectedFeatures, "burnFee"]);
                      }
                    }}
                  />
                  <FeatureCard
                    title="Reflection"
                    description="Reward holders with a percentage of every transaction"
                    icon={<GitBranch className="w-5 h-5" />}
                    selected={selectedFeatures.includes("reflection")}
                    onToggle={() => {
                      if (selectedFeatures.includes("reflection")) {
                        setSelectedFeatures(
                          selectedFeatures.filter((f) => f !== "reflection")
                        );
                      } else {
                        setSelectedFeatures([
                          ...selectedFeatures,
                          "reflection",
                        ]);
                      }
                    }}
                  />
                  <FeatureCard
                    title="Buyback & Liquidity"
                    description="Automatically buyback tokens and add liquidity"
                    icon={<Wallet className="w-5 h-5" />}
                    selected={selectedFeatures.includes("buybackLiquidity")}
                    onToggle={() => {
                      if (selectedFeatures.includes("buybackLiquidity")) {
                        setSelectedFeatures(
                          selectedFeatures.filter(
                            (f) => f !== "buybackLiquidity"
                          )
                        );
                      } else {
                        setSelectedFeatures([
                          ...selectedFeatures,
                          "buybackLiquidity",
                        ]);
                      }
                    }}
                  />
                </div>

                {/* Conditionally render forms for selected features */}
                <div className="space-y-6">
                  {selectedFeatures.includes("transactionFee") && (
                    <TransactionFeeForm
                      onChange={(updatedValues) =>
                        setTransactionFee((prev) => ({
                          ...prev,
                          ...updatedValues,
                        }))
                      }
                    />
                  )}
                  {selectedFeatures.includes("burnFee") && <BurnFeeForm />}
                  {selectedFeatures.includes("reflection") && (
                    <ReflectionForm />
                  )}
                  {selectedFeatures.includes("buybackLiquidity") && (
                    <BuybackLiquidityForm />
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="mt-8">
            {/* <ConfirmButton /> */}
            <ConfirmButton
              name={tokenName}
              symbol={tokenSymbol}
              totalSupply={initialSupply}
              router="0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"
              treasuryAddress={treasuryWallet}
              feeSettings={feeSettings}
              serviceFeeReceiver="0x324BF4ae1c6ca3d28B700a6158aF203e908F0C12"
              serviceFeeEth="0.01"
              onSuccess={(txHash) => console.log("Created token in tx:", txHash)}
              onError={(err) => console.error("Token creation failed:", err)}
            />
          </div>
        </form>
      </div>
    </CreateTokenContainer>
  );
}
