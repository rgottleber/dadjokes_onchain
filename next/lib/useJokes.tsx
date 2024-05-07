"use client";

import { useEffect, useState } from "react";
import { ConnectPublicClient } from "@/lib/client";
import { getContract } from "viem";
import dadJokesABI from "@/lib/dadJokesABI.json";

const publicClient = ConnectPublicClient();
const dadJokesContract = getContract({
  address: "0x4fF652D3C68F488D6c99ca796581d3c4a83f56ED",
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
  console.log("hi");
  // Specify the type of the state
  const [jokes, setJokes] = useState<Joke[]>([]);
  useEffect(() => {
    const fetchJokes = async () => {
      try {
        // Specify the type of the fetched jokes
        const fetchedJokes = (await dadJokesContract.read.getJokes()) as Joke[];
        console.log("fetched", fetchedJokes);
        setJokes(fetchedJokes);
      } catch (error) {
        console.error("Error fetching jokes:", error);
      }
    };
    fetchJokes();
  }, []);

  return jokes;
};
