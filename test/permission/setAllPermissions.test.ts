import { nftContractAddress, privateKeyA, accountB } from '../../config/config';
import { registerIpAsset, setAllPermissions } from '../../utils/sdkUtils';
import { checkMintResult, mintNFTWithRetry } from '../../utils/utils';
import { expect } from 'chai';
import { Address } from 'viem';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
import '../setup';

let tokenIdA: string;
let ipIdA: Address;

describe('SDK Test', function () {
    describe('Test permission.setAllPermissions Function', async function () {
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

        it("Non-owner set all permission", async function () {            
            const response = await expect(
                setAllPermissions("B", ipIdA, accountB.address, 1, true)
            ).to.be.rejectedWith(`Failed to set all permissions: The contract function "setAllPermissions" reverted.`, 
                                 `Error: AccessController__CallerIsNotIPAccountOrOwner()`);
        });

        it("Set all permission with an empty IP id", async function () {
            let testIpId:any;            
            const response = await expect(
                setAllPermissions("A", testIpId, accountB.address, 1, true)
            ).to.be.rejectedWith(`Failed to set all permissions: ipId address is invalid: undefined, Address must be a hex value of 20 bytes (40 hex characters) and match its checksum counterpart.`);
        });

        it("Set all permission with a non-existent IP id", async function () {            
            const response = await expect(
                setAllPermissions("B", "0x1954631f55AC9a79CC4ec57103D23A9b2e8aDBfa", accountB.address, 1, true)
            ).to.be.rejectedWith(`Failed to set all permissions: IP id with 0x1954631f55AC9a79CC4ec57103D23A9b2e8aDBfa is not registered.`);
        });

        it("Set all permission with an invalid IP id", async function () {            
            const response = await expect(
                setAllPermissions("A", "0x00000", accountB.address, 1, true)
            ).to.be.rejectedWith(`Failed to set all permissions: ipId address is invalid: 0x00000, Address must be a hex value of 20 bytes (40 hex characters) and match its checksum counterpart.`);
        });

        it("Set all permission with an empty signer address", async function () {
            let accountAddress:any;            
            const response = await expect(
                setAllPermissions("A", ipIdA, accountAddress, 1, true)
            ).to.be.rejectedWith(`Failed to set all permissions: Address "undefined" is invalid.`);
        });

        it("Set all permission with an invalid signer address", async function () {            
            const response = await expect(
                setAllPermissions("A", ipIdA, "0x00000", 1, true)
            ).to.be.rejectedWith(`Failed to set all permissions: Address "0x00000" is invalid.`);
        });

        it("Set all permission with an invalid permission id (-1)", async function () {            
            const response = await expect(
                setAllPermissions("A", ipIdA, accountB.address, -1, true)
            ).to.be.rejectedWith(`Failed to set all permissions: Number "-1" is not in safe 256-bit unsigned integer range`);
        });

        it("Set all permission with an invalid permission id (4)", async function () {            
            const response = await expect(
                setAllPermissions("A", ipIdA, accountB.address, 4, true)
            ).to.be.rejectedWith(`Failed to set all permissions: The contract function "setAllPermissions" reverted.`, 
                                 `Error: AccessController__PermissionIsNotValid()`);
        });

        it("Set all permission (permission id: 1) to wallet B", async function () {            
            const response = await expect(
                setAllPermissions("A", ipIdA, accountB.address, 1, true)
            ).to.not.be.rejected;
        
            expect(response.txHash).to.be.a("string").and.not.empty;
            expect(response.success).to.be.true
        });

        it("Set all permission (permission id: 1) that is already set 1 to wallet B", async function () {            
            const response = await expect(
                setAllPermissions("A", ipIdA, accountB.address, 1, true)
            ).to.not.be.rejected;
        
            expect(response.txHash).to.be.a("string").and.not.empty;
            expect(response.success).to.be.true
        });

        it("Set all permission (permission id: 2) to wallet B", async function () {            
            const response = await expect(
                setAllPermissions("A", ipIdA, accountB.address, 2, true)
            ).to.not.be.rejected;
        
            expect(response.txHash).to.be.a("string").and.not.empty;
            expect(response.success).to.be.true
        });

        it("Set all permission (permission id: 0) to wallet B", async function () {            
            const response = await expect(
                setAllPermissions("A", ipIdA, accountB.address, 0, true)
            ).to.not.be.rejected;
        
            expect(response.txHash).to.be.a("string").and.not.empty;
            expect(response.success).to.be.true
        });
    });
});
