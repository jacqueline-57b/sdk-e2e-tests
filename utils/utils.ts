import { Hex, http, Address, createWalletClient, createPublicClient, Chain } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { sepolia } from 'viem/chains';
import fs from 'fs';
import { chainStringToViemChain, nftContractAddress, rpcProviderUrl, royaltyPolicyLAPAddress, royaltyApproveAddress, disputeModuleAddress } from "../config/config";

const TEST_ENV = process.env.TEST_ENV as string | undefined;

let chainId: Chain;
if (TEST_ENV == "sepolia") {
  chainId = sepolia;
// } else if (TEST_ENV == "storyTestnet") {
//   chainId = chainStringToViemChain("storyTestnet");
} else {
  throw new Error(`Unknown TEST_ENV value: ${TEST_ENV}`);
};

export function sleep(second: number) {
  return new Promise((resolve) => setTimeout(resolve, second * 1000));
};

export function writeToCSV(filename: string, headers: string[], data: any[]) {
  const csvHeader = headers.join(',');
  const csvData = data.map(row => headers.map(header => row[header]).join(',')).join('\n');
  const csvContent = `${csvHeader}\n${csvData}`;
  fs.writeFileSync(filename, csvContent);
};

export function captureConsoleLogs(consoleLogs:string[]){
  consoleLogs = [];
  const originalConsoleLog = console.log;
  console.log = function (...args: any[]) {
    consoleLogs.push(args.join(' '));
    originalConsoleLog.apply(console, args);
  };
  return consoleLogs;
};

