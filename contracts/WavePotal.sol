// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {
  uint256 internal totalWaves;

  mapping(address => uint256) internal addressToWaveCount;

  constructor() {
    console.log("Yo yo, I am a contract am I was deployed by: natac.eth");
  }

  function wave() public {
    totalWaves += 1;
    console.log("%s has waved!", msg.sender);
    addressToWaveCount[msg.sender] += 1;
  }

  function getTotalWaves() public view returns (uint256) {
    console.log("We have %d total waves!", totalWaves);
    return totalWaves;
  }

  function getMyTotalWaves() public view returns (uint256) {
    return addressToWaveCount[msg.sender];
  }

  function getAccountTotalWaves(address account) public view returns (uint256) {
    return addressToWaveCount[account];
  }
}
