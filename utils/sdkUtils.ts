import { Hex, Address } from "viem";
import { clientA, clientB, } from '../config/config'

const storyClients = {
    A: clientA,
    B: clientB,
};

function getStoryClient(wallet: keyof typeof storyClients) {
    return storyClients[wallet];
}

interface PolicyOptions {
    [key: string]: any;
}

export const registerRootIp = async function (wallet: keyof typeof storyClients, policyId: string, tokenId: string, waitForTransaction: boolean) {
    try {
        const storyClient = getStoryClient(wallet);
        const response = await storyClient.ipAsset.registerRootIp({
            policyId: policyId,
            tokenContractAddress: process.env.MY_NFT_CONTRACT_ADDRESS as Address,
            tokenId: tokenId,
            txOptions: {
                waitForTransaction: waitForTransaction
            }
        })
        console.log(response)
        return response
    } catch (error) {
        console.log(error)
    }
}

export const registerPILPolicy = async function (wallet: keyof typeof storyClients, transferable: boolean, waitForTransaction: boolean, options?: PolicyOptions) {
    try {
        const storyClient = getStoryClient(wallet);
        const response = await storyClient.policy.registerPILPolicy({
            transferable: transferable,
            ...options,
            txOptions: {
                waitForTransaction: waitForTransaction,
            }
        })
        console.log(response)
        return response
    } catch (error) {
        console.log(error)
    }
}

export const addPolicyToIp = async function (wallet: keyof typeof storyClients, ipId: Hex, policyId: string, waitForTransaction: boolean) {
    try {
        const storyClient = getStoryClient(wallet);
        const response = await storyClient.policy.addPolicyToIp({
            ipId: ipId,
            policyId: policyId,
            txOptions: {
                waitForTransaction: waitForTransaction,
            }
        })
        console.log(response)
        return response
    } catch (error) {
        console.log(error)
    }
}

export const mintLicense = async function (wallet: keyof typeof storyClients, policyId: string, ipId: Hex, receiverAddress: Hex, waitForTransaction: boolean) {
    try {
        const storyClient = getStoryClient(wallet);
        const response = await storyClient.license.mintLicense({
            policyId: policyId,
            licensorIpId: ipId,
            mintAmount: 1,
            receiverAddress: receiverAddress,
            txOptions: {
                waitForTransaction: waitForTransaction,
            }
        })
        console.log(response)
        return response
    } catch (error) {
        console.log(error)
    }
}

export const registerDerivativeIp = async function (wallet: keyof typeof storyClients, licenseIds: string[], tokenId: string, waitForTransaction: boolean) {
    try {
        const storyClient = getStoryClient(wallet);
        const response = await storyClient.ipAsset.registerDerivativeIp({
            licenseIds: licenseIds,
            tokenContractAddress: process.env.MY_NFT_CONTRACT_ADDRESS as Address,
            tokenId: tokenId,
            txOptions: {
                waitForTransaction: waitForTransaction,
            },
        })
        console.log(response)
        return response
    } catch (error) {
        console.log(error)
    }
}

export const linkIpToParent = async function (wallet: keyof typeof storyClients, licenseIds: string[], childIpId: Hex, waitForTransaction: boolean) {
    try {
        const storyClient = getStoryClient(wallet);
        const response = await storyClient.license.linkIpToParent({
            licenseIds: licenseIds,
            childIpId: childIpId,
            txOptions: {
              waitForTransaction: waitForTransaction,
            },
          })
        console.log(response)
        return response
    } catch (error) {
        console.log(error)
    }
}