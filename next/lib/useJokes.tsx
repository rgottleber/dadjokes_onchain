"use client";

import { useEffect, useState } from "react";
import { ConnectPublicClient } from "@/lib/client";
import { getContract } from "viem";
import dadJokesABI from "@/lib/dadJokesABI.json";

const publicClient = ConnectPublicClient();
const dadJokesContract = getContract({
  address: "0x97F38014F2C4A71dA80E4ba10cA8241443270D7C",
  abi: dadJokesABI,
  client: { public: publicClient },
});

// Define the type for a joke
interface Joke {
  id: number;
  text: string;
  setup: string;
  punchline: string;
  creator: string;
  reward: number;
}

export const useJokes = () => {
  // Specify the type of the state
  const [jokes, setJokes] = useState<Joke[]>([]);

  useEffect(() => {
    const fetchJokes = async () => {
      try {
        // Specify the type of the fetched jokes
        const fetchedJokes = (await dadJokesContract.read.getJokes()) as Joke[];
        setJokes(fetchedJokes);
      } catch (error) {
        console.error("Error fetching jokes:", error);
      }
    };
    fetchJokes();
  }, []);

  return jokes;
};
