import './App.css';
import { useState } from 'react';
import { ethers } from 'ethers'
import StakeNFT from './artifacts/contracts/StakeNFT.sol/StakeNFT.json'
import Azuki from './artifacts/contracts/Azuki.sol/Azuki.json'

// Update with the contract address logged out to the CLI when it was deployed

const AzukiAddress = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9"
const StakeNFTAddress = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707"

function App() {

  const [address, setAddressValue] = useState()
  const [tokenId, setTokenIdValue] = useState()

  // request access to the user's MetaMask account
  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  async function mint() {
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(AzukiAddress, Azuki.abi, signer)
      const transaction = await contract.mint(2)
      await transaction.wait()
    }
  }

  async function getBalance() {
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(AzukiAddress, Azuki.abi, signer)
      const transaction = await contract.balanceOf(signer.getAddress())
      console.log(transaction.toNumber())
    }
  }

  async function getStakedBalance() {
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(AzukiAddress, Azuki.abi, signer)
      const transaction = await contract.balanceOf(StakeNFTAddress)
      console.log(transaction.toNumber())
    }
  }

  async function stake() {
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(AzukiAddress, Azuki.abi, signer)
      const transaction = await contract["safeTransferFrom(address,address,uint256)"](signer.getAddress(), StakeNFTAddress, tokenId)
      console.log(transaction)
    }
  }

  async function unstake() {
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(StakeNFTAddress, StakeNFT.abi, signer)
      const transaction = await contract.unstakeNft(tokenId)
      console.log(transaction)
    }
  }

  async function grantAccess() {
    if (!address) return
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner()
      const contract = new ethers.Contract(StakeNFTAddress, StakeNFT.abi, signer)
      const transaction = await contract.grantAccess(tokenId, address)
      await transaction.wait()
    }
  }

  async function revokeAccess() {
    if (!address) return
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner()
      const contract = new ethers.Contract(StakeNFTAddress, StakeNFT.abi, signer)
      const transaction = await contract.revokeAccess(tokenId, address)
      await transaction.wait()
    }
  }

  async function allowAccess() {
    if (!address) return
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner()
      const contract = new ethers.Contract(StakeNFTAddress, StakeNFT.abi, signer)
      const transaction = await contract.allowAccess(tokenId)
      console.log(transaction)
    }
  }

  //
  // // call the smart contract, read the current greeting value
  // async function fetchGreeting() {
  //   // if (typeof window.ethereum !== 'undefined') {
  //   //   const provider = new ethers.providers.Web3Provider(window.ethereum)
  //   //   const contract = new ethers.Contract(StakeNFTAddress, StakeNFT.abi, provider)
  //   //   try {
  //   //     const data = await contract.greet()
  //   //     console.log('data: ', data)
  //   //   } catch (err) {
  //   //     console.log("Error: ", err)
  //   //   }
  //   // }
  // }
  //
  // // call the smart contract, send an update
  // async function setGreeting() {
  //   // if (!greeting) return
  //   // if (typeof window.ethereum !== 'undefined') {
  //   //   await requestAccount()
  //   //   const provider = new ethers.providers.Web3Provider(window.ethereum);
  //   //   const signer = provider.getSigner()
  //   //   const contract = new ethers.Contract(StakeNFTAddress, StakeNFT.abi, signer)
  //   //   const transaction = await contract.setGreeting(greeting)
  //   //   await transaction.wait()
  //   //   fetchGreeting()
  //   // }
  // }

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={mint}>Mint</button>
        <button onClick={getBalance}>Get Balance</button>
        <button onClick={getStakedBalance}>Get Staked Balance</button>
        <input onChange={e => setTokenIdValue(e.target.value)} placeholder="Set tokenId" />
        <button onClick={stake}>Stake</button>
        <button onClick={unstake}>Unstake</button>
        <input onChange={e => setAddressValue(e.target.value)} placeholder="Set accessor" />
        <button onClick={grantAccess}>Grant Access</button>
        <button onClick={revokeAccess}>Revoke Access</button>
        <button onClick={allowAccess}>Try to Access</button>
      </header>
    </div>
  );
}

export default App;
