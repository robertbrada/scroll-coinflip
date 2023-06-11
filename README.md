# Scroll Coin Flip

This project was created during ETH Prague 2023 hackathon. 
It deploys Coin Flip game using [Scroll zkEVM ](https://scroll.io/).
There is also a web UI that connects to you MetaMask.

The goal os to deploy fully usable app to Scroll zkEVM and test how it works with randomness. 
Unfortunately, I didn't find a secure way how to generate randomness because PREVRANDAO is not working
in Scroll zkEVM and the oracle solutions were not working either for me (but that was most likely not related to Scroll).
The contract trying to use RedStone randomness oracle is in `contracts/CoinFlipRedStone.sol`.

THe contract is deployed to `0x987CB93496fD78558664212661F11f902670F34e`.

## Game
In the web ui you the players chooses if thinks Head or Tail will be chosen by the smart contract.
Then the player initialized a transaction ("flips the coin in smart contract").
Then you either win or lose you bet depending on the contract output. 
If the user wins, he receive the double of bet amount.
If the user loses, he loses his whole bet.

## Compile/Deploy contracts
- compile contracts: `npx hardhat compile`
- deploy contracts: `yarn deploy:scrollAlpha`

## Open Frontend
- `cd frontend`
- `yarn`
- `yarn dev`