export async function mintNFT(WALLET_PRIVATE_KEY: Hex): Promise<string> {
  const account = privateKeyToAccount(WALLET_PRIVATE_KEY as Address);
  const baseConfig = {
    chain: chainId,
    transport: http(rpcProviderUrl)    
  };
  const walletClient = createWalletClient({
    ...baseConfig,
    account
  });
  const publicClient = createPublicClient(baseConfig);
  const contractAbi = {
    inputs: [{ internalType: 'address', name: 'to', type: 'address' }],
    name: 'mint',
    outputs: [
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  };

  const requestArgs = {
    address: nftContractAddress as Address,
    functionName: 'mint',
    args: [account.address],
    abi: [contractAbi]    
  };

  // Mint an NFT to your account
  await publicClient.simulateContract(requestArgs);
  const hash = await walletClient.writeContract(requestArgs);
  const { logs } = await publicClient.waitForTransactionReceipt({
    hash: hash
  });

  let tokenId: any;
  if (logs[0].topics[3]) {
    tokenId = parseInt(logs[0].topics[3], 16);
  };

  console.log(`Minted NFT successful with hash: ` + JSON.stringify(hash) + `\nMinted NFT tokenId: ` + JSON.stringify(tokenId));
  return String(tokenId);
}

export async function mintNFTWithTokenID(WALLET_PRIVATE_KEY: Hex, id: number): Promise<string> {
  const account = privateKeyToAccount(WALLET_PRIVATE_KEY as Address);
  const baseConfig = {
    chain: chainId,
    transport: http(rpcProviderUrl)    
  };
  const walletClient = createWalletClient({
    ...baseConfig,
    account
  });
  const publicClient = createPublicClient(baseConfig);
  const contractAbi = {
    inputs: [
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: "uint256", name: "tokenId",type: "uint256" }
    ],
    name: 'mintId',
    outputs: [
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  };

  const requestArgs = {
    address: nftContractAddress as Address,
    functionName: 'mintId',
    args: [account.address, BigInt(id)],
    abi: [contractAbi]   
  };

  //Mint an NFT to your account
  const { result } = await publicClient.simulateContract(requestArgs);
  const hash = await walletClient.writeContract(requestArgs);

  const { logs } = await publicClient.waitForTransactionReceipt({
    hash: hash
  });

  let tokenId: any;
  if (logs[0].topics[3]) {
    tokenId = parseInt(logs[0].topics[3], 16);
  };

  console.log(`Minted NFT successful with hash: ` + JSON.stringify(hash) + `\nMinted NFT tokenId: ` + JSON.stringify(tokenId));
  return String(tokenId);
}

export async function approveSpender(WALLET_PRIVATE_KEY: Hex, value: number) {
  const account = privateKeyToAccount(WALLET_PRIVATE_KEY as Address);
  const baseConfig = {
    chain: chainId,
    transport: http(rpcProviderUrl)    
  };
  const walletClient = createWalletClient({
    ...baseConfig,
    account
  });
  const publicClient = createPublicClient(baseConfig);
  const contractAbi = {
    inputs: [
      { internalType: 'address', name: 'spender', type: 'address' },
      { internalType: "uint256", name: "value",type: "uint256" }
    ],
    name: 'approve',
    outputs: [
      { internalType: 'bool', name: '', type: 'bool' },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  };

  const requestArgs = {
    account: account,
    address: royaltyApproveAddress,
    functionName: 'approve',
    args: [royaltyPolicyLAPAddress, BigInt(value)],
    abi: [contractAbi]    
  };

  await publicClient.simulateContract(requestArgs);
  const hash = await walletClient.writeContract(requestArgs);
  await publicClient.waitForTransactionReceipt({
    hash: hash
  });
};

export async function mintAmount(WALLET_PRIVATE_KEY: Hex, amount: number){
  const account = privateKeyToAccount(WALLET_PRIVATE_KEY as Address);
  const baseConfig = {
    chain: chainId,
    transport: http(rpcProviderUrl)    
  };
  const walletClient = createWalletClient({
    ...baseConfig,
    account
  });
  const publicClient = createPublicClient(baseConfig);
  const contractAbi = {
    inputs: [
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: "uint256", name: "amount",type: "uint256" }
    ],
    name: 'mint',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  };

  const requestArgs = {
    address: royaltyApproveAddress,
    functionName: 'mint',
    args: [account.address, BigInt(amount)],
    abi: [contractAbi],
    account: account    
  };

  await publicClient.simulateContract(requestArgs);
  const hash = await walletClient.writeContract(requestArgs);
  await publicClient.waitForTransactionReceipt({
    hash: hash
  });
};

export async function setDisputeJudgement(WALLET_PRIVATE_KEY: Hex, disputeId: string, decision: boolean, data: Hex) {
  try {
    const account = privateKeyToAccount(WALLET_PRIVATE_KEY as Address);
    const baseConfig = {
      chain: chainId,
      transport: http(rpcProviderUrl)    
    };
    const walletClient = createWalletClient({
      ...baseConfig,
      account
    });
    const publicClient = createPublicClient(baseConfig);
    const contractAbi = {
      inputs: [
        { internalType: "uint256", name: "disputeId", type: "uint256" },
        { internalType: "bool", name: "decision", type: "bool" },
        { internalType: "bytes", name: "data", type: "bytes" }
      ],
      name: 'setDisputeJudgement',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    };

    const requestArgs = {
      address: disputeModuleAddress,
      functionName: 'setDisputeJudgement',
      args: [BigInt(disputeId), decision, data],
      abi: [contractAbi],
      account: account    
    };

    await publicClient.simulateContract(requestArgs);
    const hash = await walletClient.writeContract(requestArgs);
    await publicClient.waitForTransactionReceipt({
      hash: hash
    });
  } catch (error) {
    console.error(error);
  }
};

export async function getLatestTokenId(): Promise<number> {
  const contractAddress = nftContractAddress;
  let latestTokenId: number | undefined;

  try {
    const res = await fetch(`https://story-network.explorer.caldera.xyz/api/v2/tokens/${contractAddress}/instances`);
    if (res.ok) {
      const { items } = await res.json();
      // console.log(items);
      latestTokenId = items[0].id;
    }
  } catch (err) {
    console.error(err);
  }

  return Number(latestTokenId);
};

export async function mintNFTWithRetry(WALLET_PRIVATE_KEY: Hex): Promise<string> {
  let tokenId: string = '';

  for (let i = 0; i < 3; i++) {
    try {
      tokenId = await mintNFT(WALLET_PRIVATE_KEY);
      break;
    } catch (error) {      
      if (i === 1) {
        try{
          const latestTokenId = await getLatestTokenId();
          tokenId = await mintNFTWithTokenID(WALLET_PRIVATE_KEY, Number(latestTokenId) + 1);
          break;
        } catch (error) {
          tokenId = '';
        }        
      }
    }
  }

  return tokenId;
}

export async function checkMintResult(tokenIdA: string){
  if (tokenIdA === '') {
    throw new Error('Unable to mint NFT');
  };
}