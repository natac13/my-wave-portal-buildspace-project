import {
  Box,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Container,
  TextField,
  Typography,
} from '@mui/material'
import * as React from 'react'
import Button from '@mui/material/Button'
import { ethers } from 'ethers'
import ContractAbi from '../artifacts/contracts/WavePotal.sol/WavePortal.json'

// Client-side cache, shared for the whole session of the user in the browser.
const contractABI = ContractAbi.abi
const oldContractAddress = '0xb31fA22DcDEb2b2a3d48EaC448d0cd3465D08433'
const contractAddress = '0x50049107E263e5890A061C304f25216bA2624fB0'

export default function Index() {
  const [currentAccount, setCurrentAccount] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [latestCount, setLastestCount] = React.useState(0)
  const [allWaves, setAllWaves] = React.useState([])
  const [message, setMessage] = React.useState('')
  const [error, setError] = React.useState('')

  const onChange = (str: string): void => {
    setError('')
    setMessage(str)
  }

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window

      if (!ethereum) {
        console.log('Make sure you have metamask!')
        return
      } else {
        console.log('We have the ethereum object', ethereum)
      }

      /*
       * Check if we're authorized to access the user's wallet
       */
      const accounts = await ethereum.request({ method: 'eth_accounts' })

      if (accounts.length !== 0) {
        const account = accounts[0]
        console.log('Found an authorized account:', account)
        setCurrentAccount(account)
      } else {
        console.log('No authorized account found')
      }
    } catch (error) {
      console.log(error)
    }
  }

  /**
   * Implement your connectWallet method here
   */
  const connectWallet = async () => {
    try {
      const { ethereum } = window

      if (!ethereum) {
        alert('Get MetaMask!')
        return
      }

      const accounts = await ethereum.request({ method: 'eth_requestAccounts' })

      console.log('Connected', accounts[0])
      setCurrentAccount(accounts[0])
    } catch (error) {
      console.log(error)
    }
  }

  const getWaveCount = async () => {
    try {
      const { ethereum } = window
      console.log(process.env.CONTRACT_ADDRESS)

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        )

        const count = await wavePortalContract.getTotalWaves()
        setLastestCount(count?.toNumber())
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error)
    }
  }

  const wave = async () => {
    try {
      const { ethereum } = window

      if (ethereum && message) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        )

        /*
         * Execute the actual wave from your smart contract
         */
        const waveTxn = await wavePortalContract.wave(message, {
          gasLimit: 300_000,
        })
        setLoading(true)

        await waveTxn.wait()
        setLoading(false)
        setMessage('')
        setError('')

        const count = await wavePortalContract.getTotalWaves()
        setLastestCount(count?.toNumber())
      } else {
        setError('You need to include a message.')
      }
    } catch (error) {
      console.log(error)
    }
  }

  /*
   * Create a method that gets all waves from your contract
   */
  const getAllWaves = async () => {
    try {
      const { ethereum } = window
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        )

        /*
         * Call the getAllWaves method from your Smart Contract
         */
        const waves = await wavePortalContract.getAllWaves()

        console.log({ waves })
        /*
         * We only need address, timestamp, and message in our UI so let's
         * pick those out
         */
        const wavesCleaned = waves.map((wave) => {
          return {
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message,
          }
        })

        /*
         * Store our data in React State
         */
        setAllWaves(wavesCleaned)

        wavePortalContract.on('NewWave', (from, timestamp, message) => {
          console.log('NewWave', from, timestamp, message)

          setAllWaves((prevState) => [
            ...prevState,
            {
              address: from,
              timestamp: new Date(timestamp * 1000),
              message: message,
            },
          ])
        })
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error)
    }
  }

  React.useEffect(() => {
    checkIfWalletIsConnected()
    getWaveCount()
  }, [])

  return (
    <Container maxWidth="md">
      <Box
        component="header"
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexFlow: 'column',
          my: 2,
        }}
      >
        <Typography variant="h1" align="center" fontWeight="700">
          Wave Counter
        </Typography>
        <Typography variant="h3" align="center" fontWeight="700">
          Total: {latestCount}
        </Typography>
      </Box>
      <Box></Box>
      <Box
        sx={{
          my: 3,
          display: 'flex',
          width: '100%',
          justifyContent: 'center',
          flexFlow: 'column',
          gap: 2,
        }}
      >
        <Button
          variant="outlined"
          color="primary"
          onClick={getWaveCount}
          disabled={loading}
        >
          Get Wave Count
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={getAllWaves}
          disabled={loading}
        >
          Get All Waves
        </Button>
        <TextField
          name="message"
          label="Wave Message"
          value={message}
          fullWidth
          color="secondary"
          helperText={error}
          disabled={loading}
          error={!!error}
          onChange={(e) => {
            onChange(e?.target?.value)
          }}
        />
        <Button
          variant="contained"
          color="secondary"
          onClick={wave}
          disabled={loading}
        >
          Wave
        </Button>
        {!currentAccount && (
          <Button
            color="primary"
            variant="outlined"
            onClick={connectWallet}
            disabled={loading}
          >
            Connect Wallet
          </Button>
        )}
      </Box>
      {loading && (
        <Box
          sx={{
            display: 'flex',
            flexFlow: 'column',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="subtitle1" align="center">
            Pending Transaction
          </Typography>
          <CircularProgress color="secondary" size={50} />
        </Box>
      )}
      <Box>
        {allWaves?.map((wave, idx) => (
          <Card key={idx} sx={{ mb: 2 }}>
            <CardHeader title={wave?.address} />
            <CardContent>
              <Typography>Time: {wave?.timestamp.toString()}</Typography>
              <Typography>Message: {wave?.message}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Container>
  )
}
