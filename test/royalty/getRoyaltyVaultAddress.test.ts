import { privateKeyA, privateKeyB } from '../../config/config';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { expect } from 'chai';
chai.use(chaiAsPromised);
import '../setup';
import { getRoyaltyVaultAddress } from '../../utils/sdkUtils';
import { nonComLicenseTermsId, comUseLicenseTermsId1, comRemixLicenseTermsId1 } from '../setup';
import { Address } from 'viem';
import { mintNFTAndRegisterDerivative, mintNFTCreateRootIPandAttachPIL } from '../testUtils';

let ipIdA: Address;
let ipIdB: Address;
let ipIdC: Address;
let ipIdAChild: Address;
let ipIdBChild: Address;
let ipIdCChild: Address;

describe("SDK Test", function () {
    describe("Get royalty vault address - royalty.getRoyaltyVaultAddress", async function () {
        before("Register an IP asset",async function () {
            ipIdA = await mintNFTCreateRootIPandAttachPIL("A", privateKeyA, nonComLicenseTermsId);
            ipIdAChild = await mintNFTAndRegisterDerivative("B", privateKeyB, [ipIdA], [nonComLicenseTermsId]);
            ipIdB = await mintNFTCreateRootIPandAttachPIL("A", privateKeyA, comUseLicenseTermsId1);
            ipIdBChild = await mintNFTAndRegisterDerivative("B", privateKeyB, [ipIdB], [comUseLicenseTermsId1]);
            ipIdC = await mintNFTCreateRootIPandAttachPIL("A", privateKeyA, comRemixLicenseTermsId1);
            ipIdCChild = await mintNFTAndRegisterDerivative("B", privateKeyB, [ipIdC], [comRemixLicenseTermsId1]);
        });

        describe("Get royalty vault address - Positive tests", async function () {
            it("Root IP asset with non commercial social remix license", async function () {
                const response = await expect(
                    getRoyaltyVaultAddress("A", ipIdA)
                ).to.not.be.rejected;

                expect(response).to.be.a("string").and.to.be.equals("0x0000000000000000000000000000000000000000");
            });

            it("Derivative IP asset with non commercial social remix license", async function () {
                const response = await expect(
                    getRoyaltyVaultAddress("A", ipIdAChild)
                ).to.not.be.rejected;

                expect(response).to.be.a("string").and.to.be.equals("0x0000000000000000000000000000000000000000");
            });  

            it("Root IP asset with commercial use license", async function () {
                const response = await expect(
                    getRoyaltyVaultAddress("A", ipIdB)
                ).to.not.be.rejected;

                expect(response).to.be.a("string").and.to.not.be.equals("0x0000000000000000000000000000000000000000");
            });                

            it("Derivative IP asset with commercial use license", async function () {
                const response = await expect(
                    getRoyaltyVaultAddress("A", ipIdBChild)
                ).to.not.be.rejected;

                expect(response).to.be.a("string").and.to.not.be.empty;
            });                

            it("Root IP asset with commercial remix license", async function () {
                const response = await expect(
                    getRoyaltyVaultAddress("A", ipIdC)
                ).to.not.be.rejected;

                expect(response).to.be.a("string").and.to.not.be.equals("0x0000000000000000000000000000000000000000");
            });                

            it("Derivative IP asset with commercial remix license", async function () {
                const response = await expect(
                    getRoyaltyVaultAddress("A", ipIdCChild)
                ).to.not.be.rejected;

                expect(response).to.be.a("string").and.to.not.be.equals("0x0000000000000000000000000000000000000000");
            });                
        });

        describe("Get royalty vault address - Negative tests", async function () {
            it("Get royalty vault address with invalid ipId: undefined", async function () {
                let ipId: any;
                await expect(
                    getRoyaltyVaultAddress("A", ipId)
                ).to.be.rejectedWith(`royaltyVaultIpId address is invalid: undefined, Address must be a hex value of 20 bytes (40 hex characters) and match its checksum counterpart.`);
            });               

            it(`Get royalty vault address with invalid ipId: "0x0000"`, async function () {
                await expect(
                    getRoyaltyVaultAddress("A", "0x0000")
                ).to.be.rejectedWith(`royaltyVaultIpId address is invalid: 0x0000, Address must be a hex value of 20 bytes (40 hex characters) and match its checksum counterpart.`);
            });                                         
        });
    });
});
