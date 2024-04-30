import { privateKeyA, nftContractAddress, arbitrationPolicyAddress } from '../../config/config';
import { mintNFTWithRetry, checkMintResult } from '../../utils/utils';
import { registerIpAsset, raiseDispute, cancelDispute, resolveDispute } from '../../utils/sdkUtils';
import { Hex } from 'viem';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { expect } from 'chai';
chai.use(chaiAsPromised);
import '../setup';

let tokenIdA: string;
let ipIdA: Hex;
let disputeId1: string;

describe("SDK Test", function () {
    describe("Test dispute.resolveDispute Function", async function () {
        before("Register IP assets and raise disputes", async function () {
            tokenIdA = await mintNFTWithRetry(privateKeyA);
            checkMintResult(tokenIdA);
            expect(tokenIdA).not.empty;

            const responseRegisterIpAsset = await expect(
                registerIpAsset("A", nftContractAddress, tokenIdA, true)
            ).to.not.be.rejected;

            expect(responseRegisterIpAsset.txHash).to.be.a("string").and.not.empty;
            expect(responseRegisterIpAsset.ipId).to.be.a("string").and.not.empty;

            ipIdA = responseRegisterIpAsset.ipId;

            const responseRaiseDispute1 = await expect(
                raiseDispute("B", ipIdA, arbitrationPolicyAddress, "test1", "PLAGIARISM", true)
            ).to.not.be.rejected;

            expect(responseRaiseDispute1.txHash).to.be.a("string").and.not.empty;
            expect(responseRaiseDispute1.disputeId).to.be.a("string").and.not.empty;

            disputeId1 = responseRaiseDispute1.disputeId;
        });

        it("Resolve dispute fail as undefined disputeId", async function () {
            let disputeId1: any;
            const response = await expect(                
                resolveDispute("B", disputeId1, "0x", true)
            ).to.be.rejectedWith("Failed to cancel dispute: Cannot convert undefined to a BigInt");
        });

        it("Resolve dispute fail as invalid disputeId", async function () {
            const response = await expect(                
                resolveDispute("B", "test", "0x", true)
            ).to.be.rejectedWith("Failed to cancel dispute: Cannot convert test to a BigInt");
        });

        it("Resolve dispute fail as non-existent disputeId", async function () {
            const response = await expect(                
                resolveDispute("B", "999999", "0x", true)
            ).to.be.rejectedWith("Failed to cancel dispute: The contract function \"resolveDispute\" reverted.", 
                                 "Error: DisputeModule__NotDisputeInitiator()");
        });

        it("Resolve dispute fail as undefined data", async function () {
            let data: any;
            const response = await expect(                
                resolveDispute("B", disputeId1, data, true)
            ).to.be.rejectedWith("Failed to cancel dispute: Cannot read properties of undefined (reading 'length')");
        });

        it("Resolve dispute fail as not dispute initiator", async function () {
            const response = await expect(                
                resolveDispute("A", disputeId1, "0x", true)
            ).to.be.rejectedWith("Failed to cancel dispute: The contract function \"resolveDispute\" reverted.", 
                                 "Error: DisputeModule__NotDisputeInitiator()");
        });

        it("Resolve dispute with waitForTransaction: true", async function () {
            const response = await expect(                              
                resolveDispute("B", disputeId1, "0x0000", true)
            ).to.be.rejectedWith("Failed to cancel dispute: The contract function \"resolveDispute\" reverted.", 
                                     "Error: DisputeModule__NotAbleToResolve()");
        });

        it("Resolve dispute faile as already resolved", async function () {
            const response = await expect(                
                resolveDispute("B", disputeId1, "0x0000", true)
            ).to.be.rejectedWith("Failed to cancel dispute: The contract function \"resolveDispute\" reverted.", 
                                 "Error: DisputeModule__NotDisputeInitiator()");
        });
    });
});