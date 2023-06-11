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
      value: ethers.parseEther("0.000001"),
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

  return (
    <Stack align="center" spacing="sm">
      <Image src={logo} alt="Logo" style={{ width: 200 }} />
      <h1>Scroll Coin Flip</h1>
      {!provider || !accountAddress ? (
        <div>Wallet not connected</div>
      ) : (
        <div>Wallet connected</div>
      )}
      <hr />
      <Text>You guess:</Text>
      <Radio.Group value={guess} onChange={setGuess} name="favoriteFramework">
        <Group mt="xs">
          <Radio value="head" label="Head" />
          <Radio value="tail" label="Tail" />
        </Group>
      </Radio.Group>
      <br />
      <Button onClick={handleFlip}>Flip the coin!</Button>
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
    </Stack>
  );
}

export default App;
