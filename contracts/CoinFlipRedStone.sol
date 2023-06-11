// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "redstone-evm-connector/lib/contracts/message-based/PriceAwareOwnable.sol";

// contract CoinFlipRandom {
contract CoinFlipRedStone is PriceAwareOwnable {

    enum Side {Heads, Tails}

    address public ownerFlip;
    uint public betAmount;
    uint public balance;
    uint private constant MAX_BET = 1 ether;

    event FlipResult(address indexed player, Side side, bool win, uint amount);

    constructor() {
         ownerFlip = msg.sender;
    }

    modifier onlyOwnerFlip() {
        require(msg.sender == ownerFlip, "Only contract owner can call this function");
        _;
    }

    // Function parameter size is user's guess
    function flipCoin(Side side) external payable {
        require(msg.value > 0 && msg.value <= MAX_BET, "Invalid bet amount");
        require(balance + msg.value <= address(this).balance, "Insufficient contract balance");

        balance += msg.value;
        
        Side result = randomizeSide();
        bool win = (result == side);
        
        uint amount = win ? msg.value * 2 : 0;
        
        if (win) {
            if (balance >= amount) {
                // msg.sender.transfer(amount);
                payable(msg.sender).transfer(amount);
                balance -= amount;
            } else {
                amount = balance;
                // msg.sender.transfer(balance);
                payable(msg.sender).transfer(balance);
                balance = 0;
            }
        }

        emit FlipResult(msg.sender, result, win, amount);
    }

    function randomizeSide() private view returns (Side) {
        // block.prevrandao returns always 0 in RiscZero
        // uint256 randomNumber = uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao))) % 2;
        uint256 randomNumber = generateRandomNumber(1);
        return Side(randomNumber);
        
    }

    function withdrawFunds() external onlyOwner {
        uint amount = balance;
        balance = 0;
        // send contract balance to the owner's address
        payable(msg.sender).transfer(amount);
    }

    function getPseudoRandomness() private view returns(uint256) {
        uint256 randomValue = getPriceFromMsg(bytes32("ENTROPY"));

        return uint256(
        keccak256(
            abi.encodePacked(
            randomValue,
            block.timestamp,
            blockhash(block.number - 1),
            blockhash(block.number)
            )
        )
        );
    }

    // Generates a random number from 1 to maxValue
    function generateRandomNumber(uint256 maxValue) public view returns(uint256) {
        uint256 randomness = getPseudoRandomness();
        return (randomness % maxValue) + 1;
    }
}