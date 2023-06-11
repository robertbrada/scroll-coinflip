import { useState, useEffect } from "react";
import { ethers } from "ethers";
import "./App.css";
import type { BrowserProvider, JsonRpcSigner } from "ethers/providers";
import { contractAddress, contractABI } from "../constants";
import type { CoinFlip } from "../../typechain";
import {
  Anchor,
  Button,
  Group,
  Radio,
  Stack,
  Text,
  Image,
} from "@mantine/core";
import logo from "./assets/scroll-logo.png";

const BET_AMOUNT_ETH = "0.001";
const guessToInt: Record<string, number> = {
  head: 0,
  tail: 1,
};

function App() {
  const [guess, setGuess] = useState<string>("head");
  const [provider, setProvider] = useState<BrowserProvider>();
  const [signer, setSigner] = useState<JsonRpcSigner>();
  // const [contract, setContract] = useState<Contract>();
  const [contract, setContract] = useState<CoinFlip>();
  const [accountAddress, setAccountAddress] = useState<string>();
  const [transactionHash, setTransactionHash] = useState<string>();

  useEffect(() => {
    async function init() {
      if (!window.ethereum) {
        console.log("window.ethereum is not defined");
        return;
      }

      // Request access to MetaMask
      await window.ethereum.request({ method: "eth_requestAccounts" });

      // Connect to MetaMask
      // const provider = new ethers.providers.Web3Provider(window.ethereum);
      const provider = new ethers.BrowserProvider(window.ethereum);
      setProvider(provider);

      // Get the user's account address
      const [account] = await provider.listAccounts();
      setAccountAddress(account.address);

      const signer = await provider.getSigner();
      setSigner(signer);

      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      ) as unknown as CoinFlip;

      setContract(contract);
    }

    init();
  }, []);

  async function handleFlip() {
    if (!signer || !contract) {
      console.log("signer or contract is not defined", { signer, contract });
      return;
    }

    // Execute a contract function
    // const transaction = await contract.yourContractFunction();
    const transactionResp = await contract.flipCoin(guessToInt[guess], {
      value: ethers.parseEther(BET_AMOUNT_ETH),
    });

    console.log("transactionResp", transactionResp);

    // Get the transaction hash
    setTransactionHash(transactionResp.hash);
  }

  useEffect(() => {
    async function updateEvents() {
      // get events
    }
    updateEvents();
  }, [transactionHash]);

  const walletConnected = provider && accountAddress;

  return (
    <Stack align="center">
      <Image
        src={logo}
        alt="Logo"
        style={{ width: 480, marginBottom: "2rem" }}
      />
      <Text weight={500}>You guess:</Text>
      <Radio.Group value={guess} onChange={setGuess} name="guessChoice">
        <Group mt="xs">
          <Radio value="head" label="Head" color="yellow" />
          <Radio value="tail" label="Tail" color="yellow" />
        </Group>
      </Radio.Group>
      <Text mt="md">Bet amount is {BET_AMOUNT_ETH} ETH</Text>
      <br />
      <Button onClick={handleFlip} color="yellow">
        Flip the coin!
      </Button>
      {transactionHash && (
        <Text span>
          Transaction hash:{" "}
          <Anchor
            target="_blank"
            href={`https://blockscout.scroll.io/tx/${transactionHash}`}
          >
            {transactionHash}
          </Anchor>
        </Text>
      )}
      <Text mt="md" weight="500" color={walletConnected ? "gray" : "red"}>
        {walletConnected ? "Wallet connected" : "Wallet not connected"}
      </Text>
    </Stack>
  );
}

export default App;
