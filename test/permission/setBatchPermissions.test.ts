import { nftContractAddress, privateKeyA, licensingModuleAddress, accountA, disputeModuleAddress, accountC, accountB } from '../../config/config';
import { registerIpAsset, setBatchPermissions } from '../../utils/sdkUtils';
import { checkMintResult, mintNFTWithRetry } from '../../utils/utils';
import { expect } from 'chai';
import { Address } from 'viem';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
import '../setup';
import { AccessPermission } from '@story-protocol/core-sdk';

let tokenIdA: string;
let ipIdA: Address;
let permissions: any;

describe('SDK Test', function () {
    describe('Test permission.setPermissions Function', async function () {
        before("Mint NFT and Register IP Asset",async function () {
            tokenIdA = await mintNFTWithRetry(privateKeyA);
            checkMintResult(tokenIdA);

            const response = await expect(
                registerIpAsset("A", nftContractAddress, tokenIdA, true)
            ).to.not.be.rejected
        
            expect(response.txHash).to.be.a("string").and.not.empty;
            expect(response.ipId).to.be.a("string").and.not.empty;
        
            ipIdA = response.ipId

            permissions = [
                {
                    ipId: ipIdA,
                    signer: accountA.address as Address,
                    to: licensingModuleAddress,
                    permission: AccessPermission.DENY,
                    func: "function setAll(address,string,bytes32,bytes32)",
                },
                {
                    ipId: ipIdA,
                    signer: accountC.address as Address,
                    to: disputeModuleAddress,
                    permission: AccessPermission.DENY,
                    func: "function setAll(address,string,bytes32,bytes32)",
                }
            ] 
        });

        it("Non-owner set batch permissions", async function () {           
            const response = await expect(
                setBatchPermissions("B", permissions, true)
            ).to.be.rejectedWith(`Failed to set batch permissions: The contract function "setBatchPermissions" reverted.`,
                                 `Error: AccessController__CallerIsNotIPAccountOrOwner()`);
        });

        it("Set batch permission with an empty IP id", async function () {
            let testIpId: any;
            permissions[0].ipId = testIpId;
            permissions[1].ipId = testIpId;
                        
            const response = await expect(
                setBatchPermissions("A", permissions, true)
            ).to.be.rejectedWith(`Failed to set batch permissions: ipId address is invalid: undefined, Address must be a hex value of 20 bytes (40 hex characters) and match its checksum counterpart.`);
        });

        it("Set batch permissions with a non-existent IP id", async function () {
            permissions[0].ipId = "0x1954631f55AC9a79CC4ec57103D23A9b2e8aDBfa";
            permissions[1].ipId = "0x1954631f55AC9a79CC4ec57103D23A9b2e8aDBfa";

            const response = await expect(
                setBatchPermissions("A", permissions, true)
            ).to.be.rejectedWith(`Failed to set batch permissions: IP id with 0x1954631f55AC9a79CC4ec57103D23A9b2e8aDBfa is not registered.`);
        });

        it("Set batch permissions with an invalid IP id", async function () {
            permissions[0].ipId = "0x00000";
            permissions[1].ipId = "0x00000";

            const response = await expect(
                setBatchPermissions("A", permissions, true)
            ).to.be.rejectedWith(`Failed to set batch permissions: ipId address is invalid: 0x00000, Address must be a hex value of 20 bytes (40 hex characters) and match its checksum counterpart.`);
        });

        it("Set batch permissions with an empty signer address", async function () {
            let accountAddress:any;
            permissions[0].ipId = ipIdA;
            permissions[1].ipId = ipIdA;
            permissions[0].signer = accountAddress;
            permissions[1].signer = accountAddress;
                        
            const response = await expect(
                setBatchPermissions("A", permissions, true)
            ).to.be.rejectedWith(`Failed to set batch permissions: Address "undefined" is invalid.`);
        });

        it("Set batch permissions with an invalid signer address", async function () {
            permissions[0].signer = "0x00000";
            permissions[1].signer = "0x00000";

            const response = await expect(
                setBatchPermissions("A", permissions, true)
            ).to.be.rejectedWith(`Failed to set batch permissions: Address "0x00000" is invalid.`);
        });

        it("Set batch permissions with an emty license module address", async function () {
            let testLicenseAddress: any;
            permissions[0].signer = accountA.address;
            permissions[1].signer = accountB.address;
            permissions[0].to = testLicenseAddress;
            permissions[1].to = testLicenseAddress;
                       
            const response = await expect(
                setBatchPermissions("A", permissions, true)
            ).to.be.rejectedWith(`Failed to set batch permissions: Address "undefined" is invalid.`);
        });
        
        it("Set batch permissions with an invalid license module address", async function () {
            permissions[0].to = "0x0000";
            permissions[1].to = "0x0000";

            const response = await expect(
                setBatchPermissions("A", permissions, true)
            ).to.be.rejectedWith(`Failed to set batch permissions: Address "0x0000" is invalid.`);
        });

        it("Set batch permissions with an invalid permission id (-1)", async function () {
            permissions[0].to = licensingModuleAddress;
            permissions[1].to = disputeModuleAddress;
            permissions[0].permission = -1;
            permissions[1].permission = -1;

            const response = await expect(
                setBatchPermissions("A", permissions, true)
            ).to.be.rejectedWith(`Failed to set batch permissions: Number "-1" is not in safe 256-bit unsigned integer range`);
        });

        it("Set permission with an invalid permission id (4)", async function () {
            permissions[0].permission = 4;
            permissions[1].permission = 4;

            const response = await expect(
                setBatchPermissions("A", permissions, true)
            ).to.be.rejectedWith(`Failed to set batch permissions: The contract function "setBatchPermissions" reverted.`, 
                                 `Error: AccessController__PermissionIsNotValid()`);
        });

        it("Set permission (permission id: 1) to wallet B", async function () {
            permissions[0].permission = AccessPermission.ALLOW;
            permissions[1].permission = AccessPermission.ALLOW;

            const response = await expect(
                setBatchPermissions("A", permissions, true)
            ).to.not.be.rejected;
        
            expect(response.txHash).to.be.a("string").and.not.empty;
            expect(response.success).to.be.true
        });

        it("Set permission (permission id: 1) that is already set 1 to wallet B", async function () {
            permissions[0].permission = AccessPermission.ALLOW;
            permissions[1].permission = AccessPermission.ALLOW;

            const response = await expect(
                setBatchPermissions("A", permissions, true)
            ).to.not.be.rejected;
        
            expect(response.txHash).to.be.a("string").and.not.empty;
            expect(response.success).to.be.true
        });

        it("Set permission (permission id: 2) to wallet B", async function () {
            permissions[0].permission = AccessPermission.DENY;
            permissions[1].permission = AccessPermission.DENY;

            const response = await expect(
                setBatchPermissions("A", permissions, true)
            ).to.not.be.rejected;
        
            expect(response.txHash).to.be.a("string").and.not.empty;
            expect(response.success).to.be.true
        });

        it("Set permission (permission id: 0) to wallet B", async function () {
            permissions[0].permission = AccessPermission.ABSTAIN;
            permissions[1].permission = AccessPermission.ABSTAIN;

            const response = await expect(
                setBatchPermissions("A", permissions, true)
            ).to.not.be.rejected;
        
            expect(response.txHash).to.be.a("string").and.not.empty;
            expect(response.success).to.be.true
        });
    });
});
