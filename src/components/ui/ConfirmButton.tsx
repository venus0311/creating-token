"use client";

import React, { useState } from "react";
import { useAccount, useBalance, usePublicClient, useReadContract, useWalletClient, useWriteContract } from "wagmi";
import { parseUnits, parseEther, formatEther } from "viem";
import { FeeSettings } from "@/types/feesetting";
import FeeReceiverAbi from "@/json/FeeReceiverAbi.json";
import RexasErc20 from "@/json/RexasErc20.json";
import { toast } from "./toast";

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
  onSuccess,
  onError,
}) => {
  const [loading, setLoading] = useState(false);
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  const { data, isFetched: isFetchedServiceFee } = useReadContract({
    abi: FeeReceiverAbi,
    address: serviceFeeReceiver,
    functionName: 'serviceFee',
    query: {
      enabled: !!serviceFeeReceiver && !!address
    }
  });

  const serviceFeeEth = isFetchedServiceFee && data ? formatEther(data as any) : '0';

  console.log('-----serviceFeeEth-------', serviceFeeEth, serviceFeeReceiver, !!serviceFeeReceiver && !!address, data);
  const { data: balanceData } = useBalance({
    address,
  });

  const handleCreate = async () => {
    try {
      if (!walletClient) {
        throw new Error("Wallet client not connected");
      }

      setLoading(true);

      const supply = parseUnits(totalSupply, 18);
      const serviceFee = parseEther(serviceFeeEth);

      if (balanceData?.value && balanceData.value < serviceFee) {
        throw new Error("Insufficient ETH to cover the service fee.");
      }

      const txHash = await walletClient.deployContract({
        abi: RexasErc20.abi,
        bytecode: RexasErc20.bytecode as `0x${string}`,
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

      const receipt = await publicClient?.waitForTransactionReceipt({
        hash: txHash
      });

      if (!receipt || !receipt.contractAddress) {
        throw new Error("Failed to deploy the contract. hash:" + txHash);
      }

      toast({
        title: "Token Created",
        description: "Token created successfully!"
      });
      onSuccess?.(receipt.contractAddress);
    } catch (error: any) {
      console.log('-----------------------------------')
      toast({
        title: "Token Creation Failed",
        description: `Failed to create token.\n${error?.shortMessage || error?.message || error}`
      });
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
