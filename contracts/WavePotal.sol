// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import 'hardhat/console.sol';

contract WavePortal {
  uint256 totalWaves;

  /*
   * We will be using this below to help generate a random number
   */
  uint256 private seed;

  event NewWave(address indexed from, uint256 timestamp, string message);

  struct Wave {
    address waver;
    string message;
    uint256 timestamp;
  }

  Wave[] waves;

  mapping(address => uint256) public lastWavedAt;

  constructor() payable {
    console.log('We have been constructed!');
  }

  function wave(string memory _message) public {
    require(
      lastWavedAt[msg.sender] + 15 minutes < block.timestamp,
      'Wait 15 minutes'
    );

    lastWavedAt[msg.sender] = block.timestamp;

    totalWaves += 1;
    console.log('%s has waved!', msg.sender);

    waves.push(Wave(msg.sender, _message, block.timestamp));

    /*
     * Generate a Psuedo random number between 0 and 100
     */
    uint256 randomNumber = (block.difficulty + block.timestamp + seed) % 100;
    console.log('Random # generated: %s', randomNumber);

    /*
     * Set the generated, random number as the seed for the next wave
     */
    seed = randomNumber;

    /*
     * Give a 50% chance that the user wins the prize.
     */
    if (randomNumber < 50) {
      console.log('%s won!', msg.sender);

      /*
       * The same code we had before to send the prize.
       */
      uint256 prizeAmount = 0.00001 ether;
      require(
        prizeAmount <= address(this).balance,
        'Trying to withdraw more money than the contract has.'
      );
      (bool success, ) = (msg.sender).call{value: prizeAmount}('');
      require(success, 'Failed to withdraw money from contract.');
    }

    emit NewWave(msg.sender, block.timestamp, _message);
  }

  function getAllWaves() public view returns (Wave[] memory) {
    return waves;
  }

  function getTotalWaves() public view returns (uint256) {
    return totalWaves;
  }
}
