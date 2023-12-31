// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract CoinFlip {
    enum Side {Heads, Tails}

    address public owner;
    uint public balance;
    uint private constant MAX_BET = 1 ether;

    event FlipResult(address indexed player, Side side, bool win, uint amount);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only contract owner can call this function");
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
                payable(msg.sender).transfer(amount);
                balance -= amount;
            } else {
                amount = balance;
                payable(msg.sender).transfer(balance);
                balance = 0;
            }
        }

        emit FlipResult(msg.sender, result, win, amount);
    }

    function randomizeSide() private view returns (Side) {
        // block.prevrandao returns always 0 in Scroll, so don't use it
        // uint256 randomNumber = uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao))) % 2;

        // This is not save way how to generate rundom number becuase the validators know block.timestamp and block.number
        // thius know what the random number will be and can cheat.
        uint256 randomNumber = uint256(keccak256(abi.encodePacked(block.timestamp))) % 2;
        return Side(randomNumber);
    }

    function withdrawFunds() external onlyOwner {
        uint amount = balance;
        balance = 0;
        // send contract balance to the owner's address
        payable(msg.sender).transfer(amount);
    }

    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }

    receive() external payable {
    // Allow contract to receive ETH
    // Executed when callend function that doesn't exist inside the contract and msg.data is empty.
    //   emit Log("receive", gasleft());
    }
}