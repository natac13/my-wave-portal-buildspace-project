import hre from 'hardhat'

const main = async () => {
  const [owner, randomPerson] = await hre.ethers.getSigners()
  const waveContractFactory = await hre.ethers.getContractFactory('WavePortal')
  const waveContract = await waveContractFactory.deploy()
  await waveContract.deployed()

  console.log('Contract deployed to:', waveContract.address)
  console.log('Contract deployed by:', owner.address)

  let waveCount
  waveCount = await waveContract.getTotalWaves()

  let waveTxn = await waveContract.wave()
  await waveTxn.wait()
  waveTxn = await waveContract.wave()
  await waveTxn.wait()
  waveTxn = await waveContract.wave()
  await waveTxn.wait()

  waveCount = await waveContract.getTotalWaves()

  waveTxn = await waveContract.connect(randomPerson).wave()
  await waveTxn.wait()

  waveCount = await waveContract.getTotalWaves()

  const myWaveCount = await waveContract.getMyTotalWaves()
  console.log(`My Total waves: ${myWaveCount}`)

  const friendCount = await waveContract.getAccountTotalWaves(
    randomPerson.address
  )
  console.log(`Friend total count: ${friendCount}`)
}

const runMain = async () => {
  try {
    await main()
    process.exit(0)
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

runMain()