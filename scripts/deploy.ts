// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import hre from 'hardhat'

const main = async () => {
  const [deployer] = await hre.ethers.getSigners()
  const accountBalance = await deployer.getBalance()

  console.log('Deploying contracts with account: ', deployer.address)
  console.log('Account balance: ', accountBalance.toString())

  const Token = await hre.ethers.getContractFactory('WavePortal')
  const portal = await Token.deploy({
    value: hre.ethers.utils.parseEther('0.001'),
  })
  await portal.deployed()

  console.log('WavePortal address: ', portal.address)
}

const runMain = async () => {
  try {
    await main()
    process.exit(0)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

runMain()
