import { ethers } from 'ethers';

// A minimal Application Binary Interface (ABI) for an ERC20 token.
const ERC20_MINIMAL_ABI = [
    {
        "constant": true,
        "inputs": [{ "name": "_owner", "type": "address" }],
        "name": "balanceOf",
        "outputs": [{ "name": "balance", "type": "uint256" }],
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "decimals",
        "outputs": [{ "name": "", "type": "uint8" }],
        "type": "function"
    }
];

class WalletManager {
    constructor(privateKey, chainConfig) {
        if (!privateKey || !privateKey.startsWith('0x')) {
            throw new Error("Invalid or missing private key.");
        }
        if (!chainConfig || !chainConfig.rpcUrl || !chainConfig.chainId) {
            throw new Error("Invalid or missing chain configuration.");
        }

        this.chainConfig = chainConfig;

        // ETHERS V5 STABILITY FIX
        // We use StaticJsonRpcProvider instead of JsonRpcProvider.
        // This class NEVER checks the network ID, avoiding the "could not detect network" error entirely.
        this.provider = new ethers.providers.StaticJsonRpcProvider(
            this.chainConfig.rpcUrl, 
            { chainId: this.chainConfig.chainId, name: 'polygon' }
        );

        // In v5, Wallet is directly under ethers or ethers.Wallet
        this.wallet = new ethers.Wallet(privateKey, this.provider);

        console.log(`WalletManager initialized for address: ${this.wallet.address} on chain ID: ${this.chainConfig.chainId}`);
    }

    getWalletAddress() {
        return this.wallet.address;
    }

    async getNativeBalance() {
        const balanceBigInt = await this.provider.getBalance(this.wallet.address);
        return ethers.utils.formatEther(balanceBigInt); // v5 uses ethers.utils.formatEther
    }

    async getErc20Balance(tokenAddress) {
        const tokenContract = new ethers.Contract(tokenAddress, ERC20_MINIMAL_ABI, this.provider);
        const [balanceBigInt, decimals] = await Promise.all([
            tokenContract.balanceOf(this.wallet.address),
            tokenContract.decimals()
        ]);
        return ethers.utils.formatUnits(balanceBigInt, decimals); // v5 uses ethers.utils.formatUnits
    }

    async getOptimizedGasPrice() {
        return await this.provider.getFeeData();
    }

    async prepareContractTransaction(contractAddress, functionName, functionArgs, contractAbi) {
        const contract = new ethers.Contract(contractAddress, contractAbi, this.wallet);
        const feeData = await this.getOptimizedGasPrice();

        const tx = await contract.populateTransaction[functionName](...functionArgs); // v5 populateTransaction syntax
        tx.chainId = this.chainConfig.chainId;
        
        // EIP-1559 support check
        if (feeData.maxFeePerGas) {
             tx.maxFeePerGas = feeData.maxFeePerGas;
             tx.maxPriorityFeePerGas = feeData.maxPriorityFeePerGas;
        }

        const signedTx = await this.wallet.signTransaction(tx);
        
        return {
            gasInfo: feeData,
            signedTx: signedTx
        };
    }

    async broadcastTransaction(signedTxHex) {
        return await this.provider.sendTransaction(signedTxHex); // v5 uses sendTransaction for raw tx
    }
}

export const CHAIN_CONFIG = {
    ethereum: {
        rpcUrl: 'https://cloudflare-eth.com',
        chainId: 1,
        usdcAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
    },
    polygon: {
        rpcUrl: 'https://polygon-bor.publicnode.com',
        chainId: 137,
        usdcAddress: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174'
    }
};

export default WalletManager;
