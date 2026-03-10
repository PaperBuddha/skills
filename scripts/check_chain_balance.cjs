const { ethers } = require('ethers');

async function checkBalance() {
  const provider = new ethers.providers.JsonRpcProvider("https://mainnet.base.org");
  const walletAddress = "0x52B4B128Cc81c87cB23E6d46B89552802047A910";
  const usdcAddress = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
  
  const abi = [
    "function balanceOf(address account) view returns (uint256)",
    "function decimals() view returns (uint8)"
  ];
  
  const usdc = new ethers.Contract(usdcAddress, abi, provider);
  
  try {
    const balance = await usdc.balanceOf(walletAddress);
    const decimals = await usdc.decimals();
    console.log(`USDC Balance: ${ethers.utils.formatUnits(balance, decimals)}`);
  } catch (err) {
    console.error("Error checking USDC balance:", err.message);
  }
  
  try {
    const ethBalance = await provider.getBalance(walletAddress);
    console.log(`ETH Balance: ${ethers.utils.formatEther(ethBalance)}`);
  } catch (err) {
    console.error("Error checking ETH balance:", err.message);
  }
}

checkBalance();
