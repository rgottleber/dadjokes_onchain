"use client";

import { useWallet } from "@/hooks/useWallet";
import { useVote } from "@/hooks/useVote";
import { useWithdraw } from "@/hooks/useWithdraw";
import { useSubmitJoke } from "@/hooks/useSubmitJoke";

import ConnectButton from "@/components/ConnectButton";
import RewardSection from "@/components/RewardSection";
import WithdrawSection from "@/components/WithdrawSection";
import JokeModal from "@/components/JokeModal";

import React, { useState, useEffect } from "react";
import { ConnectWalletClient, ConnectPublicClient } from "@/lib/client";
import { getContract } from "viem";
import dadJokesABI from "@/lib/dadJokesABI.json";

interface WalletButtonProps {
  index: number;
  joke: {
    setup: string;
    punchline: string;
    creator: string;
    reward: number;
  };
}

// Component to display the wallet status (connected or disconnected)
export default function WalletButton({ index }: WalletButtonProps) {
  const [setup, setSetup] = useState("");
  const [punchline, setPunchline] = useState("");
  const [publicClient, setPublicClient] = useState<any>(null);
  const [walletClient, setWalletClient] = useState<any>(null);
  const [dadJokesContract, setDadJokesContract] = useState<any>(null);

  const { address, balance, handleClick } = useWallet(dadJokesContract);
  const { handleVote } = useVote(dadJokesContract, walletClient, publicClient);
  const { handleWithdraw } = useWithdraw(
    dadJokesContract,
    walletClient,
    publicClient
  );
  const { isModalOpen, setIsModalOpen, handleSubmit } = useSubmitJoke(
    walletClient,
    dadJokesContract,
    publicClient
  );

  useEffect(() => {
    const initializeClients = async () => {
      try {
        const publicClient = await ConnectPublicClient();
        const walletClient = await ConnectWalletClient();

        setPublicClient(publicClient);
        setWalletClient(walletClient);
      } catch (error) {
        console.error("Error initializing clients:", error);
      }
    };

    initializeClients();
  }, []);

  useEffect(() => {
    if (publicClient && walletClient) {
      const dadJokesContract = getContract({
        address: "0x4fF652D3C68F488D6c99ca796581d3c4a83f56ED",
        abi: dadJokesABI,
        client: { public: publicClient, wallet: walletClient },
      });

      setDadJokesContract(dadJokesContract);
    }
  }, [publicClient, walletClient]);

  if (!address) {
    // If no address is provided, display "Disconnected" status
    return <ConnectButton handleClick={handleClick} />;
  }

  return (
    <>
      <RewardSection index={index} handleVote={handleVote} />
      <div className="mt-6 flex items-center w-full bg-gray-800 bg-opacity-25 p-4 rounded ">
        <div className="flex items-center justify-center w-full">
          <WithdrawSection handleWithdraw={handleWithdraw} balance={balance} />
          <button
            className="bg-primaryDark text-primaryLight font-sans px-4 py-2 rounded"
            onClick={() => setIsModalOpen(true)}
          >
            Add Joke
          </button>
        </div>
        <JokeModal
          {...{
            isModalOpen,
            setIsModalOpen,
            handleSubmit,
            setup,
            setSetup,
            punchline,
            setPunchline,
          }}
        />
      </div>
    </>
  );
}
