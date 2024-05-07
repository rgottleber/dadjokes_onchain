"use client";

import React, { useState } from "react";
import { ConnectWalletClient, ConnectPublicClient } from "@/lib/client";
import { formatEther, getContract, parseEther } from "viem";
import Image from "next/image";
import dadJokesABI from "@/lib/dadJokesABI.json";
const publicClient = ConnectPublicClient();
const walletClient = ConnectWalletClient();
const dadJokesContract = getContract({
  address: "0x97F38014F2C4A71dA80E4ba10cA8241443270D7C",
  abi: dadJokesABI,
  client: { public: publicClient, wallet: walletClient },
});

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
export default function WalletButton({ index, joke }: WalletButtonProps) {
  // State variables to store the wallet address and balance
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [setup, setSetup] = useState("");
  const [punchline, setPunchline] = useState("");

  // const creator = joke.creator;
  // Function to handle the button click event
  async function handleClick() {
    try {
      // Instantiate a Wallet Client and a Public Client
      const walletClient = await ConnectWalletClient();
      // const publicClient = await ConnectPublicClient();

      // Retrieve the wallet address using the Wallet Client
      const [address] = await walletClient.requestAddresses();
      // const [address] = await walletClient.getAddresses();

      // Retrieve the balance of the address using the Public Client
      const balance = parseInt(
        await dadJokesContract.read.creatorBalances([address])
      );
      //   formatEther(await publicClient.getBalance({ address }));

      // Update the state variables with the retrieved address and balance
      // .setAddress(address);
      console.log("bal: ", balance);
      setAddress(address);
      setBalance(formatEther(BigInt(balance)));
    } catch (error) {
      // Error handling: Display an alert if the transaction fails
      alert(`Transaction failed: ${error}`);
    }
  }

  async function handleVote(index: number, type: number) {
    const reward = type + 1;
    // Instantiate a Wallet Client and a Public Client
    const walletClient = await ConnectWalletClient();
    // Retrieve the wallet address using the Wallet Client
    const [address] = await walletClient.requestAddresses();

    let rewardAmount;

    switch (type) {
      case 0:
        rewardAmount = parseEther("0.001");
        break;
      case 1:
        rewardAmount = parseEther("0.005");
        break;
      case 2:
        rewardAmount = parseEther("0.01");
        break;
      default:
        throw new Error("Invalid reward type");
    }
    const { request } = await publicClient.simulateContract({
      address: dadJokesContract.address,
      abi: dadJokesContract.abi,
      functionName: "rewardJoke",
      args: [index, reward],
      account: address,
      value: rewardAmount,
    });
    await walletClient.writeContract(request);
    console.log(request);
  }

  async function handleWithdraw() {
    // Instantiate a Wallet Client and a Public Client
    const walletClient = await ConnectWalletClient();
    // Retrieve the wallet address using the Wallet Client
    const [address] = await walletClient.requestAddresses();
    const { request } = await publicClient.simulateContract({
      address: dadJokesContract.address,
      abi: dadJokesContract.abi,
      functionName: "withdrawBalance",
      account: address,
    });
    await walletClient.writeContract(request);
  }
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleSubmit = async () => {
    const walletClient = await ConnectWalletClient();
    // Retrieve the wallet address using the Wallet Client
    const [address] = await walletClient.requestAddresses();

    const { request } = await publicClient.simulateContract({
      address: dadJokesContract.address,
      abi: dadJokesContract.abi,
      functionName: "addJoke",
      args: [setup, punchline],
      account: address,
    });
    await walletClient.writeContract(request);
    setIsModalOpen(false);
  };

  if (!address) {
    // If no address is provided, display "Disconnected" status
    return (
      <div className="flex justify-center">
        <button
          className="px-8 py-2 rounded-md flex flex-row items-center justify-center bg-primaryDark text-primaryLight font-sans"
          onClick={handleClick}
        >
          {/* Display the MetaMask Fox image */}
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg"
            alt="MetaMask Fox"
            width={25}
            height={25}
          />
          <h1 className="mx-auto">Connect Wallet</h1>
        </button>
      </div>
    );
  }

  // If an address is provided, display the address and balance
  return (
    <>
      <div className="justify-center flex pt-5 text-primaryDark font-sans text-3xl font-bold">
        Reward The Joke
      </div>
      <div className="flex justify-center space-x-20 pt-4">
        <button
          className="text-5xl focus:outline-none"
          onClick={() => handleVote(index, 0)}
        >
          😆
        </button>
        <button
          className="text-5xl focus:outline-none"
          onClick={() => handleVote(index, 1)}
        >
          🤣
        </button>
        <button
          className="text-5xl focus:outline-none"
          onClick={() => handleVote(index, 2)}
        >
          😫
        </button>
      </div>
      <div className="mt-6 flex items-center w-full bg-gray-800 bg-opacity-25 p-4 rounded ">
        <div className="flex items-center justify-center w-full">
          {((balance !== null && parseFloat(balance) > 0) || !balance) && (
            <div className="text-2xl">
              Balance: {balance} ETH
              <button
                className="bg-primaryDark text-primaryLight font-sans px-4 py-2 rounded"
                onClick={() => handleWithdraw()}
              >
                🤑 Cash Out
              </button>
            </div>
          )}

          <button
            className="bg-primaryDark text-primaryLight font-sans px-4 py-2 rounded"
            onClick={() => setIsModalOpen(true)}
          >
            Add Joke
          </button>
        </div>
        {isModalOpen && (
          // floating modal to add joke
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg">
              <div>
                <input
                  className="border border-gray-300 rounded p-2 m-2"
                  type="text"
                  placeholder="Setup"
                  value={setup}
                  onChange={(e) => setSetup(e.target.value)}
                />
                <input
                  className="border border-gray-300 rounded p-2 m-2"
                  type="text"
                  placeholder="Punchline"
                  value={punchline}
                  onChange={(e) => setPunchline(e.target.value)}
                />
              </div>
              {/* space the two items on either side of the div */}
              <div className="flex justify-between">
                <button
                  onClick={handleSubmit}
                  className="bg-primaryDark text-primaryLight font-sans px-4 py-2 rounded"
                >
                  Submit
                </button>
                <button
                  onClick={() => setIsModalOpen(!isModalOpen)}
                  className="bg-primaryDark text-primaryLight font-sans px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
