import { nftContractAddress, privateKeyA, accountB, licensingModuleAddress, accountA } from '../../config/config';
import { createSetPermissionSignature, registerIpAsset } from '../../utils/sdkUtils';
import { checkMintResult, mintNFTWithRetry } from '../../utils/utils';
import { expect } from 'chai';
import { Address } from 'viem';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
import '../setup';

let tokenIdA: string;
let ipIdA: Address;
const func = "function setAll(address,string,bytes32,bytes32)"

describe('SDK Test', function () {
    describe('Test permission.createSetPermissionSignature Function', async function () {
        before("Mint NFT and Register IP Asset",async function () {
            tokenIdA = await mintNFTWithRetry(privateKeyA);
            checkMintResult(tokenIdA);

            const response = await expect(
                registerIpAsset("A", nftContractAddress, tokenIdA, true)
            ).to.not.be.rejected
        
            expect(response.txHash).to.be.a("string").and.not.empty;
            expect(response.ipId).to.be.a("string").and.not.empty;
        
            ipIdA = response.ipId
        });

        it("Non-owner create set permission signature", async function () {            
            const response = await expect(
                createSetPermissionSignature("B", ipIdA, accountB.address, licensingModuleAddress, 1, func, 6000n, true)
            ).to.be.rejectedWith(`Failed to create set permission signature: The contract function "executeWithSig" reverted with the following signature:`, 
                                 `0xb3e96921`);
        });

        it("Create set permission signature with an empty IP id", async function () {
            let testIpId:any;            
            const response = await expect(
                createSetPermissionSignature("A", testIpId, accountA.address, licensingModuleAddress, 1, func, 6000n, true)
            ).to.be.rejectedWith(`Failed to create set permission signature: ipId address is invalid: undefined, Address must be a hex value of 20 bytes (40 hex characters) and match its checksum counterpart.`);
        });

        it("Create set permission signature with a non-existent IP id", async function () {            
            const response = await expect(
                createSetPermissionSignature("B", "0x1954631f55AC9a79CC4ec57103D23A9b2e8aDBfa", accountB.address, licensingModuleAddress, 1, func, 6000n, true)
            ).to.be.rejectedWith(`Failed to create set permission signature: IP id with 0x1954631f55AC9a79CC4ec57103D23A9b2e8aDBfa is not registered.`);
        });

        it("Create set permission signature with an invalid IP id", async function () {            
            const response = await expect(
                createSetPermissionSignature("A", "0x00000", accountA.address, licensingModuleAddress, 1, func, 6000n, true)
            ).to.be.rejectedWith(`Failed to create set permission signature: ipId address is invalid: 0x00000, Address must be a hex value of 20 bytes (40 hex characters) and match its checksum counterpart.`);
        });

        it("Create set permission signature with an empty signer address", async function () {
            let accountAddress:any;            
            const response = await expect(
                createSetPermissionSignature("A", ipIdA, accountAddress, licensingModuleAddress, 1, func, 6000n, true)
            ).to.be.rejectedWith(`Failed to create set permission signature: request.signer address is invalid: undefined, Address must be a hex value of 20 bytes (40 hex characters) and match its checksum counterpart.`);
        });

        it("Create set permission signature with an invalid signer address", async function () {            
            const response = await expect(
                createSetPermissionSignature("A", ipIdA, "0x00000", licensingModuleAddress, 1, func, 6000n, true)
            ).to.be.rejectedWith(`Failed to create set permission signature: request.signer address is invalid: 0x00000, Address must be a hex value of 20 bytes (40 hex characters) and match its checksum counterpart.`);
        });

        it("Create set permission signature with incorrect owner address", async function () {            
            const response = await expect(
                createSetPermissionSignature("A", ipIdA, accountB.address, licensingModuleAddress, 4, func, 6000n, true)
            ).to.be.rejectedWith(`Failed to create set permission signature: The contract function "executeWithSig" reverted.`, 
                                 `Error: IPAccount__InvalidSignature()`);
        });

        it("Create set permission signature with an emty license module address", async function () {
            let testLicenseAddress: any;           
            const response = await expect(
                createSetPermissionSignature("A", ipIdA, accountA.address, testLicenseAddress, 1, func, 6000n, true)
            ).to.be.rejectedWith(`Failed to create set permission signature: request.to address is invalid: undefined, Address must be a hex value of 20 bytes (40 hex characters) and match its checksum counterpart.`);
        });
        
        it("Create set permission signature with an invalid license module address", async function () {            
            const response = await expect(
                createSetPermissionSignature("A", ipIdA, accountA.address, "0x0000", 1, func, 6000n, true)
            ).to.be.rejectedWith(`Failed to create set permission signature: request.to address is invalid: 0x0000, Address must be a hex value of 20 bytes (40 hex characters) and match its checksum counterpart.`);
        });

        it("Create set permission signature with an invalid permission id (-1)", async function () {            
            const response = await expect(
                createSetPermissionSignature("A", ipIdA, accountA.address, licensingModuleAddress, -1, func, 6000n, true)
            ).to.be.rejectedWith(`Failed to create set permission signature: Number "-1" is not in safe 256-bit unsigned integer range`);
        });

        it("Create set permission (permission id: 1) signature", async function () {            
            const response = await expect(
                createSetPermissionSignature("A", ipIdA, accountA.address, licensingModuleAddress, 1, func, 6000n, true)
            ).to.not.be.rejected;
        
            expect(response.txHash).to.be.a("string").and.not.empty;
            expect(response.success).to.be.true
        });

        it("Create set permission (permission id: 1) signature again", async function () {            
            const response = await expect(
                createSetPermissionSignature("A", ipIdA, accountA.address, licensingModuleAddress, 1, func, 6000n, true)
            ).to.not.be.rejected;
        
            expect(response.txHash).to.be.a("string").and.not.empty;
            expect(response.success).to.be.true
        });

        it("Create set permission (permission id: 2) signature", async function () {            
            const response = await expect(
                createSetPermissionSignature("A", ipIdA, accountA.address, licensingModuleAddress, 2, func, 6000n, true)
            ).to.not.be.rejected;
        
            expect(response.txHash).to.be.a("string").and.not.empty;
            expect(response.success).to.be.true
        });

        it("Create set permission (permission id: 0) signature", async function () {            
            const response = await expect(
                createSetPermissionSignature("A", ipIdA, accountA.address, licensingModuleAddress, 0, func, 6000n, true)
            ).to.not.be.rejected;
        
            expect(response.txHash).to.be.a("string").and.not.empty;
            expect(response.success).to.be.true
        });
    });
});
