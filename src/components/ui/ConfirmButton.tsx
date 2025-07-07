"use client";

import React, { useState } from "react";
import { useAccount, useBalance, useWriteContract } from "wagmi";
import { parseUnits, parseEther } from "viem";
import { FeeSettings } from "@/types/feesetting";

interface ConfirmButtonProps {
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  name: string;
  symbol: string;
  totalSupply: string;
  router: `0x${string}`;
  treasuryAddress: string;
  feeSettings: FeeSettings;
  serviceFeeReceiver: `0x${string}`;
  serviceFeeEth: string;
  onSuccess?: (txHash: string) => void;
  onError?: (error: any) => void;
}

const ConfirmButton: React.FC<ConfirmButtonProps> = ({
  type = "submit",
  disabled = false,
  name,
  symbol,
  totalSupply,
  router,
  treasuryAddress,
  feeSettings,
  serviceFeeReceiver,
  serviceFeeEth,
  onSuccess,
  onError,
}) => {
  const [loading, setLoading] = useState(false);
  const { address } = useAccount();

  const { writeContractAsync } = useWriteContract();

  const { data: balanceData } = useBalance({
    address,
  });

  // const tokenFactoryAddress: `0x${string}` = "0x324BF4ae1c6ca3d28B700a6158aF203e908F0C12";

  const {tokenFactoryAddress} = useAccount();
  const tokenFactoryABI = [
    {
      type: "function",
      name: "createToken",
      stateMutability: "payable",
      inputs: [
        { name: "name", type: "string" },
        { name: "symbol", type: "string" },
        { name: "totalSupply", type: "uint256" },
        { name: "router", type: "address" },
        { name: "treasuryAddress", type: "string" },
        {
          name: "feeSettings",
          type: "tuple",
          components: [
            {name: "reflectionFeeBps", type: "uint16"},
            {name: "applyReflectionFeeToAll", type: "bool"},
            {name: "liquidityFeeBps", type: "uint16"},
            {name: "applyLiquidityFeeToAll", type: "bool"},
            {name: "treasuryFeeBps", type: "uint16"},
            {name: "applyTreasuryFeeToAll", type: "bool"},
            {name: "burnFeeBps", type: "uint16"},
            {name: "applyBurnFeeToAll", type: "bool"},
          ],
        },
        { name: "serviceFeeReceiver", type: "address" },
        { name: "serviceFee", type: "uint256" },
      ],
      outputs: [{ name: "tokenAddress", type: "address" }],
    },
  ] as const;

  const handleCreate = async () => {
    try {
      setLoading(true);

      const supply = parseUnits(totalSupply, 18);
      const serviceFee = parseEther(serviceFeeEth);

      if (balanceData?.value && balanceData.value < serviceFee) {
        throw new Error("Insufficient ETH to cover the service fee.");
      }

      const hash = await writeContractAsync({
        address: tokenFactoryAddress,
        abi: tokenFactoryABI,
        functionName: "createToken",
        args: [
          name,
          symbol,
          supply,
          router,
          treasuryAddress,
          feeSettings,
          serviceFeeReceiver,
          serviceFee,
        ],
        value: serviceFee,
      });

      alert("Token created successfully!");
      onSuccess?.(hash);
    } catch (error: any) {
      console.error("Token creation error:", error);
      alert(`Failed to create token.\n${error?.shortMessage || error?.message || error}`);
      onError?.(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type={type}
      onClick={handleCreate}
      disabled={disabled || loading}
      className="group flex items-center justify-center gap-2 font-medium text-sm/[1.5] outline-none transition-all disabled:pointer-events-none disabled:opacity-60 relative bg-[#f17b2c] text-white h-10 px-[14px] rounded-[10px]"
    >
      {loading ? (
        <>
          <svg
            className="animate-spin size-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          <span>Creating...</span>
        </>
      ) : (
        "Confirm and Create Token"
      )}
    </button>
  );
};

export default ConfirmButton;
