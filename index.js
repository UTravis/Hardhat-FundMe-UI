import { ethers } from "./ethers-5.1.esm.min.js"
import { abi, contractAddress } from "./constants.js";

const connectBtn = document.getElementById('connectBtn');
const fundBtn = document.getElementById('fundBtn');
const balanceBtn = document.getElementById('balanceBtn');
const withdrawBtn = document.getElementById('withdrawBtn');

connectBtn.onclick = connect
fundBtn.onclick = fund
balanceBtn.onclick = getBalance
withdrawBtn.onclick = withdraw

// Connect to EVM Wallet
async function connect() {
    if (typeof window.ethereum !== "undefined") {
        await window.ethereum.request({ method: "eth_requestAccounts" })
        console.log('MetaMask connected to app successfully.....')
        connectBtn.innerHTML = "Connected!" 
    } else {
        fundBtn.innerHTML = "Please install Metamask"
    }
}

// Make a fund transaction
async function fund() {
    const ethAmount = document.getElementById("ethAmount").value

    console.log(`Funding contract with ${ethAmount} ETH`)
    if(typeof window.ethereum !== 'undefined'){
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)

        try {
            // Making the fund transaction
            const tx = await contract.fund({value: ethers.utils.parseEther(ethAmount)})
            await listenForTxMine(tx, provider)
            console.log("Done!")
        } catch (error) {
            console.log(error)
        }
    }
}

// An event function to listen for transaction mining
function listenForTxMine(txResponse, provider) {
    console.log(`Mining ${txResponse.hash}........`)
    return new Promise((resolve, reject) => {
        provider.once(txResponse.hash, (txReceipt) => {
            console.log(`Completed with ${txReceipt.confirmations} confirmations`)
            resolve()
        })
    })
}

// Get contract balance
async function getBalance() {
    if(typeof window.ethereum != "undefined"){
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const balance = await provider.getBalance(contractAddress);
        console.log(ethers.utils.formatEther(balance))
    }
}

// Withdraw funds
async function withdraw(){
    if(typeof window.ethereum != 'undefined'){
        console.log('Withdrawing funds...')

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)

        try {
            const tx =  await contract.withdraw()
            // listening for transaction to get mined
            await listenForTxMine(tx, provider)
        } catch (error) {
            console.log(error)
        }
    }
}